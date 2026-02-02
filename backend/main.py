from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.api import router as api_router
import uvicorn
import os
import dotenv
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # pas aan als je andere frontend-poort gebruikt
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI"}