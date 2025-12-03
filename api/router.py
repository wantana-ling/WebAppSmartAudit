# api/router.py
"""
Router หลักของ FastAPI สำหรับ SmartAudit:
- ตั้งค่า FastAPI app
- ตั้งค่า CORS
- จัดการ DB connection pool (startup / shutdown)
- รวมทุก sub-router ของแต่ละโมดูล
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .connectdb import init_pool, close_pool
from .login import router as login_router
from .dashboard import router as dashboard_router
from .admin import router as admin_router
from .ad_config import router as ad_config_router
from .departments import router as departments_router
from .devices import router as devices_router
from .users import router as users_router
from .videos import router as videos_router


# ---------- สร้าง FastAPI app ----------
app = FastAPI(
    title="SmartAudit API",
    version="1.0.0",
)
# --------------------------------------


# ---------- CORS settings ----------
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    # ถ้ามี origin อื่น ๆ ก็เพิ่มตรงนี้ได้
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,  # เผื่ออนาคตใช้ cookie / session
    allow_methods=["*"],
    allow_headers=["*"],
)
# ----------------------------------


# ---------- DB pool startup / shutdown ----------
@app.on_event("startup")
async def on_startup() -> None:
    """สร้าง MySQL connection pool ตอนแอปรันขึ้นมา"""
    await init_pool()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    """ปิด MySQL connection pool ตอนแอปดับ"""
    await close_pool()
# ------------------------------------------------


# ---------- รวม router ทั้งหมด ----------
app.include_router(login_router)
app.include_router(dashboard_router)
app.include_router(admin_router)
app.include_router(ad_config_router)
app.include_router(departments_router)
app.include_router(devices_router)
app.include_router(users_router)
app.include_router(videos_router)
# ถ้ามี router ใหม่ก็ import + include เพิ่มได้เรื่อย ๆ
# --------------------------------------
