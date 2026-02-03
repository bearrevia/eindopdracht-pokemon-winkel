from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.user import router as user_router

app = FastAPI(title="Pokemon Winkel API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(user_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Pokemon Winkel API"}