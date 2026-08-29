from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from ..models.user import UserCreate, UserLogin, AuthResponse, UserResponse, Token, PasswordChange
from ..services.auth_service import hash_password, verify_password, create_tokens, generate_user_id
from ..database import get_database
from ..dependencies import get_current_user
from ..models.user import UserInDB

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, database=Depends(get_database)):
    # Check if email already exists
    existing = await database.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user_id = generate_user_id()
    user_dict = {
        "id": user_id,
        "email": user_data.email,
        "fullName": user_data.fullName,
        "hashed_password": hash_password(user_data.password),
        "role": user_data.role.value if user_data.role else "patient",
        "age": user_data.age,
        "sex": user_data.sex,
        "status": "Active",
        "createdAt": datetime.utcnow(),
        "lastLogin": None
    }

    await database.users.insert_one(user_dict)

    # Generate tokens
    tokens = create_tokens(user_id, user_data.email, user_dict["role"])

    return AuthResponse(
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            fullName=user_data.fullName,
            role=user_dict["role"],
            age=user_data.age,
            sex=user_data.sex,
            createdAt=user_dict["createdAt"],
            status="Active"
        ),
        tokens=Token(**tokens)
    )


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin, database=Depends(get_database)):
    # Find user
    user = await database.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if user is active
    if user.get("status") == "Inactive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    # Update last login
    await database.users.update_one(
        {"id": user["id"]},
        {"$set": {"lastLogin": datetime.utcnow()}}
    )

    # Generate tokens
    tokens = create_tokens(user["id"], user["email"], user["role"])

    return AuthResponse(
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            fullName=user["fullName"],
            role=user["role"],
            age=user.get("age"),
            sex=user.get("sex"),
            createdAt=user["createdAt"],
            status=user.get("status", "Active")
        ),
        tokens=Token(**tokens)
    )


@router.post("/refresh")
async def refresh_token(refresh_token: str, database=Depends(get_database)):
    from jose import jwt
    from app.config import settings

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await database.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        tokens = create_tokens(user["id"], user["email"], user["role"])
        return {"success": True, "data": tokens}

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.post("/change-password")
async def change_password(
    data: PasswordChange,
    current_user: UserInDB = Depends(get_current_user),
    database=Depends(get_database)
):
    # Verify current password
    if not verify_password(data.currentPassword, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Update password
    await database.users.update_one(
        {"id": current_user.id},
        {"$set": {"hashed_password": hash_password(data.newPassword)}}
    )

    return {"success": True, "message": "Password changed successfully"}
