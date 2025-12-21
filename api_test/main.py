# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from login import router as login_router
from host import router as host_router
from ipserver import router as ipserver_router
from connectdb import init_pool, close_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    """จัดการ MySQL connection pool lifecycle (startup / shutdown)"""
    # Startup: สร้าง MySQL connection pool
    await init_pool()
    yield
    # Shutdown: ปิด MySQL connection pool
    await close_pool()


app = FastAPI(title="Smartaudit JS → FastAPI", lifespan=lifespan)

# CORS settings - ต้องระบุ origin ที่ชัดเจนเมื่อใช้ allow_credentials=True
# ไม่สามารถใช้ "*" ได้เมื่อ allow_credentials=True
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    # เพิ่ม origin อื่นๆ ที่ต้องการได้ที่นี่
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # ระบุ origin ที่ชัดเจน
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# เอา router เข้ามาเหมือน app.use('/api', loginRoutes(db));
app.include_router(login_router, prefix="/api")
app.include_router(host_router, prefix="/api/host")
app.include_router(ipserver_router, prefix="/api/ipserver")


@app.get("/ping")
async def ping():
    return {"status": "ok"}
