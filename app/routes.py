from fastapi import APIRouter, HTTPException, Depends, status
from app.db import db
from app.utils import serialize_price_record, hash_password, verify_password, create_acess_token
from datetime import datetime, timedelta
from app.models import UserCreate, UserInDB

router = APIRouter()

@router.get("/prices/latest")
async def get_latest_prices():
    latest_prices = {}
    metals = ["ALU", "XCU", "IRON", "XPB"]
    for metal in metals:
        latest_record = db.prices.find_one({"metal": metal}, sort=[("timestamp", -1)])
        if latest_record:
            latest_prices[metal] = serialize_price_record(latest_record)
    return latest_prices
    
@router.get("/prices/historical")
async def get_historical_prices(metal: str, range: str="last_week"):
    now = datetime.utcnow() 
    if range=="last_week": 
        start_date = now - timedelta(weeks=1)
    elif range=="last_two_weeks": 
        start_date = now - timedelta(weeks=2)
    elif range=="last_month": 
        start_date = now - timedelta(days=30)
    elif range=="last_two_months": 
        start_date = now - timedelta(days=60)
    elif range=="last_year": 
        start_date = now - timedelta(days=365)
    else:
        raise HTTPException(status_code=400, detail=f"Invalid range specified. Use 'last_week', 'last_two_weeks', 'last_month', 'last_two_months, or 'last_year'.")
    cursor = db.prices.find({
        "metal": metal,
        "timestamp": {"$gte": start_date, "$lte": now}
    }).sort("timestamp", -1)
    historical_prices = [serialize_price_record(rec) for rec in cursor]
    return historical_prices
    
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

@router.post("/register", response_model=UserInDB)
async def register_user(user: UserCreate):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_in_DB = UserInDB(email=user.email, hashed_password=hashed_password)

    result = db.users.insert_one(user_in_DB)
    user_in_DB.id = str(result.inserted_id)
    return user_in_DB

@router.post("/login")
async def login_user(email: str, password:str):
    user_in_db = db.users.find_one({"email": email})
    if not user_in_db or not verify_password(password, user_in_db["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_acess_token({"sub": email})
    return {"access_token": access_token, "token_type": "bearer"}
    
