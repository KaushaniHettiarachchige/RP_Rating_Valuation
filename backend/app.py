from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import numpy as np
#import cv2
import tensorflow as tf
from pydantic import BaseModel
from typing import List, Dict, Optional
import requests
from PIL import Image
from io import BytesIO
import os

from utils.preprocess import load_image
from utils.valuation import calculate_rates_payable, calculate_y2_equation_2
from utils.image_utils import fetch_satellite_image, fetch_street_view_image
from utils.measurements import estimate_feature_area
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Valuerbot API")

# Serve images for the assessment report
if not os.path.exists("images"):
    os.makedirs("images")
app.mount("/images", StaticFiles(directory="images"), name="images")

# Allow React frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models once at startup
SAT_MODEL_PATH = "models/satellite_model.h5"
ST_MODEL_PATH  = "models/street_view_model.h5"

sat_model = tf.keras.models.load_model(SAT_MODEL_PATH)
st_model  = tf.keras.models.load_model(ST_MODEL_PATH)

SAT_CLASSES = ["bare_lands", "buildings", "vegetations"]
ST_CLASSES  = ["boundary_wall_gates", "building_front", "vegetation"]

# --- UPDATED PREDICT FUNCTION ---
def predict(model, classes, img_arr):
    preds = model.predict(img_arr, verbose=0)[0]
    
    # Debugging
    print(f"DEBUG - Raw Probabilities: {dict(zip(classes, preds))}")

    idx = int(np.argmax(preds))
    conf = float(np.max(preds))

    # Reject irrelevant images (dogs, humans, etc.) based on confidence
    THRESHOLD = 0.80 
    if conf < THRESHOLD:
        raise HTTPException(
            status_code=422, 
            detail=f"Irrelevant image detected (Confidence: {conf:.2f}). Please upload a valid property image."
        )

    return classes[idx], conf

# Data Models
class ParcelInfo(BaseModel):
    parcel_id: str
    boundary_polygon: List[List[float]]
    extent_of_land: float = 0.0
    location_details: Dict[str, str] = {}
    accessibility: str = "Unknown"
    latitude: float = 0.0
    longitude: float = 0.0

class PreprocessRequest(BaseModel):
    satellite_image_path: str
    street_view_image_path: str

class MeasurementRequest(BaseModel):
    satellite_image_path: str
    predicted_class: str
    confidence: float
    total_land_area_sqft: float
    boundary_polygon: Optional[List[List[float]]] = None

#Endpoints
@app.get("/")
def root():
    return {"status": "ok", "message": "Valuerbot backend running"}

# --- UPDATED SATELLITE PREDICTION ---
@app.post("/predict/satellite")
async def predict_satellite(file: UploadFile = File(...)):
    try:
        # Standardized to 128x128 to match Colab
        img_arr = load_image(file.file, size=(128,128))
        pred_class, conf = predict(sat_model, SAT_CLASSES, img_arr)
        return {"predicted_class": pred_class, "confidence": conf}
    except HTTPException as e:
        raise e

# --- UPDATED STREET PREDICTION ---
@app.post("/predict/street")
async def predict_street(file: UploadFile = File(...)):
    try:
        img_arr = load_image(file.file, size=(128,128))
        pred_class, conf = predict(st_model, ST_CLASSES, img_arr)
        return {"predicted_class": pred_class, "confidence": conf}
    except HTTPException as e:
        raise e

@app.post("/valuation/calculate")
async def valuation(payload: dict):
    result = calculate_rates_payable(
        monthly_rent=payload.get("monthly_rent"),
        annual_value=payload.get("annual_value"),
        property_use=payload.get("property_use", "residential"),
        council_rate_pct=payload.get("council_rate_pct"),
        land_area_m2=payload.get("land_area_m2"),
        sat_class=payload.get("sat_class"),
        st_class=payload.get("st_class"),
        confidence=payload.get("confidence")
    )
    return {
        "annual_value": result.annual_value,
        "annual_rates": result.annual_rates,
        "quarterly_rates": result.quarterly_rates,
        "explanation": result.explanation
    }

parcel_db = {}

