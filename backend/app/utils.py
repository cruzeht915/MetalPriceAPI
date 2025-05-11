import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from app.db import db
from passlib.context import CryptContext
from jose import jwt
from twilio.rest import Client

load_dotenv()

METALPRICE_API_KEY = os.getenv("METALPRICE_API_KEY")

metals = {
    "ALU": "Aluminum (ALU)",
    "XPB": "Lead (XPB)",
    "XCU": "Copper (XCU)",
    "IRON": "Iron (IRON)",
    "XLI": "Lithium (XLI)",
    "NI": "Nickel (NI)",
    "ZNC": "Zinc (ZNC)",
    "XSN": "Tin (XSN)",
}


# Get and store metal prices
def fetch_and_store_prices():
    metals = {
        "ALU": "Aluminum (ALU)",
        "XPB": "Lead (XPB)",
        "XCU": "Copper (XCU)",
        "IRON": "Iron (IRON)",
        "XLI": "Lithium (XLI)",
        "NI": "Nickel (NI)",
        "ZNC": "Zinc (ZNC)",
        "XSN": "Tin (XSN)",
    }
    metales = metals.keys()
    for metal in metales:
        prices = fetch_metal_prices(metal)
        if prices:
            current_price = prices.get(f"USD{metal}", 0) * 16
            record = {
                "metal": metal,
                "price": current_price,
                "unit": "USD/lb",
                "timestamp": datetime.now(timezone.utc),
            }
        store_price(record)
        check_and_send_alerts(metal, current_price)


def fetch_metal_prices(metal, date=None):
    if date:
        METALPRICE_API_URL = f"https://api.metalpriceapi.com/v1/{date}"
    else:
        METALPRICE_API_URL = "https://api.metalpriceapi.com/v1/latest"
    try:
        response = requests.get(
            METALPRICE_API_URL,
            params={"api_key": METALPRICE_API_KEY,
                    "currencies": metal, "base": "USD"},
        )
        data = response.json()
        if data.get("success"):
            return data["rates"]
        else:
            return None
    except Exception as e:
        raise Exception("metalpriceapi Error!", e)


def serialize_price_record(record):
    return {
        "_id": str(record["_id"]),
        "metal": record["metal"],
        "price": record["price"],
        "unit": record["unit"],
        "timestamp": record["timestamp"].isoformat(),
    }


def store_price(record):
    db.prices.insert_one(record)


# Scripts for data cleaning and backfilling
def purge_old_data():
    six_months_ago = datetime.now(timezone.utc) - timedelta(weeks=26)
    db.prices.delete_many({"timestamp": {"$lt": six_months_ago}})


def manual_day_purge(dayz):
    yesterday = datetime.now(timezone.utc) - timedelta(days=dayz)
    db.prices.delete_many({"timestamp": {"$gt": yesterday}})


def backfill_data(metals, days_back=21):
    now = datetime.now(timezone.utc)
    for i in range(21, days_back):
        date_to_fetch = now - timedelta(days=i)
        for metal in metals:
            prices = fetch_metal_prices(metal,
                                        date_to_fetch.strftime("%Y-%m-%d"))
            if prices:
                record = {
                    "metal": metal,
                    "price": prices.get(f"USD{metal}", 0) * 16,
                    "unit": "USD/lb",
                    "timestamp": date_to_fetch,
                }
                store_price(record)


# Authentication Util
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = 45
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)


def create_acess_token(data: dict):
    to_encode = data.copy()
    expire = (datetime.now(timezone.utc) +
              timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# SMS Alerts Util
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_sms_alert(to_phone_number: str, message: str):
    try:
        message_send = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone_number,
        )
        return message_send.sid
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return None


def check_and_send_alerts(metal: str, current_price: float):
    alerts = db.alerts.find({"metal": metal})
    for alert in alerts:
        if (alert["above"] and current_price > alert["price_threshold"]) or (
            not alert["above"] and current_price < alert["price_threshold"]
        ):
            message = (f"Alert! {metals[metal]} has"
                f"{'risen above' if alert['above'] else 'dropped below'}"
                f"{alert['price_threshold']} USD/lb." 
                f"Current price: {current_price} USD/lb")
            send_sms_alert(alert["phone_number"], message)
            db.alerts.delete_one({"_id": alert["_id"]})


def format_phone_number(phone_number: str):
    if not phone_number.startswith("+"):
        return "+1" + phone_number
    return phone_number
