from fastapi import APIRouter, HTTPException
import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

router = APIRouter()

@router.get("/test-db")
async def test_database():
    """Test database verbinding"""
    try:
        # Haal database URL uit environment
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            raise HTTPException(status_code=500, detail="DATABASE_URL niet gevonden")
        
        # Parse SQLAlchemy URL naar psycopg2 parameters
        parsed = urlparse(db_url)
        
        conn = psycopg2.connect(
            host=parsed.hostname,
            port=parsed.port,
            database=parsed.path[1:],  # Remove leading slash
            user=parsed.username,
            password=parsed.password
        )
        cursor = conn.cursor()
        
        # Test query
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return {
            "status": "success", 
            "message": "Database verbinding succesvol",
            "database_version": db_version[0]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database verbinding mislukt: {str(e)}")

@router.get("/health")
async def health_check():
    """Simpele health check"""
    return {"status": "ok", "message": "API is running"}