
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.find_features import router as find_router
from app.api.find_Places import router as find_places_router

app = FastAPI(title="ValuerBot")




app.add_middleware(
    CORSMiddleware,
      allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


app.include_router(find_router)
app.include_router(find_places_router)    