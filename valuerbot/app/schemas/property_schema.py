from pydantic import BaseModel

class PropertyInput(BaseModel):

    latitude: float
    longitude: float
    land_size: float