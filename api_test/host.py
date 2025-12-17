# app/host.py
from fastapi import APIRouter, Request
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["host"])


class HostPayload(BaseModel):
    host: str | None = None
    user: str | None = None
    ip: str | None = None


@router.post("/")
async def handle_host(payload: HostPayload, request: Request):
    # x-forwarded-for → ถ้าเป็น proxy/load balancer
    client_ip = request.headers.get("x-forwarded-for")
    if client_ip:
        # บางทีเป็น "ip1, ip2" เอาอันแรกพอ
        client_ip = client_ip.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"

    time = datetime.utcnow().isoformat()

    print(
        f"[API] /api/host - host={payload.host} "
        f"user={payload.user or 'n/a'} "
        f"deviceIP={payload.ip or '-'} from={client_ip} at={time}"
    )

    return {
        "ok": True,
        "host": payload.host,
        "user": payload.user,
        "deviceIP": payload.ip,
        "clientIp": client_ip,
        "time": time,
    }
