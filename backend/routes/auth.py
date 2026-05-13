from fastapi import APIRouter, HTTPException
from models.user import UserRegister, UserLogin
from database import users_collection

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):
    existing = users_collection.find_one({"email": user.email})

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": user.password
    })

    return {"message": "Registration successful"}

@router.post("/login")
def login(user: UserLogin):
    existing = users_collection.find_one({
        "email": user.email,
        "password": user.password
    })

    if not existing:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful"}