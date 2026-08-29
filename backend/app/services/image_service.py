import os
import uuid
import hashlib
from datetime import datetime
from fastapi import UploadFile
from ..config import settings


async def save_upload(file: UploadFile) -> dict:
    """
    Save uploaded file to disk and return file info.
    """
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Generate unique filename
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    file_id = f"img-{uuid.uuid4().hex[:12]}"
    filename = f"{file_id}.{file_extension}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    # Save file
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    return {
        "id": file_id,
        "filename": filename,
        "originalName": file.filename,
        "mimeType": file.content_type or "image/jpeg",
        "size": len(content),
        "storageUrl": f"/uploads/{filename}",
    }


def compute_hash(file_content: bytes) -> str:
    """
    Compute SHA256 hash of file content.
    """
    return hashlib.sha256(file_content).hexdigest()


def validate_image(file: UploadFile) -> bool:
    """
    Validate uploaded image file.
    """
    allowed_types = ["image/jpeg", "image/jpg", "image/png"]
    return file.content_type in allowed_types
