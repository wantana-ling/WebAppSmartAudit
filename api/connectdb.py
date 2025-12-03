# api/connectdb.py
"""
Database connection manager for SmartAudit API.

- โหลดค่าการเชื่อมต่อจากไฟล์ .env ที่ root โปรเจกต์
- สร้าง MySQL connection pool ด้วย aiomysql.create_pool
- ให้ get_db() ไว้ใช้กับ FastAPI Depends ในแต่ละ endpoint
"""

import os
import aiomysql
from dotenv import load_dotenv
from fastapi import HTTPException

# ---------------------------------------------------
# โหลด .env จาก root ของโปรเจกต์แบบ fix path แน่นอน
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(ENV_PATH)
print("Loaded .env from:", ENV_PATH)

# ---------------------------------------------------
# อ่านค่าจาก .env
# ---------------------------------------------------
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = int(os.getenv("DB_PORT", 3306))
POOL_SIZE = int(os.getenv("POOL_SIZE", 10))

print("ENV VALUES:", DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT)

pool: aiomysql.Pool | None = None


async def init_pool():
    """สร้าง MySQL connection pool ตอนแอปเริ่มทำงาน."""
    global pool
    if pool is not None:
        # ป้องกันไม่ให้สร้างซ้ำ
        return

    print("Initializing MySQL pool...")

    if not DB_USER or not DB_NAME:
        raise RuntimeError(
            "DB_USER หรือ DB_NAME ไม่ถูกตั้งค่าใน .env (DB_USER / DB_NAME ต้องมีค่า)"
        )

    kwargs = dict(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME,
        minsize=1,
        maxsize=POOL_SIZE,
        autocommit=True,
        charset="utf8mb4",
    )
    # Note: loop parameter is deprecated in aiomysql, removed for compatibility

    pool = await aiomysql.create_pool(**kwargs)
    print(f"POOL READY: {DB_USER}@{DB_HOST}/{DB_NAME}")


async def close_pool():
    """ปิด MySQL connection pool ตอนแอปดับลง."""
    global pool
    if pool:
        pool.close()
        await pool.wait_closed()
        pool = None
        print("MySQL pool closed")


async def get_db():
    """
    Dependency สำหรับ FastAPI:
    ใช้ใน endpoint แบบ db=Depends(get_db)

    ตัวอย่าง:
        async def some_route(db = Depends(get_db)):
            async with db.cursor() as cur:
                await cur.execute("SELECT 1")
    """
    global pool
    if pool is None:
        # ใช้ HTTPException ให้ client เห็นว่า server side ยังไม่พร้อม
        raise HTTPException(status_code=500, detail="DB pool not initialized")

    async with pool.acquire() as conn:
        yield conn
