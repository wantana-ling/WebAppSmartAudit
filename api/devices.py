# api/devices.py
"""
Endpoints สำหรับจัดการข้อมูลอุปกรณ์ (devices):

- GET    /api/devices            : รายการ devices ทั้งหมด
- GET    /api/devices/{id}       : รายละเอียด device ตาม id
- POST   /api/devices            : เพิ่ม device ใหม่
- PUT    /api/devices/{id}       : แก้ไขข้อมูล device
- DELETE /api/devices/{id}       : ลบ device
"""

from typing import Optional

import aiomysql
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from .connectdb import get_db

router = APIRouter(
    prefix="/api/devices",
    tags=["devices"],
)


# --------- Pydantic Models ---------


class DeviceCreate(BaseModel):
    device_name: str
    ip: str
    department: str
    max_users: int
    device_type: str = "server"
    os: str = "Linux"
    status: str = "active"


class DeviceUpdate(BaseModel):
    device_name: str
    ip: str
    department: str
    max_users: Optional[int] = None
    device_type: Optional[str] = None
    os: Optional[str] = None
    status: Optional[str] = None


# -----------------------------------


def _trim(s: Optional[str]) -> str:
    """Trim string safely (รองรับ None)."""
    return s.strip() if isinstance(s, str) else ""


# GET /api/devices
@router.get("")
@router.get("/")
async def get_devices(db=Depends(get_db)):
    """ดึงรายการ devices ทั้งหมด."""
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                SELECT
                  device_id       AS id,
                  device_name     AS name,
                  ip,
                  department,
                  active_users,
                  max_users,
                  device_type,
                  os,
                  status,
                  date_create
                FROM devices
                ORDER BY device_id DESC
                """
            )
            rows = await cur.fetchall()
        return rows
    except Exception as err:
        print("GET /api/devices error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# GET /api/devices/{id}
@router.get("/{device_id}")
async def get_device_by_id(device_id: int, db=Depends(get_db)):
    """ดึงข้อมูล device ตาม id."""
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                SELECT
                  device_id       AS id,
                  device_name     AS name,
                  ip,
                  department,
                  active_users,
                  max_users,
                  device_type,
                  os,
                  status,
                  date_create
                FROM devices
                WHERE device_id = %s
                """,
                (device_id,),
            )
            row = await cur.fetchone()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found",
            )

        return row
    except HTTPException:
        raise
    except Exception as err:
        print("GET /api/devices/:id error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# POST /api/devices
@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_device(payload: DeviceCreate, db=Depends(get_db)):
    """
    สร้าง device ใหม่

    จำเป็นต้องมี:
    - device_name
    - ip
    - department
    - max_users
    """
    if (
        not payload.device_name
        or not payload.ip
        or not payload.department
        or payload.max_users is None
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="device_name, ip, department, max_users are required",
        )

    device_name = _trim(payload.device_name)
    ip = _trim(payload.ip)
    department = _trim(payload.department)
    device_type = _trim(payload.device_type or "server")
    os = _trim(payload.os or "Linux")
    status_str = _trim(payload.status or "active")
    max_users = payload.max_users

    try:
        async with db.cursor() as cur:
            await cur.execute(
                """
                INSERT INTO devices (
                  device_name,
                  device_type,
                  ip,
                  os,
                  status,
                  date_create,
                  department,
                  active_users,
                  max_users
                )
                VALUES (%s, %s, %s, %s, %s, NOW(), %s, 0, %s)
                """,
                (device_name, device_type, ip, os, status_str, department, max_users),
            )
            insert_id = cur.lastrowid

        return {
            "success": True,
            "id": insert_id,
            "message": "Device added successfully",
        }
    except Exception as err:
        print("POST /api/devices error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {err}",
        )


# PUT /api/devices/{id}
@router.put("/{device_id}")
async def update_device(
    device_id: int,
    payload: DeviceUpdate,
    db=Depends(get_db),
):
    """
    อัปเดตข้อมูล device

    บังคับให้ต้องมี:
    - device_name
    - ip
    - department

    ฟิลด์อื่นเป็น optional:
    - max_users, device_type, os, status
      ถ้าเป็น None → ใช้ค่าปัจจุบัน (ผ่าน COALESCE ใน SQL)
    """
    if not payload.device_name or not payload.ip or not payload.department:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="device_name, ip, department are required",
        )

    device_name = _trim(payload.device_name)
    ip = _trim(payload.ip)
    department = _trim(payload.department)
    max_users = payload.max_users
    device_type = _trim(payload.device_type) if payload.device_type is not None else None
    os = _trim(payload.os) if payload.os is not None else None
    status_str = _trim(payload.status) if payload.status is not None else None

    try:
        async with db.cursor() as cur:
            affected = await cur.execute(
                """
                UPDATE devices
                SET device_name = %s,
                    ip          = %s,
                    department  = %s,
                    max_users   = COALESCE(%s, max_users),
                    device_type = COALESCE(%s, device_type),
                    os          = COALESCE(%s, os),
                    status      = COALESCE(%s, status),
                    date_create = NOW()
                WHERE device_id = %s
                """,
                (
                    device_name,
                    ip,
                    department,
                    max_users,
                    device_type,
                    os,
                    status_str,
                    device_id,
                ),
            )

        if affected == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found",
            )

        return {
            "success": True,
            "message": "Device updated successfully",
        }
    except HTTPException:
        raise
    except Exception as err:
        print("PUT /api/devices/:id error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# DELETE /api/devices/{id}
@router.delete("/{device_id}")
async def delete_device(device_id: int, db=Depends(get_db)):
    """ลบ device จากระบบตาม device_id."""
    try:
        async with db.cursor() as cur:
            affected = await cur.execute(
                "DELETE FROM devices WHERE device_id = %s",
                (device_id,),
            )

        if affected == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found",
            )

        return {
            "success": True,
            "message": "Device deleted successfully",
        }
    except HTTPException:
        raise
    except Exception as err:
        print("DELETE /api/devices/:id error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )
