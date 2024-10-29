from fastapi import APIRouter, HTTPException, Depends, status, Body, Request
from app.db import db
from app.utils import serialize_price_record, hash_password, verify_password, create_acess_token, check_and_send_alerts
from datetime import datetime, timedelta, timezone
from app.models import UserCreate, UserInDB, AlertCreate, LoginRequest
from app.auth import get_current_user
from bson import ObjectId

router = APIRouter()

@router.get("/prices/latest")
async def get_latest_prices(current_user: dict=Depends(get_current_user)):
    latest_prices = {}
    metals = current_user['metals']
    for metal in metals:
        latest_record = db.prices.find_one({"metal": metal}, sort=[("timestamp", -1)])
        if latest_record:
            latest_prices[metal] = serialize_price_record(latest_record)
    return latest_prices
    
@router.get("/prices/historical")
async def get_historical_prices(metal: str, range: str="last_week"):
    now = datetime.now(timezone.utc) 
    if range=="last_week": 
        start_date = now - timedelta(weeks=1)
    elif range=="last_two_weeks": 
        start_date = now - timedelta(weeks=2)
    elif range=="last_month": 
        start_date = now - timedelta(weeks=4)
    elif range=="last_two_months": 
        start_date = now - timedelta(weeks=8)
    elif range=="last_four_months": 
        start_date = now - timedelta(weeks=16)
    else:
        raise HTTPException(status_code=400, detail=f"Invalid range specified. Use 'last_week', 'last_two_weeks', 'last_month', 'last_two_months, or 'last_year'.")
    cursor = db.prices.find({
        "metal": metal,
        "timestamp": {"$gte": start_date, "$lte": now}
    }).sort("timestamp", -1)
    historical_prices = [serialize_price_record(rec) for rec in cursor]
    return historical_prices

@router.post("/register", response_model=UserInDB)
async def register_user(user: UserCreate = Body(...)):
    try:
        if db.users.find_one({"username": user.username}):
            raise HTTPException(status_code=400, detail="Username already registered")
        
        hashed_password = hash_password(user.password)
        user_in_DB = UserInDB(username=user.username, hashed_password=hashed_password, metals = ["ALU", "XCU", "IRON", "XSN"])

        result = db.users.insert_one(user_in_DB.model_dump())
        user_in_DB.id = str(result.inserted_id)
        return user_in_DB
    except Exception as e:
        print(f"Error{e}")
        raise HTTPException(status_code=400, detail="Invalid data")

@router.post("/login")
async def login_user(request: LoginRequest):
    user_in_db = db.users.find_one({"username": request.username})
    if not user_in_db or not verify_password(request.password, user_in_db["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_acess_token({"sub": request.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/set-alert", response_model=dict)
async def set_alert(alert: AlertCreate = Body(...), current_user: dict=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    new_alert = {
        "user_id": user_id,
        "metal": alert.metal,
        "price_threshold": alert.threshold,
        "above": alert.above,
        "phone_number": alert.phone_number,
        "created_at": datetime.now(timezone.utc)
    }
    result = db.alerts.insert_one(new_alert)
    return {"message": "Alert set successfully", "alert_id": str(result.inserted_id)}

@router.post("/remove-alert", response_model=dict)
async def remove_alert(alertID: str):
    try:
        db.alerts.delete_one(
            {"_id": ObjectId(alertID)}
        )
        return {"message": "Alert set removed", "alert_id": alertID}
    except Exception as e:
        print("bbbbbbbbbb")
        return None

@router.get("/my-alerts")
async def read_alerts(current_user: dict = Depends(get_current_user)):
    alerts = db.alerts.find({"user_id": str(current_user["_id"])})
    return [{"id": str(alert["_id"]), "metal": alert["metal"], "price_threshold": alert["price_threshold"], "above": alert["above"]} for alert in alerts]

@router.get("/my-metals")
async def personal_metals(current_user: dict = Depends(get_current_user)):
    return current_user['metals']

@router.post("/add-metals")
async def add_metals(add: str, current_user: dict = Depends(get_current_user)):
    if add in current_user['metals']:
        return {"message": "Metal already in personal metals"}
    db.users.update_one(
        {"username": current_user['username']},
        {"$addToSet": {"metals": add}}
    )
    db.globalMetals.update_one(
        {},
        {"$addToSet": {"metals": add}}
    )
    return {"message": "Metal successfully added to personal metals"}

@router.post("/remove-metals")
async def remove_metals(remove: str, current_user: dict = Depends(get_current_user)):
    if remove not in current_user['metals']:
        return {"message": "Metal not in personal metals"}
    db.users.update_one(
        {"username": current_user['username']},
        {"$pull": {"metals": remove}}
    )
    return {"message": "Metal successfully removed from personal metals"}

@router.post("/test-alerts")
async def test_alerts(metal: str, current_price: float):
    check_and_send_alerts(metal, current_price)
    return {"message": "Test alerts triggered"}
    
