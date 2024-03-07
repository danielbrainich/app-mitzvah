from fastapi import APIRouter, HTTPException
from redis import Redis
import requests
import os
import json

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

router = APIRouter()
redis = Redis.from_url(REDIS_URL, decode_responses=True)

@router.get("/api/candles/{zipcode}")
async def get_candles(zipcode: str):
    cache_key = f"candles_{zipcode}"

    cached_data = redis.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    api_url = "https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=none&M=on&s=on"
    params = {}

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()

        redis.set(cache_key, json.dumps(data), ex=86400)

        return data
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))
