#!/usr/bin/env python
"""
Simple script to run the FastAPI backend server.
This avoids uvicorn's reload issues with directory watching.
"""
import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Import and run the app
from app.main import app
import uvicorn

if __name__ == "__main__":
    print(f"Starting server from: {backend_dir}")
    print(f"Python path: {sys.path[0]}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload to avoid path issues
        log_level="info"
    )
