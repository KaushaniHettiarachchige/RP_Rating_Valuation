# import os
# import requests
# from io import BytesIO
# import io
# from PIL import Image, ImageDraw, ImageFont

# def get_polygon_center(boundary_polygon):
#     """
#     Calculate the center (centroid) of a given polygon.
#     boundary_polygon: List of [latitude, longitude] or [longitude, latitude] coordinates.
#     """
#     if not boundary_polygon:
#         return 0.0, 0.0
    
#     # Simple average of coordinates
#     lat_sum = sum(coord[0] for coord in boundary_polygon)
#     lon_sum = sum(coord[1] for coord in boundary_polygon)
    
#     center_lat = lat_sum / len(boundary_polygon)
#     center_lon = lon_sum / len(boundary_polygon)
    
#     return center_lat, center_lon

# def create_placeholder_image(text="Placeholder"):
#     img = Image.new('RGB', (224, 224), color = (73, 109, 137))
#     d = ImageDraw.Draw(img)
#     d.text((10,100), text, fill=(255,255,0))
    
#     img_byte_arr = io.BytesIO()
#     img.save(img_byte_arr, format='JPEG')
#     return img_byte_arr.getvalue()

# def acquire_satellite_image(boundary_polygon: list, api_key: str = None) -> bytes:
#     """
#     Acquires a satellite image for the given parcel polygon.
#     """
#     if not api_key:
#         print("No API key provided. Generating placeholder satellite image.")
#         return create_placeholder_image("Satellite Image")

#     # Calculate center of the parcel to focus the satellite image
#     center_lat, center_lon = get_polygon_center(boundary_polygon)
#     zoom = 20 # Increased zoom for better building classification
    
#     # 1. Use Google Maps Static API (or any other satellite image provider)
#     # This is a sample implementation using Google Static Maps API
#     url = f"https://maps.googleapis.com/maps/api/staticmap?center={center_lat},{center_lon}&zoom={zoom}&size=400x400&maptype=satellite&key={api_key}"
    
#     try:
#         response = requests.get(url)
#         response.raise_for_status()
#         return response.content
#     except requests.exceptions.RequestException as e:
#         print(f"Error acquiring satellite image: {e}")
#         # Fallback to placeholder on error
#         return create_placeholder_image("Satellite Image Error")

# def acquire_street_view_image(boundary_polygon: list, api_key: str = None) -> bytes:
#     """
#     Acquires a street view image for the given parcel polygon.
#     """
#     if not api_key:
#         print("No API key provided. Generating placeholder street view image.")
#         return create_placeholder_image("Street View Image")

#     # Calculate center of the parcel
#     center_lat, center_lon = get_polygon_center(boundary_polygon)
    
#     # 2. Use Google Street View Static API
#     url = f"https://maps.googleapis.com/maps/api/streetview?size=400x400&location={center_lat},{center_lon}&fov=80&heading=70&pitch=0&key={api_key}"
    
#     try:
#         response = requests.get(url)
#         response.raise_for_status()
#         return response.content
#     except requests.exceptions.RequestException as e:
#         print(f"Error acquiring street view image: {e}")
#         # Fallback to placeholder on error
#         return create_placeholder_image("Street View Error")

# def save_image(image_bytes: bytes, filename: str, save_dir: str = "acquired_images"):
#     """
#     Saves the acquired image bytes to a local directory.
#     """
#     # Ensure the directory exists
#     os.makedirs(save_dir, exist_ok=True)
#     filepath = os.path.join(save_dir, filename)
    
#     with open(filepath, 'wb') as f:
#         f.write(image_bytes)
        
#     return filepath

import math
import requests
import os

# Create a directory to save acquired images
IMAGE_DIR = "data/acquired_images"
os.makedirs(IMAGE_DIR, exist_ok=True)

def calculate_centroid(polygon: list) -> tuple:
    """
    Calculate the centroid (lat, lon) of a polygon.
    polygon: List of [longitude, latitude] pairs. (Standard GeoJSON format)
    Returns:
        (latitude, longitude)
    """
    if not polygon:
        return None, None
        
    sum_lon = 0
    sum_lat = 0
    num_points = len(polygon)
    
    for point in polygon:
        sum_lon += point[0]
        sum_lat += point[1]
        
    # Standard format is [longitude, latitude]
    return sum_lat / num_points, sum_lon / num_points

def fetch_satellite_image(lat: float, lon: float, api_key: str = None) -> str:
    """
    Fetch a satellite image using a Map Service API (like Google Maps Static API).
    (If api_key is None, returns a mock image path for testing)
    """
    save_path = os.path.join(IMAGE_DIR, f"sat_{lat:.6f}_{lon:.6f}.jpg")
    
    if api_key:
        # Example using Google Maps Static API
        url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lon}&zoom=20&size=400x400&maptype=satellite&key={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return save_path
        else:
            raise Exception(f"Failed to fetch satellite image. Status: {response.status_code}")
    else:
        # MOCK IMPLEMENTATION: Create a dummy text file to act as the image in development
        with open(save_path, 'w') as f:
            f.write("MOCK SATELLITE IMAGE DATA")
        return save_path

def fetch_street_view_image(lat: float, lon: float, api_key: str = None) -> str:
    """
    Fetch a street view image using Google Street View API.
    """
    save_path = os.path.join(IMAGE_DIR, f"street_{lat:.6f}_{lon:.6f}.jpg")
    
    if api_key:
        url = f"https://maps.googleapis.com/maps/api/streetview?size=400x400&location={lat},{lon}&fov=80&heading=70&pitch=0&key={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return save_path
        else:
            raise Exception("Failed to fetch street view image.")
    else:
        # MOCK IMPLEMENTATION
        with open(save_path, 'w') as f:
            f.write("MOCK STREET VIEW IMAGE DATA")
        return save_path

# Added wrapper functions to match expected import names

def acquire_satellite_image(boundary_polygon: list, api_key: str = None) -> bytes:
    """Acquire a satellite image for the given polygon and return image bytes.
    Uses the existing fetch_satellite_image to download the image to a file,
    then reads and returns the raw bytes.
    """
    lat, lon = calculate_centroid(boundary_polygon)
    if lat is None:
        raise ValueError("Invalid polygon: cannot compute centroid")
    image_path = fetch_satellite_image(lat, lon, api_key)
    with open(image_path, "rb") as f:
        return f.read()

def acquire_street_view_image(boundary_polygon: list, api_key: str = None) -> bytes:
    """Acquire a street view image for the given polygon and return image bytes.
    Uses fetch_street_view_image internally.
    """
    lat, lon = calculate_centroid(boundary_polygon)
    if lat is None:
        raise ValueError("Invalid polygon: cannot compute centroid")
    image_path = fetch_street_view_image(lat, lon, api_key)
    with open(image_path, "rb") as f:
        return f.read()

def save_image(image_bytes: bytes, filename: str, save_dir: str = IMAGE_DIR) -> str:
    """Save image bytes to a file in the specified directory.
    Returns the full file path.
    """
    os.makedirs(save_dir, exist_ok=True)
    filepath = os.path.join(save_dir, filename)
    with open(filepath, "wb") as f:
        f.write(image_bytes)
    return filepath
