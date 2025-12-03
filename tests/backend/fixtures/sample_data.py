"""
Sample data fixtures for testing
"""
import bcrypt


def get_sample_admin():
    """Get sample admin data."""
    password = "admin123"
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    return {
        "user_id": "admin",
        "company": "Test Company",
        "password": hashed
    }


def get_sample_user():
    """Get sample user data."""
    return {
        "user_id": 10001,
        "firstname": "John",
        "midname": "",
        "lastname": "Doe",
        "department_id": 1,
        "status": "active",
        "password": "password123"
    }


def get_sample_department():
    """Get sample department data."""
    return {
        "id": 1,
        "department_name": "IT Department"
    }


def get_sample_device():
    """Get sample device data."""
    return {
        "id": 1,
        "device_name": "Test Server",
        "ip": "192.168.1.100",
        "department": "IT Department",
        "max_users": 10,
        "create_by": "admin"
    }


def get_sample_video():
    """Get sample video data."""
    return {
        "id": 1,
        "user": "test_user",
        "target": "192.168.1.100",
        "recording_path": "/videos/test.mp4",
        "date": "2024-01-01",
        "start": "10:00:00",
        "stop": "11:00:00",
        "duration": "01:00:00"
    }

