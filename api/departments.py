# api/departments.py
"""
Endpoints สำหรับจัดการแผนก (departments):

- GET    /api/departments          : รายการทุกแผนก
- GET    /api/departments/{id}     : ดึงข้อมูลแผนกตาม id
- POST   /api/departments          : เพิ่มแผนกใหม่
- PUT    /api/departments/{id}     : แก้ไขชื่อแผนก
- DELETE /api/departments/{id}     : ลบแผนก
"""

import aiomysql
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from .connectdb import get_db

router = APIRouter(
    prefix="/api/departments",
    tags=["departments"],
)


# --------- Pydantic Models ---------


class DepartmentCreate(BaseModel):
    name: str


class DepartmentUpdate(BaseModel):
    name: str


# -----------------------------------


def _trim_name(name: str | None) -> str:
    """Trim ค่า name ถ้าเป็น None ให้กลายเป็น string ว่าง."""
    return (name or "").strip()


# GET /api/departments
@router.get("/")
async def get_departments(db=Depends(get_db)):
    """ดึงรายการทุกแผนก."""
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute("SELECT id, department_name FROM department")
            rows = await cur.fetchall()
        return rows
    except Exception as err:
        print("GET /api/departments failed:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# GET /api/departments/{id}
@router.get("/{dept_id}")
async def get_department_by_id(dept_id: int, db=Depends(get_db)):
    """ดึงข้อมูลแผนกตาม id."""
    try:
        async with db.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                "SELECT id, department_name FROM department WHERE id = %s",
                (dept_id,),
            )
            row = await cur.fetchone()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

        return row
    except HTTPException:
        raise
    except Exception as err:
        print("GET /api/departments/{id} failed:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# POST /api/departments
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_department(payload: DepartmentCreate, db=Depends(get_db)):
    """สร้างแผนกใหม่."""
    name = _trim_name(payload.name)
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing department name",
        )

    try:
        async with db.cursor() as cur:
            await cur.execute(
                "INSERT INTO department (department_name) VALUES (%s)",
                (name,),
            )
            insert_id = cur.lastrowid

        return {
            "success": True,
            "id": insert_id,
            "message": "Department added",
        }
    except Exception as err:
        print("INSERT department failed:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# PUT /api/departments/{id}
@router.put("/{dept_id}")
async def update_department(
    dept_id: int,
    payload: DepartmentUpdate,
    db=Depends(get_db),
):
    """แก้ไขชื่อแผนกตาม id."""
    name = _trim_name(payload.name)
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing department name",
        )

    try:
        async with db.cursor() as cur:
            affected = await cur.execute(
                "UPDATE department SET department_name = %s WHERE id = %s",
                (name, dept_id),
            )

        if affected == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

        return {
            "success": True,
            "message": "Department updated successfully",
        }
    except HTTPException:
        raise
    except Exception as err:
        print("UPDATE department failed:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# DELETE /api/departments/{id}
@router.delete("/{dept_id}")
async def delete_department(dept_id: int, db=Depends(get_db)):
    """ลบแผนกตาม id."""
    try:
        async with db.cursor() as cur:
            affected = await cur.execute(
                "DELETE FROM department WHERE id = %s",
                (dept_id,),
            )

        if affected == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

        return {
            "success": True,
            "message": "Department deleted successfully",
        }
    except HTTPException:
        raise
    except Exception as err:
        print("DELETE department failed:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )
