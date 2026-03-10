# import requests
# from PIL import Image
# from io import BytesIO

# def fetch_satellite_image(latitude, longitude, zoom_level=18, size='600x600', api_key='YOUR_GOOGLE_API_KEY'):
#     url = f"https://maps.googleapis.com/maps/api/staticmap?center={latitude},{longitude}&zoom={zoom_level}&size={size}&maptype=satellite&key={api_key}"
#     response = requests.get(url)

#     if response.status_code == 200:
#         img = Image.open(BytesIO(response.content))
#         return img
#     else:
#         raise Exception(f"Error fetching satellite image: {response.status_code}")

# def fetch_street_view_image(latitude, longitude, heading=0, api_key='YOUR_GOOGLE_API_KEY'):
#     url = f"https://maps.googleapis.com/maps/api/streetview?size=600x400&location={latitude},{longitude}&heading={heading}&key={api_key}"
#     response = requests.get(url)

#     if response.status_code == 200:
#         img = Image.open(BytesIO(response.content))
#         return img
#     else:
#         raise Exception(f"Error fetching street view image: {response.status_code}")

import requests
from PIL import Image
from io import BytesIO

def fetch_satellite_image(latitude, longitude, zoom_level=18, size='600x600', api_key='AIzaSyCMxvhhBkvNa8g5qK6lU4p4hdReAisN-xc'):
    if not api_key:
        print(f"No API key provided. Generating placeholder satellite image.")
        img = Image.new('RGB', (600, 600), color=(34, 49, 63))
        return img

    url = f"https://maps.googleapis.com/maps/api/staticmap?center={latitude},{longitude}&zoom={zoom_level}&size={size}&maptype=satellite&key={api_key}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            img.save(f"images/satellite_{latitude}_{longitude}.png")
            print("Satellite image saved successfully!")
            return img
        else:
            print(f"Google Maps Error {response.status_code}. Using placeholder.")
            img = Image.new('RGB', (600, 600), color=(34, 49, 63))
            return img
    except Exception as e:
        print(f"Exception during fetch: {e}. Using placeholder.")
        img = Image.new('RGB', (600, 600), color=(34, 49, 63))
        return img

# Example: Get satellite image for a given latitude and longitude
if __name__ == "__main__":
    fetch_satellite_image(6.9271, 79.9560)  # Example coordinates (Sri Lanka)

def fetch_street_view_image(latitude, longitude, heading=0, api_key='AIzaSyCMxvhhBkvNa8g5qK6lU4p4hdReAisN-xc'):
    if not api_key:
        print(f"No API key provided. Generating placeholder street view.")
        img = Image.new('RGB', (600, 400), color=(52, 73, 94))
        return img

    url = f"https://maps.googleapis.com/maps/api/streetview?size=600x400&location={latitude},{longitude}&heading={heading}&key={api_key}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            img.save(f"images/street_view_{latitude}_{longitude}.png")
            print("Street view image saved successfully!")
            return img
        else:
            print(f"Street View Error {response.status_code}. Using placeholder.")
            img = Image.new('RGB', (600, 400), color=(52, 73, 94))
            return img
    except Exception as e:
        print(f"Exception during fetch: {e}. Using placeholder.")
        img = Image.new('RGB', (600, 400), color=(52, 73, 94))
        return img

# Example: Get street-view image for a given latitude and longitude
if __name__ == "__main__":
    fetch_street_view_image(6.9271, 79.9560, heading=90)
