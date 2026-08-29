from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from typing import Optional
from ..models.prediction import PredictionRequest, PredictionResponse, Grade
from ..services.prediction_service import create_prediction_record
from ..database import get_database
from ..dependencies import get_current_user
from ..models.user import UserInDB

router = APIRouter()


@router.post("/")
async def predict(
    request: PredictionRequest,
    current_user: UserInDB = Depends(get_current_user),
    database=Depends(get_database)
):
    import asyncio
    # Simulate model inference delay (1.5-3 seconds)
    import random
    await asyncio.sleep(1.5 + random.random() * 1.5)

    # Create prediction
    # In a real app, you would fetch the image and run actual inference
    image_url = "https://images.unsplash.com/photo-1559181567-c3190ca995b6?w=224&h=224&fit=crop"

    prediction = create_prediction_record(
        user_id=current_user.id,
        image_id=request.imageId,
        image_url=image_url,
        age=request.age,
        sex=request.sex.value if request.sex else None,
        eye_side=request.eyeSide.value if request.eyeSide else None,
        notes=request.notes
    )

    await database.predictions.insert_one(prediction)

    return {
        "success": True,
        "data": prediction,
        "message": "Prediction completed"
    }


@router.get("/history")
async def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    grade: Optional[str] = Query(None),
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: UserInDB = Depends(get_current_user),
    database=Depends(get_database)
):
    # Build query
    query = {"userId": current_user.id}

    if grade and grade != "All":
        query["grade"] = grade

    if startDate:
        query["createdAt"] = {"$gte": datetime.fromisoformat(startDate)}

    if endDate:
        if "createdAt" in query:
            query["createdAt"]["$lte"] = datetime.fromisoformat(endDate)
        else:
            query["createdAt"] = {"$lte": datetime.fromisoformat(endDate)}

    # Count total
    total = await database.predictions.count_documents(query)

    # Fetch predictions
    skip = (page - 1) * limit
    cursor = database.predictions.find(query).sort("createdAt", -1).skip(skip).limit(limit)
    predictions = await cursor.to_list(length=limit)

    # Convert ObjectId to string
    for pred in predictions:
        pred["_id"] = str(pred.get("_id", ""))

    return {
        "success": True,
        "data": {
            "predictions": predictions,
            "total": total,
            "page": page,
            "totalPages": (total + limit - 1) // limit
        },
        "message": "History retrieved"
    }


@router.get("/{prediction_id}")
async def get_prediction(
    prediction_id: str,
    current_user: UserInDB = Depends(get_current_user),
    database=Depends(get_database)
):
    prediction = await database.predictions.find_one({
        "id": prediction_id,
        "userId": current_user.id
    })

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    prediction["_id"] = str(prediction.get("_id", ""))

    return {
        "success": True,
        "data": prediction,
        "message": "Prediction found"
    }


@router.delete("/{prediction_id}")
async def delete_prediction(
    prediction_id: str,
    current_user: UserInDB = Depends(get_current_user),
    database=Depends(get_database)
):
    result = await database.predictions.delete_one({
        "id": prediction_id,
        "userId": current_user.id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prediction not found")

    return {
        "success": True,
        "message": "Prediction deleted"
    }
