from fastapi import APIRouter, HTTPException
from redis import Redis
import requests
import os
import json
from datetime import datetime, timedelta
from typing import Optional

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

router = APIRouter()
redis = Redis.from_url(REDIS_URL, decode_responses=True)

@router.get("/api/holidays/")
async def get_holidays(date: Optional[str] = None):
    try:
        if date is None:
            # If no date is provided, default to the current date
            date_obj = datetime.now()
            print(date_obj)
        else:
            # Transform the ISO 8601 formatted date string into a datetime object
            date_obj = datetime.fromisoformat(date)

        # Calculate start and end dates relative to the provided date
        start_date = date_obj - timedelta(weeks=2)
        end_date = date_obj + timedelta(weeks=2)

        # Format the start and end dates into the accepted format (YYYY-MM-DD)
        formatted_start_date = start_date.strftime("%Y-%m-%d")
        formatted_end_date = end_date.strftime("%Y-%m-%d")

        # Hardcoded date in the desired format
        date = "2024-03-07T00:00:00Z"

        api_url = "https://www.hebcal.com/hebcal"
        params = {
            "v": "1",
            "cfg": "json",
            "maj": "on",
            "min": "on",
            "mod": "on",
            "nx": "on",
            "start": formatted_start_date,
            "end": formatted_end_date,
            "ss": "on",
            "mf": "on",
            "c": "on",
            "geo": "none",
            "M": "on",
            "s": "on",
        }

        if date is not None:
            # Include the date as a query parameter if provided
            params["date"] = date

        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()

        return data
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))
