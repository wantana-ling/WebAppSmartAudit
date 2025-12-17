# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .login import router as login_router
from .host import router as host_router
from .ipserver import router as ipserver_router

app = FastAPI(title="Smartaudit JS → FastAPI")

# ถ้ามึงใช้จาก React / Frontend อื่น แนะนำเปิด CORS แบบนี้ก่อน
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ถ้าอยากล็อกทีหลังค่อยมาแก้
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
