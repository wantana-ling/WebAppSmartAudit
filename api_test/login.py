# app/login.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from connectdb import get_connection, release_connection
import aiomysql
import bcrypt

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(payload: LoginRequest):
    print("Login from:", payload.dict())
    username = payload.username
    password = payload.password

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing credentials",
        )

    conn = await get_connection()

    try:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            sql = "SELECT * FROM users WHERE username = %s LIMIT 1"
            await cursor.execute(sql, (username,))
            user = await cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                )

            # เดา field ชื่อ password ตามปกติ
            hashed_password = user.get("password")
            if not hashed_password:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="User has no password hash",
                )

            try:
                # bcryptjs ใน Node ใช้ format เดียวกับ bcrypt ใน Python
                is_valid = bcrypt.checkpw(
                    password.encode("utf-8"),
                    hashed_password.encode("utf-8"),
                )
            except Exception as e:
                print("bcrypt compare error:", e)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="bcrypt error",
                )

            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                )

            # response structure ให้เหมือนฝั่ง JS
            return {
                "success": True,
                "user": {
                    "id": user.get("id"),
                    "username": user.get("username"),
                    "firstname": user.get("firstname"),
                    "middlename": user.get("middlename"),
                    "lastname": user.get("lastname"),
                    "status": user.get("status"),
                    "department_id": user.get("department_id"),
                },
            }
    finally:
        release_connection(conn)
