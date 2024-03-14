from fastapi import APIRouter, HTTPException
from redis import Redis
import requests
import os
import json
from typing import Optional
from datetime import datetime


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

router = APIRouter()
redis = Redis.from_url(REDIS_URL, decode_responses=True)

def get_shabbat_info(data):
    shabbat_info = {
        "candle_time": None,
        "parasha_eng": None,
        "parasha_heb": None,
        "parasha_date": None,
        "havdalah_time": None,
        "time_zone": data.get('location', {}).get('tzid', None),
        "start_date": data.get('range', {}).get('start', None),
        "end_date": data.get('range', {}).get('end', None),
    }

    for item in data.get('items', []):
        category = item.get('category')
        if category == 'candles':
            shabbat_info['candle_time'] = item.get('title')
        elif category == 'parashat':
            shabbat_info['parasha_eng'] = item.get('title')
            shabbat_info['parasha_heb'] = item.get('hebrew')
            shabbat_info['parasha_date'] = item.get('hdate')
        elif category == 'havdalah':
            shabbat_info['havdalah_time'] = item.get('title')

    return shabbat_info

@router.get("/api/shabbat/{coordinates}/{date}")
async def get_shabbat(coordinates: str, date: str):

    if date is None:
        date_obj = datetime.now()
        print("date generated on backend:", date_obj)

    else:
        date_obj = datetime.fromisoformat(date)
        print("date passed from frontend:", date_obj)

    YYYY = date_obj.year
    MM = date_obj.month
    DD = date_obj.day

    api_url = "https://www.hebcal.com/shabbat"
    params = {
        "cfg": "json",                              # Output format
        "b": 18,                                    # Candle lighting minutes before sunset
        "M": "on",                                  # Havdalah at nightfall
        "geo": "pos",                               # Location sepecified by latitude and longitude
        "latitude": coordinates.split(",")[0],      # Latitude
        "longitude": coordinates.split(",")[1],     # Longitude
        "ue": "on",                                 # Use elevation for location
        "gy": YYYY,                                 # Year
        "gm": MM,                                   # Month
        "gd": DD,                                   # Day
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()

        shabbat_info = get_shabbat_info(data)

        return {
            "shabbat_info": shabbat_info,
        }
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))
