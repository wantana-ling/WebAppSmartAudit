/**
 * Tests for constants module
 * Ensures all constants are properly defined and exported
 */
import {
  API_BASE,
  VIDEO_SERVER_URL,
  PAGINATION_OPTIONS,
  DEFAULT_ROWS_PER_PAGE,
  STORAGE_KEYS,
  ROUTES,
  MESSAGES,
  PLACEHOLDERS,
  MODAL_MESSAGES,
} from '../../../client/src/constants';

describe('Constants Module', () => {
  test('API_BASE is defined', () => {
    expect(API_BASE).toBeDefined();
    expect(typeof API_BASE).toBe('string');
    expect(API_BASE.length).toBeGreaterThan(0);
  });

  test('VIDEO_SERVER_URL is defined', () => {
    expect(VIDEO_SERVER_URL).toBeDefined();
    expect(typeof VIDEO_SERVER_URL).toBe('string');
  });

  test('PAGINATION_OPTIONS is an array', () => {
    expect(Array.isArray(PAGINATION_OPTIONS)).toBe(true);
    expect(PAGINATION_OPTIONS.length).toBeGreaterThan(0);
    PAGINATION_OPTIONS.forEach(option => {
      expect(typeof option).toBe('number');
    });
  });

  test('DEFAULT_ROWS_PER_PAGE is a number', () => {
    expect(typeof DEFAULT_ROWS_PER_PAGE).toBe('number');
    expect(DEFAULT_ROWS_PER_PAGE).toBeGreaterThan(0);
  });

  test('STORAGE_KEYS contains required keys', () => {
    expect(STORAGE_KEYS).toBeDefined();
    expect(STORAGE_KEYS.USER_ID).toBeDefined();
    expect(STORAGE_KEYS.ADMIN).toBeDefined();
    expect(typeof STORAGE_KEYS.USER_ID).toBe('string');
    expect(typeof STORAGE_KEYS.ADMIN).toBe('string');
  });

  test('ROUTES contains all required routes', () => {
    const requiredRoutes = [
      'LOGIN',
      'DASHBOARD',
      'PROFILE',
      'ACTIVE_VISITOR',
      'LIVE_SCREEN',
      'USER_MANAGEMENT',
      'DEVICE_MANAGEMENT',
      'DEPARTMENT',
      'VIDEO',
      'SETTING',
    ];

    requiredRoutes.forEach(route => {
      expect(ROUTES[route]).toBeDefined();
      expect(typeof ROUTES[route]).toBe('string');
      expect(ROUTES[route].startsWith('/')).toBe(true);
    });
  });

  test('MESSAGES contains required messages', () => {
    const requiredMessages = [
      'NO_DATA',
      'LOADING',
      'LOGGING_IN',
      'LOGIN',
      'LOGOUT',
    ];

    requiredMessages.forEach(message => {
      expect(MESSAGES[message]).toBeDefined();
      expect(typeof MESSAGES[message]).toBe('string');
    });
  });

  test('PLACEHOLDERS contains required placeholders', () => {
    expect(PLACEHOLDERS).toBeDefined();
    expect(PLACEHOLDERS.USERNAME).toBeDefined();
    expect(PLACEHOLDERS.PASSWORD).toBeDefined();
  });

  test('MODAL_MESSAGES contains required modal messages', () => {
    expect(MODAL_MESSAGES).toBeDefined();
    expect(MODAL_MESSAGES.CONFIRM_VIEW_SCREEN).toBeDefined();
    expect(MODAL_MESSAGES.CONFIRM_VIEW_SCREEN.TITLE).toBeDefined();
    expect(MODAL_MESSAGES.CONFIRM_VIEW_SCREEN.MESSAGE).toBeDefined();
  });

  test('ROUTES are unique', () => {
    const routeValues = Object.values(ROUTES);
    const uniqueRoutes = new Set(routeValues);
    expect(routeValues.length).toBe(uniqueRoutes.size);
  });

  test('PAGINATION_OPTIONS are in ascending order', () => {
    for (let i = 1; i < PAGINATION_OPTIONS.length; i++) {
      expect(PAGINATION_OPTIONS[i]).toBeGreaterThan(PAGINATION_OPTIONS[i - 1]);
    }
  });
});

