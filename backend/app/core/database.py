import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# FORCE LOAD .env
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print("DATABASE_URL LOADED =", DATABASE_URL)  # DEBUG

if DATABASE_URL is None:
    raise Exception("❌ DATABASE_URL is NOT loaded. Check your .env file location!")

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
