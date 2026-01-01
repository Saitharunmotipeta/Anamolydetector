from dotenv import load_dotenv
import os

<<<<<<< HEAD
load_dotenv()  # force load .env BEFORE anything else

from fastapi import FastAPI
=======
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
from app.routers import logs, anomalies, metrics
from app.core.database import engine, Base

app = FastAPI(title="Log Analyzer API")

<<<<<<< HEAD
# include routers
=======
# ✅ CORS MUST COME FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ THEN include routers
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
app.include_router(logs.router)
app.include_router(anomalies.router)
app.include_router(metrics.router)

@app.get("/")
def root():
    return {"message": "Log Analyzer Backend is running 🚀"}

# create DB tables
Base.metadata.create_all(bind=engine)
<<<<<<< HEAD

from fastapi.middleware.cors import CORSMiddleware

=======
from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import logs, anomalies, metrics
from app.core.database import engine, Base

app = FastAPI(title="Log Analyzer API")

# ✅ CORS MUST COME FIRST
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
<<<<<<< HEAD
        "http://127.0.0.1:3000"
=======
        "http://127.0.0.1:3000",
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
=======
# ✅ THEN include routers
app.include_router(logs.router)
app.include_router(anomalies.router)
app.include_router(metrics.router)

@app.get("/")
def root():
    return {"message": "Log Analyzer Backend is running 🚀"}

# create DB tables
Base.metadata.create_all(bind=engine)
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
