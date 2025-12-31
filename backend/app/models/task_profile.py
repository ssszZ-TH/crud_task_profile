from app.config.database import database
from app.schemas.task_profile import TaskProfileCreate, TaskProfileUpdate, TaskProfileOut
from typing import Optional, List
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

QUERIES = {
    "get_by_id": """
        SELECT id, title, detail, fname, lname, phone_num, email, birth_date, status, create_at, update_at
        FROM task_profile
        WHERE id = :id
    """,
    "get_all": """
        SELECT id, title, detail, fname, lname, phone_num, email, birth_date, status, create_at, update_at
        FROM task_profile
        ORDER BY id
    """,
    "create": """
        INSERT INTO task_profile (title, detail, fname, lname, phone_num, email, birth_date, status)
        VALUES (:title, :detail, :fname, :lname, :phone_num, :email, :birth_date, :status)
        RETURNING id, title, detail, fname, lname, phone_num, email, birth_date, status, create_at, update_at
    """,
    "update": """
        UPDATE task_profile
        SET title = :title, detail = :detail, fname = :fname, lname = :lname,
            phone_num = :phone_num, email = :email, birth_date = :birth_date,
            status = :status, update_at = (NOW() AT TIME ZONE 'Asia/Bangkok')
        WHERE id = :id
        RETURNING id, title, detail, fname, lname, phone_num, email, birth_date, status, create_at, update_at
    """,
    "delete_get": """
        SELECT title, detail, fname, lname, phone_num, email, birth_date, status
        FROM task_profile
        WHERE id = :id
    """,
    "delete": "DELETE FROM task_profile WHERE id = :id RETURNING id",
    "log": """
        INSERT INTO task_profile_log (
            task_profile_id, title, detail, fname, lname, phone_num, email, birth_date, status, action
        ) VALUES (:task_profile_id, :title, :detail, :fname, :lname, :phone_num, :email, :birth_date, :status, :action)
    """
}

async def get_task_profile(task_id: int) -> Optional[TaskProfileOut]:
    result = await database.fetch_one(query=QUERIES["get_by_id"], values={"id": task_id})
    return TaskProfileOut(**result._mapping) if result else None

async def get_all_task_profiles() -> List[TaskProfileOut]:
    results = await database.fetch_all(query=QUERIES["get_all"])
    return [TaskProfileOut(**r._mapping) for r in results]

async def log_task_profile_history(task_id: Optional[int], data: dict, action: str):
    values = {
        "task_profile_id": task_id,
        "title": data["title"],
        "detail": data.get("detail"),
        "fname": data["fname"],
        "lname": data["lname"],
        "phone_num": data.get("phone_num"),
        "email": data.get("email"),
        "birth_date": data.get("birth_date"),
        "status": data["status"],
        "action": action
    }
    await database.execute(query=QUERIES["log"], values=values)
    logger.info(f"Logged task_profile history: id={task_id}, action={action}")

async def create_task_profile(item: TaskProfileCreate) -> Optional[TaskProfileOut]:
    values = item.dict()
    result = await database.fetch_one(query=QUERIES["create"], values=values)
    if result:
        await log_task_profile_history(result["id"], values, "create")
        logger.info(f"Created task_profile id={result['id']}")
        return TaskProfileOut(**result._mapping)
    return None

async def update_task_profile(task_id: int, item: TaskProfileUpdate) -> Optional[TaskProfileOut]:
    old_data = await get_task_profile(task_id)
    if not old_data:
        return None

    update_data = item.dict(exclude_unset=True)
    if not update_data:
        return old_data

    values = {**update_data, "id": task_id}
    result = await database.fetch_one(query=QUERIES["update"], values=values)

    if result:
        await log_task_profile_history(task_id, {**old_data.dict(), **update_data}, "update")
        logger.info(f"Updated task_profile id={task_id}")
        return TaskProfileOut(**result._mapping)
    return None

async def delete_task_profile(task_id: int) -> bool:
    old_data = await database.fetch_one(query=QUERIES["delete_get"], values={"id": task_id})
    if not old_data:
        return False

    data_dict = old_data._mapping
    await log_task_profile_history(task_id, data_dict, "delete")

    result = await database.fetch_one(query=QUERIES["delete"], values={"id": task_id})
    if result:
        logger.info(f"Deleted task_profile id={task_id}")
        return True
    return False