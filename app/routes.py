from fastapi import APIRouter, HTTPException, Query
from app.db import db
from app.utils import fetch_metal_prices, serialize_price_record
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/prices/latest")
async def get_latest_prices(metal: str="ALU"):
    try:  
        prices = fetch_metal_prices(metal)
        if prices:
            record = {
                "metal": metal,
                "price": prices[f"USD{metal}"],
                "unit": "USD/oz",
                "timestamp": datetime.utcnow()
            }
            result = db.prices.insert_one(record)
            inserted_record = db.prices.find_one({"_id": result.inserted_id})
            return serialize_price_record(inserted_record)
        else:
            raise HTTPException(status_code=500, detail="Error fetching prices from the external API.")
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail= "Internal Server Error")
    
@router.get("/prices/historical")
async def get_historical_prices(metal: str, range: str="last_week"):
    try:
        now = datetime.utcnow() 
        if (range=="last_week"): start_time = now - timedelta(weeks=1)
        if (range=="last_two_weeks"): start_time = now - timedelta(weeks=2)
        if (range=="last_month"): start_time = now - timedelta(days=30)
        if (range=="last_two_months"): start_time = now - timedelta(days=60)
        if (range=="last_year"): start_time = now - timedelta(days=365)
        else:
            raise HTTPException(status_code=400, detail="Invalid range specified. Use 'last_week', 'last_two_weeks', 'last_month', or 'last_year'.")
        cursor = db.prices.find({
            "metal": metal,
            "timestamp": {"$gte": start_time, "$lte": now}
        }).sort("timestamp", -1)
        historical_prices = [serialize_price_record(rec) for rec in cursor]
        return historical_prices
        
    except Exception as e:
        print(f"Error fetching historical prices: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/alerts")
async def set_alert(metal: str, price_threshold: float, above: bool):
    alert = {
        "metal": metal,
        "price_threshold": price_threshold,
        "above": above,
        "created_at": datetime.utcnow()
    }
    db.alerts.insert_one(alert)
    return {"message": "Alert set successfully"}
    
