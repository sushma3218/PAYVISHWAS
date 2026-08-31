from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
import os

API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_api_key(api_key_header: str = Security(API_KEY_HEADER)):
    expected_api_key = os.getenv("PAYVISHWAS_API_KEY", "dev-secret-key")
    if api_key_header == expected_api_key:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )
