# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.public_routes import router as public_router
from app.api.official_routes import router as official_router
from app.api.find_features import router as find_router

app = FastAPI(title="ValuerBot")




app.add_middleware(
    CORSMiddleware,
      allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

app.include_router(public_router)
app.include_router(official_router)
app.include_router(find_router)