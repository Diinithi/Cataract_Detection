from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, status
from datetime import datetime
from ..services.image_service import save_upload, validate_image
from ..config import settings
from ..dependencies import get_current_user
from ..models.user import UserInDB

router = APIRouter()


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_user),
):
    # Validate file type
    if not validate_image(file):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPG and PNG images are allowed."
        )

    # Check file size
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB."
        )

    # Save file
    file_info = await save_upload(file)

    # Create record
    from ..database import get_database
    database = get_database()

    image_record = {
        **file_info,
        "userId": current_user.id,
        "createdAt": datetime.utcnow()
    }

    await database.image_records.insert_one(image_record)

    return {
        "success": True,
        "data": image_record,
        "message": "Image uploaded successfully"
    }
