from pydantic import BaseModel, EmailStr
from datetime import datetime
from bson import ObjectId
from typing import Optional

class PriceRecord(BaseModel):
    metal: str
    price: float
    unit: str = "USD/oz"
    timestamp: datetime

class AlertCreate(BaseModel):
    metal: str
    threshold: float
    above: bool

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    hashed_password: str

class User(BaseModel):
    id: str
    email: EmailStr
    