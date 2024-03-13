from fastapi import FastAPI
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from dependencies import setup_dependencies
from routers import holidays, shabbat
from dependencies import setup_dependencies

load_dotenv()

app=FastAPI()

ENVIRONMENT = os.getenv("ENVIRONMENT")

if ENVIRONMENT == "development":
    allowed_origins = "http://localhost:3000"
else:
    allowed_origins = "my_deployed_url_here"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

setup_dependencies(app)

app.include_router(holidays.router)
app.include_router(shabbat.router)
