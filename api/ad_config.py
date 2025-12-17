# api/ad_config.py
"""
Active Directory config endpoints

- GET  /api/ad-config  : ดึงค่า serverip_hostname (ถ้าไม่มีคืน {} ตาม behavior เดิม)
- POST /api/ad-config  : สร้าง / อัปเดต serverip_hostname (เก็บไว้ 1 แถวในตาราง ad_config)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import aiomysql

from .connectdb import get_db

router = APIRouter(
    prefix="/api/ad-config",
    tags=["ad-config"],
)


class ADConfigUpdate(BaseModel):
    serverip_hostname: str


# ---- GET /api/ad-config ----
@router.get("")
@router.get("/")
async def get_ad_config(db=Depends(get_db)):
    """
    ดึงค่า AD config (serverip_hostname)

    ถ้ามีข้อมูลใน ad_config → คืนแถวแรกเป็น dict
    ถ้าไม่มี → คืน {} (ตาม behavior เดิม)
    """
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                "SELECT serverip_hostname FROM ad_config LIMIT 1"
            )
            row = await cur.fetchone()

        return row or {}
    except Exception as err:
        print("Error fetching ad_config:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# ---- POST /api/ad-config ----
@router.post("")
@router.post("/")
async def update_ad_config(payload: ADConfigUpdate, db=Depends(get_db)):
    """
    สร้างหรืออัปเดตค่า serverip_hostname ให้เก็บไว้ 1 แถวใน ad_config
    """
    serverip_hostname = (payload.serverip_hostname or "").strip()

    if not serverip_hostname:
        # ตามโค้ดเดิม: 400 "serverip_hostname is required"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="serverip_hostname is required",
        )

    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            # เช็คว่ามี row เดิมมั้ย
            await cur.execute("SELECT id FROM ad_config LIMIT 1")
            row = await cur.fetchone()

            if row:
                # อัปเดต row แรก (ใช้ LIMIT 1 เหมือนเดิม)
                await cur.execute(
                    "UPDATE ad_config SET serverip_hostname=%s LIMIT 1",
                    (serverip_hostname,),
                )
            else:
                # ยังไม่มี row → insert ใหม่
                await cur.execute(
                    "INSERT INTO ad_config (serverip_hostname) VALUES (%s)",
                    (serverip_hostname,),
                )

        return {"success": True}
    except Exception as err:
        print("Error updating AD config:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )
