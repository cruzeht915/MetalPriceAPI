from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class PriceRecord(BaseModel):
    metal: str
    price: float
    unit: str = "USD/oz"
    timestamp: datetime

class AlertCreate(BaseModel):
    metal: str
    threshold: float
    above: bool
    phone_number: str

class UserCreate(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    id: Optional[str] = None
    username: str
    hashed_password: str
    metals: List[str]

class User(BaseModel):
    id: str
    username: str

class LoginRequest(BaseModel):
    username: str
    password: str
    