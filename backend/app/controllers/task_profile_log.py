from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.task_profile_log import get_all_logs, get_logs_by_task
from app.schemas.task_profile_log import TaskProfileLogOut

router = APIRouter(prefix="/taskprofilelog", tags=["taskprofilelog"])

@router.get("/", response_model=List[TaskProfileLogOut])
async def get_all_task_profile_logs():
    return await get_all_logs()

@router.get("/{task_id}", response_model=List[TaskProfileLogOut])
async def get_task_profile_logs_by_task(task_id: int):
    logs = await get_logs_by_task(task_id)
    if not logs:
        raise HTTPException(status_code=404, detail="No logs found for this task profile")
    return logs