@app.post("/api/parcel/receive")
async def receive_parcel_info(parcel_info: ParcelInfo):
    try:
        parcel_id = parcel_info.parcel_id
        parcel_db[parcel_id] = parcel_info.dict()
        print(f"Received and stored Parcel ID: {parcel_id}")

        # Automatically acquire images for this parcel
        sat_img = fetch_satellite_image(parcel_info.latitude, parcel_info.longitude)
        st_img = fetch_street_view_image(parcel_info.latitude, parcel_info.longitude, heading=90)

        # Ensure directory
        if not os.path.exists("images"): os.makedirs("images")
        
        sat_path = f"images/satellite_{parcel_id}.png"
        st_path = f"images/street_view_{parcel_id}.png"
        
        sat_img.save(sat_path)
        st_img.save(st_path)

        return {
            "status": "success",
            "message": f"Parcel {parcel_id} received and images acquired successfully.",
            "data": parcel_db[parcel_id],
            "satellite_image_path": sat_path,
            "street_view_image_path": st_path
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/get-property-images")
async def get_property_images(parcel_info: ParcelInfo):
    # This endpoint is redundant as images are now fetched in /api/parcel/receive
    # but kept for compatibility if needed elsewhere.
    try:
        satellite_image = fetch_satellite_image(parcel_info.latitude, parcel_info.longitude)
        street_view_image = fetch_street_view_image(parcel_info.latitude, parcel_info.longitude, heading=90)

        # Ensure directory
        if not os.path.exists("images"): os.makedirs("images")
        
        sat_path = f"images/satellite_{parcel_info.parcel_id}.png"
        st_path = f"images/street_view_{parcel_info.parcel_id}.png"
        
        satellite_image.save(sat_path)
        street_view_image.save(st_path)

        return {
            "message": "Images fetched and saved successfully.",
            "satellite_image_path": sat_path,
            "street_view_image_path": st_path
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

# --- UPDATED FEATURE DETECTION ENDPOINT ---
@app.post("/preprocess-images")
async def preprocess_images(request: PreprocessRequest):
    try:
        # Safety: Remove 'backend/' prefix if it was included by mistake
        sat_p = request.satellite_image_path.replace("backend/", "").replace("backend\\", "")
        st_p = request.street_view_image_path.replace("backend/", "").replace("backend\\", "")

        # Step 3: Resize and format images natively
        with open(sat_p, 'rb') as f_sat:
            sat_arr = load_image(f_sat, size=(128,128))
        with open(st_p, 'rb') as f_st:
            st_arr = load_image(f_st, size=(128,128))

        return {
            "status": "success",
            "message": "Images resized and normalized to (1, 128, 128, 3). Ready for AI detection.",
            "satellite_shape": list(sat_arr.shape),
            "street_view_shape": list(st_arr.shape)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Preprocessing Error: {str(e)}")

@app.post("/detect-features")
async def detect_features(request: PreprocessRequest):
    try:
        # Load images from local path
        with open(request.satellite_image_path, 'rb') as sat_file:
            sat_array = load_image(sat_file, size=(128,128))
        with open(request.street_view_image_path, 'rb') as street_file:
            street_array = load_image(street_file, size=(128,128))
        
        sat_class, sat_conf = predict(sat_model, SAT_CLASSES, sat_array)
        st_class, st_conf = predict(st_model, ST_CLASSES, street_array)
        
        return {
            "message": "Features successfully detected.",
            "satellite_analysis": {
                "predicted_class": sat_class, 
                "confidence": round(sat_conf, 4)
            },
            "street_view_analysis": {
                "predicted_class": st_class, 
                "confidence": round(st_conf, 4)
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error detecting features: {str(e)}")

@app.post("/estimate-measurements")
async def estimate_measurements(request: MeasurementRequest):
    try:
        clean_path = request.satellite_image_path.replace("backend/", "").replace("backend\\", "")

        result = estimate_feature_area(
            image_path=clean_path,
            detected_class=request.predicted_class,
            total_land_area_sqft=request.total_land_area_sqft,
            confidence=request.confidence
        )
        return {
            "message": "Physical measurements estimated successfully.",
            "status": "success",
            "total_land_area_sqft": round(request.total_land_area_sqft, 2),
            "estimated_feature_area_sqft": result.get("estimated_area_sqft", 0),
            "coverage_percentage": result.get("coverage_percentage", 0),
            "method": "Automated Pixel Segmentation"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error estimating measurements: {str(e)}")

class VariablesRequest(BaseModel):
    parcel_id: str
    fab: float    # Floor area of building (From feature measurement step)
    aop: str      #Accessibility (From component 1)
    lop: str      # Location (From component 1)
    noc: str      # Nature of Construction (Manual)  
    cob: str      # Condition of building (Manual) 
    conb: str     # Convenience of building (Manual) 
    aob: int      # Age of building (Manual)
    tof: str      # Type of floor (Manual)
    dob: str      # Design of building (Manual)
    tob: str      # Type of building

@app.post("/collect-variables")
async def collect_variables(request: VariablesRequest):
    try:
        return {
            "message": "Step 6: Variables successfully aggregated for Equation (2).",
            "data": request.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during variable collection: {str(e)}")

@app.post("/calculate-y2")
async def calculate_y2(request: VariablesRequest):
    try:
        result = calculate_y2_equation_2(
            fab=request.fab,
            noc=request.noc,
            aop=request.aop,
            lop=request.lop,
            cob=request.cob,
            conb=request.conb,
            aob=request.aob,
            tof=request.tof,
            dob=request.dob,
            tob=request.tob
        )
        return {
            "message": "Step 7 & 8: Equation (2) and Building Value calculated.",
            "data": {
                "y2_value": result["y2_value"],
                "building_value": result["building_value"],
                "base_rate_sqft": result.get("base_rate", 5000),
                "depreciation": result.get("depreciation_applied", 0),
                "explanation": result.get("explanation", "")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during Equation (2) calculation: {str(e)}")

@app.post("/finalize-assessment")
async def finalize_assessment(payload: dict):
    try:
        return {
            "assessment_id": f"VAL-{np.random.randint(1000, 9999)}",
            "parcel_id": payload.get("parcel_id", "REF-001"),
            "status": "Ready for Approval",
            "summary": {
                "total_building_value": payload.get("building_value", 0.0),
                "confidence_score": payload.get("confidence", 0.85),
                "timestamp": "2026-03-07T14:21:00Z"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error finalizing assessment: {str(e)}")