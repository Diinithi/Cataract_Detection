from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import connect_to_mongodb, close_mongodb_connection
from .routers import auth, images, predictions, users, admin

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI-Powered Cataract Detection and Severity Grading API",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongodb()
    # Create seed admin user if not exists
    from .database import db
    admin_exists = await db.database.users.find_one({"email": "admin@cataractai.com"})
    if not admin_exists:
        from .services.auth_service import hash_password, generate_user_id
        from datetime import datetime
        admin_user = {
            "id": "user-admin",
            "email": "admin@cataractai.com",
            "fullName": "Admin User",
            "hashed_password": hash_password("Admin1234!"),
            "role": "admin",
            "status": "Active",
            "createdAt": datetime.utcnow(),
            "lastLogin": None
        }
        await db.database.users.insert_one(admin_user)
        print("Created seed admin user")


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongodb_connection()


@app.get("/")
async def root():
    return {
        "message": "Welcome to CataractAI API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(images.router, prefix="/api/v1/images", tags=["Images"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["Predictions"])
app.include_router(predictions.router, prefix="/api/v1/predict", tags=["Predictions"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
