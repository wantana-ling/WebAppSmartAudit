# api/videos.py
"""
Endpoints สำหรับจัดการข้อมูลวิดีโอบันทึก session (videos):

- GET    /api/videos           : ดึงรายการวิดีโอแบบแบ่งหน้า + ค้นหา
- POST   /api/videos           : เพิ่มรายการวิดีโอใหม่
- DELETE /api/videos           : ลบวิดีโอตาม id หลายตัวในครั้งเดียว
"""

from typing import List, Optional
import os
from pathlib import Path

import aiomysql
from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import JSONResponse, FileResponse
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


@router.get("/{video_id}/file")
async def get_video_file(video_id: int, db=Depends(get_db)):
    """
    ดึงไฟล์ video ตาม ID
    - ถ้าไฟล์มีอยู่: ส่งไฟล์กลับไป
    - ถ้าไฟล์ไม่มี: ส่ง 404
    """
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                "SELECT recording_path FROM videos WHERE id = %s",
                (video_id,),
            )
            row = await cur.fetchone()

        if not row or not row.get("recording_path"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found or no file path"
            )

        file_path = row["recording_path"]
        
        # ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video file not found at: {file_path}"
            )

        # กำหนด media type ตาม extension
        file_ext = Path(file_path).suffix.lower()
        media_types = {
            '.mp4': 'video/mp4',
            '.avi': 'video/x-msvideo',
            '.mov': 'video/quicktime',
            '.mkv': 'video/x-matroska',
            '.webm': 'video/webm',
            '.flv': 'video/x-flv',
            '.wmv': 'video/x-ms-wmv',
            '.wrm': 'application/octet-stream',
        }
        
        media_type = media_types.get(file_ext, 'video/mp4')

        # ส่ง video file กลับไป
        return FileResponse(
            file_path,
            media_type=media_type,
            filename=Path(file_path).name
        )

    except HTTPException:
        raise
    except Exception as err:
        print(f"get_video_file error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve video file"
        )


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
