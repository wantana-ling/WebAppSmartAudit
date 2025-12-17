# api/connectdb.py
from mysql.connector import pooling, Error

DB_CONFIG = {
    "host": "210.1.60.188",
    "port": 3306,
    "user": "root",
    "password": "Smartaudit123!",  # จาก .env
    "database": "smartaudit",
}

POOL_SIZE = 10

connection_pool: pooling.MySQLConnectionPool | None = None


def init_pool():
    global connection_pool
    if connection_pool is None:
        try:
            connection_pool = pooling.MySQLConnectionPool(
                pool_name="smartaudit_pool",
                pool_size=POOL_SIZE,
                **DB_CONFIG,
            )
            print("✅ MySQL pool created")
        except Error as e:
            print("❌ Cannot create MySQL pool:", e)
            raise


def get_connection():
    global connection_pool
    if connection_pool is None:
        init_pool()
    return connection_pool.get_connection()
