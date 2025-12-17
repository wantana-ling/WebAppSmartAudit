from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# ----- model สำหรับรับ IP จากหน้า ENTER SERVER -----
class SelectedIP(BaseModel):
    host: str   # เช่น "104.214.185.13"


# ตัวแปรเก็บ IP ล่าสุดที่เลือก
current_host: str | None = None


# 1) หน้า SmartAudit กด ENTER SERVER แล้วเรียกอันนี้
@router.post("/select-ip")
def select_ip(body: SelectedIP):
    """
    รับ IP ที่ user เลือกจากหน้า SmartAudit
    แล้วเก็บไว้ในตัวแปร current_host
    """
    global current_host
    current_host = body.host
    return {"host": current_host}


# 2) ฝั่ง passthrough เรียก GET /host เพื่อขอ IP ปัจจุบัน
@router.get("/host")
def get_host():
    """
    ให้ passthrough ใช้ endpoint นี้ดึง IP ปัจจุบัน
    """
    if current_host is None:
        raise HTTPException(status_code=404, detail="No host selected yet")
    return {"host": current_host}
