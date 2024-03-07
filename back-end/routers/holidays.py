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

def get_holiday_info(holidays, date):
    # Get today's date
    today_date = datetime.fromisoformat(date).date()

    # Initialize variables to store holiday information
    today_holiday = None
    previous_holiday = None
    next_holiday = None

    # Iterate through the list of holidays
    for holiday in holidays:
        holiday_date = datetime.fromisoformat(holiday['date']).date()

        # Check if the holiday date is today
        if holiday_date == today_date:
            today_holiday = holiday
        # Check if the holiday date is in the past
        elif holiday_date < today_date:
            # Update previous_holiday if it's None or if the current holiday is closer to today
            if previous_holiday is None or holiday_date > datetime.fromisoformat(previous_holiday['date']).date():
                previous_holiday = holiday
        # Check if the holiday date is in the future
        elif holiday_date > today_date:
            # Update next_holiday if it's None or if the current holiday is closer to today
            if next_holiday is None or holiday_date < datetime.fromisoformat(next_holiday['date']).date():
                next_holiday = holiday

    # Structure the extracted holiday data into a dictionary
    holiday_info = {
        "today": today_holiday,
        "previous": previous_holiday,
        "next": next_holiday
    }

    return holiday_info

@router.get("/api/holidays/")
async def get_holidays(date: Optional[str] = None):
    try:
        if date is None:
            # If no date is provided, default to the current date
            date_obj = datetime.now()
            print("date generated on backend:", date_obj)
        else:
            # Transform the ISO 8601 formatted date string into a datetime object
            date_obj = datetime.fromisoformat(date)
            print("date passed from frontend:", date_obj)

        # Calculate start and end dates relative to the provided date
        start_date = date_obj - timedelta(weeks=4)
        end_date = date_obj + timedelta(weeks=4)

        # Format the start and end dates into the accepted format (YYYY-MM-DD)
        formatted_start_date = start_date.strftime("%Y-%m-%d")
        formatted_end_date = end_date.strftime("%Y-%m-%d")

        api_url = "https://www.hebcal.com/hebcal"
        params = {
            "v": "1",                       # API version
            "cfg": "json",                  # Output format
            "maj": "on",                    # Major holidays
            "min": "on",                    # Minor holidays
            "mod": "on",                    # Modern holidays
            "nx": "off",                    # Rosh chodesh
            "start": formatted_start_date,  # Start date
            "end": formatted_end_date,      # End date
            "ss": "off",                    # Special Shabbatot
            "mf": "off",                    # Minor fasts
            "c": "off",                     # Candle lighting times
            "geo": "none",                  # Geographical location
            "s": "off",                     # Parashat ha-Shavua
        }

        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()

        # Extract holiday information using the get_holiday_info function
        holiday_info = get_holiday_info(data.get("items", []), date_obj.isoformat())

        # Return the holiday data along with the extracted holiday information
        return {
            "holiday_info": holiday_info
        }
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))
