/**
 * Tests for API utility functions
 */
import api from '../../../client/src/api';
import axios from 'axios';

jest.mock('axios');

describe('API Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('api instance is created with correct baseURL', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  test('api instance has withCredentials set to true', () => {
    expect(api.defaults.withCredentials).toBe(true);
  });

  test('api instance has correct headers', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  test('can make GET request', async () => {
    const mockData = { data: { id: 1, name: 'Test' } };
    axios.get.mockResolvedValueOnce(mockData);

    const response = await api.get('/test');
    
    expect(axios.get).toHaveBeenCalledWith('/test', expect.any(Object));
    expect(response.data).toEqual(mockData.data);
  });

  test('can make POST request', async () => {
    const mockData = { data: { success: true } };
    const postData = { name: 'Test' };
    axios.post.mockResolvedValueOnce(mockData);

    const response = await api.post('/test', postData);
    
    expect(axios.post).toHaveBeenCalledWith('/test', postData, expect.any(Object));
    expect(response.data).toEqual(mockData.data);
  });

  test('can make PUT request', async () => {
    const mockData = { data: { success: true } };
    const putData = { name: 'Updated Test' };
    axios.put.mockResolvedValueOnce(mockData);

    const response = await api.put('/test/1', putData);
    
    expect(axios.put).toHaveBeenCalledWith('/test/1', putData, expect.any(Object));
    expect(response.data).toEqual(mockData.data);
  });

  test('can make DELETE request', async () => {
    const mockData = { data: { success: true } };
    axios.delete.mockResolvedValueOnce(mockData);

    const response = await api.delete('/test/1');
    
    expect(axios.delete).toHaveBeenCalledWith('/test/1', expect.any(Object));
    expect(response.data).toEqual(mockData.data);
  });
});

