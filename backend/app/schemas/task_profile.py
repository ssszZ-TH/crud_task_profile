from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskProfileCreate(BaseModel):
    title: str
    detail: Optional[str] = None
    fname: str
    lname: str
    phone_num: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[date] = None
    status: str 

class TaskProfileUpdate(BaseModel):
    title: Optional[str] = None
    detail: Optional[str] = None
    fname: Optional[str] = None
    lname: Optional[str] = None
    phone_num: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[date] = None
    status: Optional[str] = None

class TaskProfileOut(BaseModel):
    id: int
    title: str
    detail: Optional[str] = None
    fname: str
    lname: str
    phone_num: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[date] = None
    status: str
    create_at: datetime
    update_at: Optional[datetime] = None

    class Config:
        from_attributes = True