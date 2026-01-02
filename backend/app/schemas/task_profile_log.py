from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskProfileLogOut(BaseModel):
    id: int
    task_profile_id: Optional[int] = None
    title: str
    detail: Optional[str] = None
    fname: str
    lname: str
    phone_num: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[date] = None
    status: str
    action: str
    action_at: datetime

    class Config:
        from_attributes = True