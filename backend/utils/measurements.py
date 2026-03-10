import numpy as np
from PIL import Image

def estimate_feature_area(image_path: str, detected_class: str, total_land_area_sqft: float, confidence: float) -> dict:
    """
    Step 5: Estimate Physical Feature Measurements
    
    This function estimates the area of the detected feature based on:
    - The detected class (e.g., building, bare_lands, vegetations)
    - Total land area (Extent of Land - EOL)
    - A pixel-based approximation or heuristic scaling.
    
    Since we are currently using classification models rather than full semantic segmentation,
    we use a heuristic approach combined with the model's confidence to estimate the relative coverage.
    """
    try:
        # Load the image to analyze rough pixel distribution (Mocking segmentation logic for now)
        img = Image.open(image_path).convert("L")  # Convert to grayscale
        arr = np.array(img)
        
        # A simple thresholding heuristic to estimate foreground vs background
        # In a real segmentation model, this would be the actual pixel count of the segmented mask
        threshold = np.mean(arr)
        if detected_class == "buildings" or detected_class == "building_front":
            # Buildings tend to be brighter/different contrast in many satellite images
            foreground_pixels = np.sum(arr > threshold)
        else:
            # Vegetation / bare land might be darker
            foreground_pixels = np.sum(arr < threshold)
            
        total_pixels = arr.size
        
        # Coverage ratio estimated from basic thresholding
        raw_coverage_ratio = foreground_pixels / total_pixels
        
        # Adjust coverage ratio based on confidence. 
        # High confidence means the feature likely dominates the image.
        adjusted_coverage = raw_coverage_ratio * confidence
        
        # Ensure it's within logical bounds (10% to 90% of the parcel)
        adjusted_coverage = max(0.1, min(0.9, adjusted_coverage))
        
        # Calculate final estimated area
        estimated_area = total_land_area_sqft * adjusted_coverage
        
        return {
            "feature_type": detected_class,
            "total_land_area_sqft": total_land_area_sqft,
            "estimated_coverage_percentage": round(adjusted_coverage * 100, 2),
            "estimated_area_sqft": round(estimated_area, 2)
        }
        
    except Exception as e:
        print(f"Measurement Error: {str(e)}")
        # Fallback values if image processing fails
        fallback_coverage = 0.5 * confidence
        return {
            "feature_type": detected_class,
            "total_land_area_sqft": total_land_area_sqft,
            "estimated_coverage_percentage": round(fallback_coverage * 100, 2),
            "estimated_area_sqft": round(total_land_area_sqft * fallback_coverage, 2),
            "note": "Using fallback estimation due to processing error."
        }
