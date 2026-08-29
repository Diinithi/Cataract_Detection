from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"


class UserStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"


class UserCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    age: Optional[int] = Field(None, ge=18, le=120)
    sex: Optional[str] = None
    role: Optional[UserRole] = UserRole.PATIENT


class UserResponse(BaseModel):
    id: str
    email: str
    fullName: str
    role: UserRole
    age: Optional[int] = None
    sex: Optional[str] = None
    createdAt: datetime
    status: UserStatus

    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    hashed_password: str
    lastLogin: Optional[datetime] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    rememberMe: Optional[bool] = False


class Token(BaseModel):
    accessToken: str
    refreshToken: str
    tokenType: str = "bearer"


class AuthResponse(BaseModel):
    user: UserResponse
    tokens: Token


class PasswordChange(BaseModel):
    currentPassword: str
    newPassword: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    age: Optional[int] = Field(None, ge=18, le=120)
    sex: Optional[str] = None
