# my_fastapi_app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Define the list of origins that are allowed to make requests
origins = [
    "http://localhost:3000", # Your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods
    allow_headers=["*"], # Allow all headers
)

@app.get("/api/dashboard/metrics/")
def get_metrics():
    return {"data": "some high-speed data"}