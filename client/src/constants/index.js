// API Configuration
export const API_BASE = process.env.REACT_APP_API_URL?.trim() || 'http://localhost:8000/api';
export const VIDEO_SERVER_URL = process.env.REACT_APP_VIDEO_SERVER_URL || 'http://localhost:3050';

// Pagination
export const PAGINATION_OPTIONS = [10, 50, 100];
export const DEFAULT_ROWS_PER_PAGE = 10;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ID: 'user_id',
  ADMIN: 'admin',
};

// Routes
export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ACTIVE_VISITOR: '/activeVisitor',
  LIVE_SCREEN: '/liveScreen',
  USER_MANAGEMENT: '/userManagement',
  DEVICE_MANAGEMENT: '/deviceManagement',
  DEPARTMENT: '/department',
  VIDEO: '/video',
  SETTING: '/setting',
};

// Messages
export const MESSAGES = {
  NO_DATA: 'ไม่พบข้อมูล',
  LOADING: 'Loading...',
  LOGGING_IN: 'Logging in...',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  EXIT: 'Exit',
  EXIT_VIEWER: 'Exit Viewer',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
  SEARCH_PLACEHOLDER: 'Search by name or user ID...',
  NO_VIDEO_STREAM: 'No video stream available',
  NO_VIDEO_STREAM_DESC: 'Please select a user to view their screen',
};

// Placeholder Values
export const PLACEHOLDERS = {
  DEVICE_IP: '192.134.xx.xx',
  USERNAME: 'Username',
  PASSWORD: 'Password',
};

// Modal Messages
export const MODAL_MESSAGES = {
  CONFIRM_VIEW_SCREEN: {
    TITLE: 'Are You Sure?',
    MESSAGE: 'The user will be notified that you are viewing their screen in real time.',
  },
};

