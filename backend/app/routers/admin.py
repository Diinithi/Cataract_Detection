from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
from ..dependencies import get_admin_user
from ..models.user import UserInDB
from ..database import get_database

router = APIRouter()


@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: UserInDB = Depends(get_admin_user),
    database=Depends(get_database)
):
    query = {}

    if role and role != "All":
        query["role"] = role.lower()

    if status and status != "All":
        query["status"] = status

    if search:
        query["$or"] = [
            {"fullName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]

    total = await database.users.count_documents(query)
    skip = (page - 1) * limit
    cursor = database.users.find(query).skip(skip).limit(limit).sort("createdAt", -1)
    users = await cursor.to_list(length=limit)

    # Clean up data
    for user in users:
        user["_id"] = str(user.pop("_id", ""))
        user.pop("hashed_password", "")

    return {
        "success": True,
        "data": {
            "users": users,
            "total": total,
            "page": page,
            "totalPages": (total + limit - 1) // limit
        },
        "message": "Users retrieved"
    }


@router.get("/users/stats")
async def get_user_stats(
    current_user: UserInDB = Depends(get_admin_user),
    database=Depends(get_database)
):
    total = await database.users.count_documents({})
    active = await database.users.count_documents({"status": "Active"})
    doctors = await database.users.count_documents({"role": "doctor"})
    patients = await database.users.count_documents({"role": "patient"})

    return {
        "success": True,
        "data": {
            "total": total,
            "active": active,
            "doctors": doctors,
            "patients": patients
        },
        "message": "Stats retrieved"
    }


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    data: dict,
    current_user: UserInDB = Depends(get_admin_user),
    database=Depends(get_database)
):
    update_data = {}
    if "role" in data:
        update_data["role"] = data["role"]
    if "status" in data:
        update_data["status"] = data["status"]

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid update data")

    result = await database.users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    updated = await database.users.find_one({"id": user_id})
    updated.pop("_id", "")
    updated.pop("hashed_password", "")

    return {
        "success": True,
        "data": updated,
        "message": "User updated"
    }
