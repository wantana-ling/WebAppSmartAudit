# api/videos.py
"""
Endpoints สำหรับจัดการข้อมูลวิดีโอบันทึก session (videos):

- GET    /api/videos           : ดึงรายการวิดีโอแบบแบ่งหน้า + ค้นหา
- POST   /api/videos           : เพิ่มรายการวิดีโอใหม่
- DELETE /api/videos           : ลบวิดีโอตาม id หลายตัวในครั้งเดียว
"""

from typing import List, Optional

import aiomysql
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .connectdb import get_db

router = APIRouter(
    prefix="/api/videos",
    tags=["videos"],
)


# ------- Helpers -------

def to_hms(sec: int) -> str:
    sec = max(0, int(sec))
    h = str(sec // 3600).zfill(2)
    m = str((sec % 3600) // 60).zfill(2)
    s = str(sec % 60).zfill(2)
    return f"{h}:{m}:{s}"


def diff_hms(start: str, stop: str) -> str:
    sh, sm, ss = [int(x) for x in start.split(":")]
    eh, em, es = [int(x) for x in stop.split(":")]
    t1 = sh * 3600 + sm * 60 + ss
    t2 = eh * 3600 + em * 60 + es
    return to_hms(max(0, t2 - t1))


# ------- Models -------

class VideoCreate(BaseModel):
    user: str
    target: str
    recording_path: str
    date: str
    start: str
    stop: str
    duration: Optional[str] = None


class VideoDelete(BaseModel):
    ids: List[int]


# ------- Routes -------

@router.get("/")
async def list_videos(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=1000),
    search: Optional[str] = Query(None, alias="search"),
    db=Depends(get_db),
):
    offset = (page - 1) * limit
    q = (search or "").strip()

    try:
        base_sql = "FROM videos WHERE 1"
        params: List = []

        if q:
            base_sql += " AND (`user` LIKE %s OR `target` LIKE %s OR recording_path LIKE %s)"
            like = f"%{q}%"
            params.extend([like, like, like])

        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(f"SELECT COUNT(*) AS total {base_sql}", params)
            row = await cur.fetchone()
            total = row["total"] if row else 0

            await cur.execute(
                f"""
                SELECT
                  id,
                  `user`,
                  `target`,
                  recording_path,
                  DATE_FORMAT(`date`,  '%%Y-%%m-%%d') AS date,
                  TIME_FORMAT(`start`, '%%H:%%i:%%s') AS start,
                  TIME_FORMAT(`stop`,  '%%H:%%i:%%s') AS stop,
                  duration
                {base_sql}
                ORDER BY id DESC
                LIMIT %s OFFSET %s
                """,
                params + [limit, offset],
            )
            rows = await cur.fetchall()

        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        if total_pages == 0:
            total_pages = 1

        return {
            "ok": True,
            "data": rows,
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": total_pages,
        }
    except Exception as err:
        print("fetch videos:", err)
        return JSONResponse(status_code=500, content={"ok": False, "error": "Database error"})


@router.post("/")
async def create_video(payload: VideoCreate, db=Depends(get_db)):
    user = (payload.user or "").strip()
    target = (payload.target or "").strip()
    recording_path = (payload.recording_path or "").strip()
    date = (payload.date or "").strip()
    start = (payload.start or "").strip()
    stop = (payload.stop or "").strip()
    dur = (payload.duration or "").strip() if payload.duration else ""

    if not (user and target and recording_path and date and start and stop):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Missing required fields"})

    if not dur:
        dur = diff_hms(start, stop)

    try:
        async with db.cursor() as cur:
            await cur.execute(
                """
                INSERT INTO videos (
                  `user`, `target`, recording_path, `date`, `start`, `stop`, duration
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (user, target, recording_path, date, start, stop, dur),
            )
            insert_id = cur.lastrowid

        return {"ok": True, "id": insert_id}
    except Exception as err:
        print("insert videos:", err)
        return JSONResponse(status_code=500, content={"ok": False, "error": "Database error"})


@router.delete("/")
async def delete_videos(payload: VideoDelete, db=Depends(get_db)):
    ids = payload.ids
    if not isinstance(ids, list) or len(ids) == 0:
        return JSONResponse(status_code=400, content={"ok": False, "error": "No ids provided"})

    try:
        placeholders = ",".join(["%s"] * len(ids))
        async with db.cursor() as cur:
            affected = await cur.execute(
                f"DELETE FROM videos WHERE id IN ({placeholders})",
                ids,
            )

        return {"ok": True, "deleted": affected}
    except Exception as err:
        print("delete videos:", err)
        return JSONResponse(status_code=500, content={"ok": False, "error": "Database error"})
