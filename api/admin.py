# api/admin.py
"""
Admin info endpoint

- GET /api/admin/me
  ดึงข้อมูล admin ตัวแรกจากตาราง admin
  ถ้าไม่มี row เลย → คืนค่า default (ตาม behavior เดิม)
"""

from fastapi import APIRouter, Depends
import aiomysql

from .connectdb import get_db

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
)


@router.get("/me")
async def get_admin_me(db=Depends(get_db)):
    """
    คืนข้อมูล admin คนแรก:
    - username
    - company

    ถ้าไม่มีข้อมูลในตาราง admin:
    คืน default:
        { "username": "admin", "company": "SmartAudit" }
    """
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            # ลองใช้ user_id แทน username (ตาม api_test/login.py)
            await cur.execute(
                "SELECT user_id, username, company FROM admin LIMIT 1"
            )
            row = await cur.fetchone()

        if row:
            # ใช้ username ถ้ามี ถ้าไม่มีใช้ user_id
            return {
                "username": row.get("username") or row.get("user_id") or "admin",
                "company": row.get("company") or "SmartAudit",
            }
        else:
            return {
                "username": "admin",
                "company": "SmartAudit",
            }

    except Exception as err:
        print("Error fetching admin info:", err)
        # ยังไม่เคยเจอเคสนี้ แต่ป้องกันไว้เพื่อความปลอดภัย
        return {
            "username": "admin",
            "company": "SmartAudit",
        }
