from app.config.database import database
from app.schemas.task_profile_log import TaskProfileLogOut
from typing import List

QUERIES = {
    "get_all": """
        SELECT id, task_profile_id, title, detail, fname, lname, phone_num, email, 
               birth_date, status, action, action_at
        FROM task_profile_log
        ORDER BY action_at DESC
    """,
    "get_by_task_id": """
        SELECT id, task_profile_id, title, detail, fname, lname, phone_num, email, 
               birth_date, status, action, action_at
        FROM task_profile_log
        WHERE task_profile_id = :task_id
        ORDER BY action_at DESC
    """,
}

async def get_all_logs() -> List[TaskProfileLogOut]:
    results = await database.fetch_all(query=QUERIES["get_all"])
    return [TaskProfileLogOut(**r._mapping) for r in results]

async def get_logs_by_task(task_id: int) -> List[TaskProfileLogOut]:
    results = await database.fetch_all(query=QUERIES["get_by_task_id"], values={"task_id": task_id})
    return [TaskProfileLogOut(**r._mapping) for r in results]