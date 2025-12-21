# api_test/connectdb.py
import aiomysql

DB_CONFIG = {
    "host": "210.1.60.188",
    "port": 3306,
    "user": "root",
    "password": "Smartaudit123!",
    "db": "smartaudit",
    "charset": "utf8mb4",
}

POOL_SIZE = 10

connection_pool: aiomysql.Pool | None = None


async def init_pool():
    """สร้าง MySQL connection pool ตอนแอปเริ่มทำงาน (lazy - ไม่ crash ถ้าเชื่อมต่อไม่ได้)"""
    global connection_pool
    if connection_pool is None:
        try:
            connection_pool = await aiomysql.create_pool(
                minsize=1,
                maxsize=POOL_SIZE,
                autocommit=True,
                **DB_CONFIG,
            )
            print("✅ MySQL pool created")
        except Exception as e:
            print("⚠️  Cannot create MySQL pool at startup:", e)
            print("⚠️  Will retry when connection is needed")
            # ไม่ raise เพื่อให้แอปสามารถเริ่มต้นได้
            # จะลองเชื่อมต่ออีกครั้งเมื่อ get_connection() ถูกเรียก
            connection_pool = None


async def close_pool():
    """ปิด MySQL connection pool ตอนแอปดับลง"""
    global connection_pool
    if connection_pool:
        connection_pool.close()
        await connection_pool.wait_closed()
        connection_pool = None
        print("MySQL pool closed")


async def get_connection():
    """Get connection from pool (async) - จะลองเชื่อมต่อใหม่ถ้ายังไม่มี pool"""
    global connection_pool
    if connection_pool is None:
        # ลองเชื่อมต่ออีกครั้งเมื่อต้องการใช้จริง
        try:
            connection_pool = await aiomysql.create_pool(
                minsize=1,
                maxsize=POOL_SIZE,
                autocommit=True,
                **DB_CONFIG,
            )
            print("✅ MySQL pool created (retry)")
        except Exception as e:
            raise ConnectionError(f"Failed to connect to MySQL: {e}")
    return await connection_pool.acquire()


def release_connection(conn):
    """Release connection back to pool"""
    global connection_pool
    if connection_pool:
        connection_pool.release(conn)
