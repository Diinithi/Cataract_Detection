from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class Grade(str, Enum):
    NORMAL = "Normal"
    IMMATURE = "Immature Cataract"
    MATURE = "Mature Cataract"


class EyeSide(str, Enum):
    LEFT = "Left"
    RIGHT = "Right"
    NOT_SPECIFIED = "Not specified"


class Sex(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    PREFER_NOT_TO_SAY = "Prefer not to say"


class PredictionRequest(BaseModel):
    imageId: str
    age: Optional[int] = None
    sex: Optional[Sex] = None
    eyeSide: Optional[EyeSide] = None
    notes: Optional[str] = None


class PredictionResponse(BaseModel):
    id: str
    userId: str
    imageId: str
    imageUrl: str
    grade: Grade
    confidence: float
    probabilities: dict
    age: Optional[int] = None
    sex: Optional[str] = None
    eyeSide: Optional[str] = None
    notes: Optional[str] = None
    preprocessingSteps: List[str]
    modelVersion: str
    processingTime: float
    createdAt: datetime

    class Config:
        from_attributes = True


class PredictionHistory(BaseModel):
    predictions: List[PredictionResponse]
    total: int
    page: int
    totalPages: int
