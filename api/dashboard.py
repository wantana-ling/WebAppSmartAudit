# api/dashboard.py
from fastapi import APIRouter, Depends, Query
import aiomysql

from .connectdb import get_db

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
)

# ----- Dashboard Summary -----
@router.get("/stats")
async def dashboard_stats(db=Depends(get_db)):
    async with db.cursor(aiomysql.DictCursor) as cur:
        await cur.execute("SELECT COUNT(*) AS total_users FROM users")
        user_row = await cur.fetchone() or {"total_users": 0}

        await cur.execute("SELECT COUNT(*) AS total_devices FROM devices")
        device_row = await cur.fetchone() or {"total_devices": 0}

        await cur.execute("SELECT COUNT(*) AS total_videos FROM videos")
        video_row = await cur.fetchone() or {"total_videos": 0}

        await cur.execute("""
            SELECT IFNULL(SUM(duration), 0) AS total_minutes
            FROM videos
            WHERE DATE(date) = CURDATE()
        """)
        duration_row = await cur.fetchone() or {"total_minutes": 0}

    return {
        "accessCount":   video_row["total_videos"] or 0,
        "dailyUse":      duration_row["total_minutes"] or 0,
        "visitorActive": user_row["total_users"] or 0,
        "accessTrend":   2.3,
        "dailyUseTrend": -1.1,
    }

# ----- Users Chart -----
@router.get("/users")
async def dashboard_users(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000),
    db=Depends(get_db),
):
    async with db.cursor(aiomysql.DictCursor) as cur:
        await cur.execute(
            """
            SELECT DATE(date) AS day, COUNT(*) AS count
            FROM videos
            WHERE MONTH(date) = %s AND YEAR(date) = %s
            GROUP BY day
            ORDER BY day ASC
            """,
            (month, year),
        )
        rows = await cur.fetchall()

    return rows

# ----- History Timeline -----
@router.get("/history")
async def dashboard_history(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000),
    db=Depends(get_db),
):
    async with db.cursor(aiomysql.DictCursor) as cur:
        await cur.execute(
            """
            SELECT id, user, target,
                   DATE_FORMAT(date,  '%%Y-%%m-%%d') AS date,
                   TIME_FORMAT(start, '%%H:%%i:%%s') AS start,
                   TIME_FORMAT(stop,  '%%H:%%i:%%s') AS stop,
                   duration
            FROM videos
            WHERE MONTH(date) = %s AND YEAR(date) = %s
            ORDER BY date DESC, start DESC
            """,
            (month, year),
        )
        rows = await cur.fetchall()

    return rows

# ----- Available Years -----
@router.get("/years")
async def dashboard_years(db=Depends(get_db)):
    async with db.cursor(aiomysql.DictCursor) as cur:
        await cur.execute(
            "SELECT DISTINCT YEAR(date) AS year FROM videos ORDER BY year DESC"
        )
        rows = await cur.fetchall()

    years = [r["year"] for r in rows if r["year"] is not None]
    return years
