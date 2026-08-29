from pydantic import BaseModel
from datetime import datetime


class ImageRecord(BaseModel):
    id: str
    userId: str
    filename: str
    originalName: str
    mimeType: str
    size: int
    storageUrl: str
    createdAt: datetime

    class Config:
        from_attributes = True
