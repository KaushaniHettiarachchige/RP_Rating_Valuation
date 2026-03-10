from fastapi import FastAPI

from app.api.public_routes import router as public_router
from app.api.official_routes import router as official_router

app = FastAPI(title="ValuerBot")

app.include_router(public_router)
app.include_router(official_router)