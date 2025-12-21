# api/login.py
"""
Endpoint สำหรับจัดการการล็อกอินของผู้ดูแลระบบ (admin)

- รับ username และ password จาก frontend
- ตรวจสอบว่ามี user นี้ในตาราง admin หรือไม่
- ตรวจสอบรหัสผ่านโดยใช้ bcrypt (เทียบกับ hash ใน DB)
- ถ้าไม่ผ่าน → คืน 401 Invalid credentials
- ถ้าผ่าน → คืนข้อมูล admin บางส่วนกลับไป
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from pydantic import BaseModel
import bcrypt
import aiomysql

from .connectdb import get_db  # ดึง connection จาก pool


router = APIRouter(
    prefix="/api",   # ทำให้ path เป็น /api/login
    tags=["auth"],
)


@router.options("/login", include_in_schema=False)
async def login_options():
    """Handle CORS preflight request for login endpoint - must return 200 without redirect"""
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, X-Requested-With",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "3600",
        },
        content=""
    )


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(payload: LoginRequest, db=Depends(get_db)) -> dict:
    """
    ตรวจสอบสิทธิ์การเข้าสู่ระบบของ admin

    - payload.username: รหัสผู้ใช้ admin
    - payload.password: รหัสผ่าน plain text จาก frontend
    """
    username = (payload.username or "").strip()
    password = payload.password or ""

    # ---- ตรวจสอบ input ว่าครบไหม ----
    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing username or password",
        )

    # ---- ดึงข้อมูล admin จากฐานข้อมูล ----
    # ตรวจสอบ schema ของตาราง admin ก่อน:
    # ถ้าใช้ column 'user_id' ให้เปลี่ยน WHERE username เป็น WHERE user_id
    # หรือใช้ column อื่นที่อยู่ในตาราง admin จริงๆ
    async with db.cursor(aiomysql.DictCursor) as cur:
        # ลองใช้ user_id ก่อน (ตาม api_test/login.py)
        await cur.execute(
            "SELECT * FROM admin WHERE user_id = %s",
            (username,),
        )
        admin = await cur.fetchone()

    # ---- เช็คว่ามี user นี้ไหม ----
    if not admin:
        # ไม่บอกว่า user ไม่มีหรือ password ผิด เพื่อความปลอดภัย
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # ---- ตรวจสอบรหัสผ่านด้วย bcrypt ----
    stored_hash = admin["password"]
    stored_hash_bytes = (
        stored_hash.encode("utf-8") if isinstance(stored_hash, str) else stored_hash
    )

    if not bcrypt.checkpw(password.encode("utf-8"), stored_hash_bytes):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # ---- สำเร็จ: คืนข้อมูลเท่าที่จำเป็นกลับไปให้ frontend ----
    # ใช้ user_id หรือ username ตามที่ตารางมี
    return {
        "success": True,
        "message": "Login successful",
        "admin_info": {
            "username": admin.get("username") or admin.get("user_id") or username,
            "company": admin.get("company"),
        },
    }
