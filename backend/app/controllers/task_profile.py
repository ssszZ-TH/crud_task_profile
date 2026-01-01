from fastapi import APIRouter, HTTPException, status
from typing import List
import logging
from app.models.task_profile import (
    create_task_profile, get_task_profile, get_all_task_profiles,
    update_task_profile, delete_task_profile
)
from app.schemas.task_profile import TaskProfileCreate, TaskProfileUpdate, TaskProfileOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/taskprofile", tags=["taskprofile"])

@router.post("/", response_model=TaskProfileOut, status_code=status.HTTP_201_CREATED)
async def create_task_profile_endpoint(item: TaskProfileCreate):
    result = await create_task_profile(item)
    if not result:
        raise HTTPException(status_code=400, detail="Failed to create task profile")
    return result

@router.get("/", response_model=List[TaskProfileOut])
async def get_all_task_profiles_endpoint():
    return await get_all_task_profiles()

@router.get("/{task_id}", response_model=TaskProfileOut)
async def get_task_profile_endpoint(task_id: int):
    result = await get_task_profile(task_id)
    if not result:
        raise HTTPException(status_code=404, detail="Task profile not found")
    return result

@router.put("/{task_id}", response_model=TaskProfileOut)
async def update_task_profile_endpoint(task_id: int, item: TaskProfileUpdate):
    result = await update_task_profile(task_id, item)
    if not result:
        raise HTTPException(status_code=404, detail="Task profile not found")
    return result

@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
async def delete_task_profile_endpoint(task_id: int):
    result = await delete_task_profile(task_id)
    if not result:
        raise HTTPException(status_code=404, detail="Task profile not found")
    return result  