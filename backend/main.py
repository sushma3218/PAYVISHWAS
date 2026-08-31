from fastapi import FastAPI, Depends
from backend.database.database import engine, Base
from backend.database import models
from backend.security.auth import get_api_key

# Create all tables in the database
Base.metadata.create_all(bind=engine)

from backend.api.webhooks import router as webhooks_router
from backend.api.dashboard import router as dashboard_router
from backend.api.demo import router as demo_router
from backend.api.phase2 import router as phase2_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PAYVISHWAS API",
    description="Autonomous AI Risk Manager for Intelligent Payment Recovery",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhooks_router)
app.include_router(dashboard_router)
app.include_router(demo_router)
app.include_router(phase2_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to PAYVISHWAS - Track 02 AI Risk Manager API"}

@app.get("/api/health")
def health_check():
    return {"status": "Operational", "database": "Connected"}

@app.get("/api/secure-endpoint", dependencies=[Depends(get_api_key)])
def secure_test():
    return {"message": "You are authenticated!"}
