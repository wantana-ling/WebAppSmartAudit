# api/users.py
"""
Endpoints จัดการข้อมูลผู้ใช้ (users):

- GET   /api/users              : รายชื่อผู้ใช้ทั้งหมด (join department)
- GET   /api/users/{user_id}    : รายละเอียดผู้ใช้ตาม user_id
- POST  /api/users              : เพิ่มผู้ใช้ใหม่ (admin only)
- PUT   /api/users/{user_id}    : แก้ไขข้อมูลผู้ใช้ (รวมสถานะ / แผนก)
- DELETE /api/users/{user_id}   : ลบผู้ใช้
- PUT   /api/users/profile/{id} : ผู้ใช้แก้ไขชื่อ-นามสกุล + password ของตัวเอง
"""

from typing import Optional, Literal

import aiomysql
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from .connectdb import get_db

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)


# ---------- Pydantic Models ----------


class UserBase(BaseModel):
    firstname: str
    midname: Optional[str] = ""
    lastname: str
    department_id: Optional[int] = None


class UserCreate(UserBase):
    user_id: int = Field(..., description="user_id must be integer")
    password: str = Field(
        ...,
        min_length=6,
        description="Password must be at least 6 characters",
    )


class UserUpdate(UserBase):
    password: Optional[str] = Field(
        None,
        min_length=6,
        description="Password must be at least 6 characters",
    )
    status: Literal["active", "inactive"]


class UserProfileUpdate(BaseModel):
    firstname: str
    midname: Optional[str] = ""
    lastname: str
    password: str = Field(..., min_length=6)


# ---------- Helpers ----------


def _trim(s: Optional[str]) -> str:
    """Trim string safely (รองรับ None)."""
    return s.strip() if isinstance(s, str) else ""


# ---------- Routes ----------


# GET /api/users
@router.get("/")
async def get_users(db=Depends(get_db)):
    """ดึงรายชื่อผู้ใช้ทั้งหมด พร้อมชื่อแผนก."""
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                SELECT
                  u.user_id,
                  u.firstname,
                  u.midname,
                  u.lastname,
                  u.status,
                  d.department_name AS department,
                  u.department_id
                FROM users u
                LEFT JOIN department d ON u.department_id = d.id
                ORDER BY u.user_id ASC
                """
            )
            rows = await cur.fetchall()
        return rows
    except Exception as err:
        print("GET /api/users error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# GET /api/users/:id
@router.get("/{user_id}")
async def get_user_by_id(user_id: int, db=Depends(get_db)):
    """ดึงข้อมูลผู้ใช้ทีละคนตาม user_id."""
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                SELECT
                  u.user_id,
                  u.firstname,
                  u.midname,
                  u.lastname,
                  u.status,
                  d.department_name AS department,
                  u.department_id
                FROM users u
                LEFT JOIN department d ON u.department_id = d.id
                WHERE u.user_id = %s
                """,
                (user_id,),
            )
            row = await cur.fetchone()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return row
    except HTTPException:
        raise
    except Exception as err:
        print("GET /api/users/:id error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# POST /api/users
@router.post("/")
async def create_user(payload: UserCreate, db=Depends(get_db)):
    """สร้างผู้ใช้ใหม่ (admin ใช้)."""
    firstname = _trim(payload.firstname)
    lastname = _trim(payload.lastname)
    midname = payload.midname or ""
    department_id = (
        payload.department_id if isinstance(payload.department_id, int) else None
    )
    user_id = int(payload.user_id)
    password = _trim(payload.password)

    if not firstname or not lastname:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Firstname and lastname required",
        )

    try:
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")

        async with db.cursor() as cur:
            await cur.execute(
                """
                INSERT INTO users (
                  user_id, firstname, midname, lastname,
                  department_id, password, status
                )
                VALUES (%s, %s, %s, %s, %s, %s, 'active')
                """,
                (
                    str(user_id).strip(),
                    firstname,
                    midname,
                    lastname,
                    department_id,
                    hashed_password,
                ),
            )
            insert_id = cur.lastrowid

        return {
            "success": True,
            "message": "User created successfully",
            "userId": insert_id,
        }
    except Exception as err:
        print("POST /api/users error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# PUT /api/users/:id
@router.put("/{user_id}")
async def update_user(user_id: int, payload: UserUpdate, db=Depends(get_db)):
    """อัปเดตข้อมูลผู้ใช้ (รวมสถานะ / แผนก / password)."""
    firstname = _trim(payload.firstname)
    lastname = _trim(payload.lastname)
    midname = payload.midname or ""
    status_str = _trim(payload.status)
    department_id = (
        payload.department_id if isinstance(payload.department_id, int) else None
    )

    if not firstname or not lastname:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Firstname and lastname required",
        )

    try:
        # ถ้า password ไม่ส่งมา หรือเป็นค่าว่าง → ใช้ password เดิม
        if not payload.password or not _trim(payload.password):
            async with db.cursor(aiomysql.DictCursor) as cur:
                await cur.execute(
                    "SELECT password FROM users WHERE user_id = %s",
                    (user_id,),
                )
                row = await cur.fetchone()

            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )

            password_final = row["password"]
        else:
            password_final = bcrypt.hashpw(
                _trim(payload.password).encode("utf-8"),
                bcrypt.gensalt(),
            ).decode("utf-8")

        async with db.cursor() as cur:
            affected = await cur.execute(
                """
                UPDATE users
                SET firstname = %s,
                    midname   = %s,
                    lastname  = %s,
                    password  = %s,
                    department_id = %s,
                    status    = %s
                WHERE user_id = %s
                """,
                (
                    firstname,
                    midname,
                    lastname,
                    password_final,
                    department_id,
                    status_str,
                    user_id,
                ),
            )

        if affected == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return {
            "success": True,
            "message": "User updated successfully",
        }
    except HTTPException:
        raise
    except Exception as err:
        print("PUT /api/users/:id error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# DELETE /api/users/:id
@router.delete("/{user_id}")
async def delete_user(user_id: int, db=Depends(get_db)):
    """ลบผู้ใช้จากระบบ."""
    try:
        async with db.cursor() as cur:
            affected = await cur.execute(
                "DELETE FROM users WHERE user_id = %s",
                (user_id,),
            )

        if affected == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return {
            "success": True,
            "message": "User deleted successfully",
        }
    except HTTPException:
        raise
    except Exception as err:
        print("DELETE /api/users/:id error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# PUT /api/users/profile/:id
@router.put("/profile/{user_id}")
async def update_profile(
    user_id: int,
    payload: UserProfileUpdate,
    db=Depends(get_db),
):
    """ให้ user แก้ไขชื่อ-นามสกุล + password ของตัวเอง."""
    firstname = _trim(payload.firstname)
    lastname = _trim(payload.lastname)
    midname = payload.midname or ""
    password = _trim(payload.password)

    if not firstname or not lastname:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Firstname and lastname required",
        )

    try:
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")

        async with db.cursor() as cur:
            affected = await cur.execute(
                """
                UPDATE users
                SET firstname = %s,
                    midname   = %s,
                    lastname  = %s,
                    password  = %s
                WHERE user_id = %s
                """,
                (firstname, midname, lastname, hashed_password, user_id),
            )

        if affected == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return {
            "success": True,
            "message": "Profile updated successfully",
        }
    except HTTPException:
        raise
    except Exception as err:
        print("PUT /api/users/profile/:id error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )
