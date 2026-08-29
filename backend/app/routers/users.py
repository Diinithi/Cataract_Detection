from fastapi import APIRouter, Depends
from ..models.user import UserResponse, UserUpdate
from ..dependencies import get_current_user
from app.models.user import UserInDB
from app.database import get_database

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_profile(
    current_user: UserInDB = Depends(get_current_user)
):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        fullName=current_user.fullName,
        role=current_user.role,
        age=current_user.age,
        sex=current_user.sex,
        createdAt=current_user.createdAt,
        status=current_user.status
    )


@router.patch("/me")
async def update_profile(
    data: UserUpdate,
    current_user: UserInDB = Depends(get_current_user),
    database=Depends(get_database)
):
    update_data = {}
    if data.fullName:
        update_data["fullName"] = data.fullName
    if data.age is not None:
        update_data["age"] = data.age
    if data.sex:
        update_data["sex"] = data.sex

    if update_data:
        await database.users.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )

    # Fetch updated user
    updated = await database.users.find_one({"id": current_user.id})

    return {
        "success": True,
        "data": {
            "id": updated["id"],
            "email": updated["email"],
            "fullName": updated["fullName"],
            "role": updated["role"],
            "age": updated.get("age"),
            "sex": updated.get("sex"),
            "createdAt": updated["createdAt"],
            "status": updated.get("status", "Active")
        },
        "message": "Profile updated"
    }


@router.get("/me/stats")
async def get_user_stats(
    current_user: UserInDB = Depends(get_current_user),
    database=Depends(get_database)
):
    total = await database.predictions.count_documents({"userId": current_user.id})

    last_prediction = await database.predictions.find_one(
        {"userId": current_user.id},
        sort=[("createdAt", -1)]
    )

    return {
        "success": True,
        "data": {
            "totalScans": total,
            "lastScan": last_prediction["createdAt"] if last_prediction else None
        },
        "message": "Stats retrieved"
    }
