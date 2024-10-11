from fastapi import APIRouter, HTTPException
from app.db import db
from app.utils import fetch_metal_prices
from datetime import datetime
from bson.json_util import dumps
from fastapi.responses import JSONResponse

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
            print(JSONResponse(content=dumps(inserted_record)))
            return JSONResponse(content=dumps(inserted_record))
        else:
            raise HTTPException(status_code=500, detail="Error fetching prices from the external API.")
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail= "Internal Server Error")
    

    