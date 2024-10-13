import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from app.db import db
load_dotenv()

METALPRICE_API_KEY = os.getenv("METALPRICE_API_KEY")

def fetch_and_store_prices():
    metals = ["ALU", "XCU", "IRON", "XPB"]
    for metal in metals:
        prices = fetch_metal_prices(metal)
        if prices:
            record = {
                "metal": metal, 
                "price": prices.get(f"USD{metal}", 0),
                "unit": "USD/oz",
                "timestamp": datetime.utcnow()
            }
        store_price(record)

def fetch_metal_prices(metal, date=None):
    if(date): METALPRICE_API_URL = f"https://api.metalpriceapi.com/v1/{date}"
    else: METALPRICE_API_URL = "https://api.metalpriceapi.com/v1/latest"

    response = requests.get(METALPRICE_API_URL, params = {"api_key": METALPRICE_API_KEY, "currencies":metal, "base": "USD" })
    data = response.json()
    if data.get("success"):
        return data['rates']
    else:
        return None
    
def serialize_price_record(record):
    return {
        "_id": str(record["_id"]),
        "metal": record["metal"],
        "price": record["price"],
        "unit": record["unit"],
        "timestamp": record["timestamp"].isoformat()
    }

def purge_old_data():
    six_months_ago = datetime.utcnow() - timedelta(weeks=26)
    db.prices.delete_many({"timestamp": {"$lt", six_months_ago }})

def store_price(record):
    db.prices.insert_one(record)

def backfill_data(metals, days_back=14):
    now = datetime.utcnow()
    for i in range(days_back):
        date_to_fetch = now - timedelta(days= i)
        for metal in metals:
            prices = fetch_metal_prices(metal, date_to_fetch.strftime("%Y-%m-%d"))
            if prices:
                record = {
                    "metal": metal,
                    "price": prices.get(f"USD{metal}", 0),
                    "unit": "USD/oz",
                    "timestamp": date_to_fetch
                }
                store_price(record)