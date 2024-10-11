import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()

METALPRICE_API_KEY = os.getenv("METALPRICE_API_KEY")
METALPRICE_API_URL = "https://api.metalpriceapi.com/v1/latest"

def fetch_metal_prices(metal):
    try:
        response = requests.get(METALPRICE_API_URL, params = {"api_key": METALPRICE_API_KEY, "currencies":metal, "base": "USD" })
        data = response.json()
        if data.get("success"):
            return data['rates']
        else:
            logging.error(f"API Error: {data.get('error')}")
            return None
    except Exception as e:
        print("Error fetching data: {e}")
        return None