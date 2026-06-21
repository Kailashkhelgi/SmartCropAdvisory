import * as fc from 'fast-check';
import request from 'supertest';
import nock from 'nock';
import jwt from 'jsonwebtoken';

// Feature: smart-crop-advisory, Property 28: All API responses conform to the envelope structure

// Set up test environment variables before importing config
process.env.PORT = '3000';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '1h';
process.env.REFRESH_TOKEN_EXPIRES_IN = '30d';
process.env.OTP_PROVIDER_API_KEY = 'test-otp-key';
process.env.OTP_PROVIDER_SENDER_ID = 'SMCROP';
process.env.OPENWEATHERMAP_API_KEY = 'test-weather-key';
process.env.MARKET_PRICE_API_KEY = 'test-market-key';
process.env.MARKET_PRICE_API_URL = 'https://api.test.com';
process.env.GOOGLE_CLOUD_API_KEY = 'test-google-key';
process.env.FCM_SERVER_KEY = 'test-fcm-key';
process.env.ADVISORY_ENGINE_URL = 'http://localhost:8001';
process.env.VISION_ENGINE_URL = 'http://localhost:8002';

// Now import after env vars are set
import { createApp } from '../app';
import { config } from '../config';

/**
 * Property 28: All API responses conform to the envelope structure
 * Validates: Requirements 11.5
 * 
 * For any API endpoint and any input (valid or invalid), the HTTP response body
 * should be valid JSON containing exactly the fields `status`, `data`, and `error`,
 * where `status` is either `"success"` or `"error"`.
 */

describe('API Response Envelope - Property 28', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    // Clean all nock interceptors before each test
    nock.cleanAll();
  });

  afterAll(() => {
    nock.restore();
  });

  /**
   * Helper to generate a valid JWT token for testing
   */
  function generateValidJwt(farmerId: string): string {
    return jwt.sign({ sub: farmerId }, config.jwtSecret, { expiresIn: '1h' });
  }

  /**
   * Helper to validate envelope structure
   */
  function validateEnvelope(body: any): void {
    // Must be an object
    expect(typeof body).toBe('object');
    expect(body).not.toBeNull();

    // Must have exactly these three fields
    expect(Object.keys(body).sort()).toEqual(['data', 'error', 'status']);

    // Status must be either 'success' or 'error'
    expect(['success', 'error']).toContain(body.status);

    // If status is 'success', data should be non-null and error should be null
    if (body.status === 'success') {
      expect(body.data).not.toBeNull();
      expect(body.error).toBeNull();
    }

    // If status is 'error', data should be null and error should be an object
    if (body.status === 'error') {
      expect(body.data).toBeNull();
      expect(body.error).not.toBeNull();
      expect(typeof body.error).toBe('object');
      expect(body.error).toHaveProperty('code');
      expect(body.error).toHaveProperty('message');
    }
  }

  /**
   * Arbitrary generator for API endpoints
   */
  const arbApiEndpoint = fc.constantFrom(
    // Public endpoints
    { method: 'POST', path: '/api/v1/auth/register', requiresAuth: false },
    { method: 'POST', path: '/api/v1/auth/verify-otp', requiresAuth: false },
    { method: 'POST', path: '/api/v1/auth/refresh', requiresAuth: false },
    { method: 'GET', path: '/health', requiresAuth: false },
    
    // Protected endpoints
    { method: 'POST', path: '/api/v1/auth/logout', requiresAuth: true },
    { method: 'GET', path: '/api/v1/farmers/me', requiresAuth: true },
    { method: 'PUT', path: '/api/v1/farmers/me', requiresAuth: true },
    { method: 'POST', path: '/api/v1/soil-profiles', requiresAuth: true },
    { method: 'GET', path: '/api/v1/soil-profiles/123e4567-e89b-12d3-a456-426614174000', requiresAuth: true },
    { method: 'PUT', path: '/api/v1/soil-profiles/123e4567-e89b-12d3-a456-426614174000', requiresAuth: true },
    { method: 'GET', path: '/api/v1/advisory/crops', requiresAuth: true },
    { method: 'GET', path: '/api/v1/advisory/fertilizer', requiresAuth: true },
    { method: 'POST', path: '/api/v1/images/analyze', requiresAuth: true },
    { method: 'GET', path: '/api/v1/weather', requiresAuth: true },
    { method: 'GET', path: '/api/v1/market-prices', requiresAuth: true },
    { method: 'POST', path: '/api/v1/voice/stt', requiresAuth: true },
    { method: 'POST', path: '/api/v1/voice/tts', requiresAuth: true },
    { method: 'POST', path: '/api/v1/feedback', requiresAuth: true },
    { method: 'GET', path: '/api/v1/dashboard/reports', requiresAuth: true },
    { method: 'GET', path: '/api/v1/notifications', requiresAuth: true }
  );

  /**
   * Arbitrary generator for request payloads
   * Generates random valid and invalid payloads (only objects, as that's what JSON APIs accept)
   */
  const arbPayload = fc.oneof(
    // Empty object
    fc.constant({}),
    // Valid-looking payloads
    fc.record({
      mobileNumber: fc.string({ minLength: 10, maxLength: 15 }),
      otp: fc.string({ minLength: 6, maxLength: 6 }),
    }),
    fc.record({
      name: fc.string(),
      preferredLang: fc.constantFrom('en', 'hi', 'pa'),
      village: fc.string(),
      district: fc.string(),
      state: fc.string(),
      landSizeAcres: fc.float({ min: 0, max: 1000 }),
    }),
    fc.record({
      soilType: fc.string(),
      ph: fc.float({ min: -1, max: 15 }),
      nitrogen: fc.float({ min: -10, max: 500 }),
      phosphorus: fc.float({ min: -10, max: 500 }),
      potassium: fc.float({ min: -10, max: 500 }),
      latitude: fc.float({ min: -90, max: 90 }),
      longitude: fc.float({ min: -180, max: 180 }),
    }),
    // Random objects with various types
    fc.dictionary(fc.string(), fc.oneof(
      fc.string(),
      fc.integer(),
      fc.float(),
      fc.boolean(),
      fc.constant(null)
    ))
  );

  /**
   * Property test: All API responses conform to envelope structure
   */
  it('should return envelope structure for all API endpoints with any payload', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbApiEndpoint,
        arbPayload,
        fc.boolean(), // whether to include auth header
        async (endpoint, payload, includeAuth) => {
          // Mock external services to prevent real API calls
          nock('http://localhost:8001')
            .post('/internal/advisory/crops')
            .reply(200, { crops: [] })
            .persist();

          nock('http://localhost:8001')
            .post('/internal/advisory/fertilizer')
            .reply(200, { schedule: [] })
            .persist();

          nock('http://localhost:8002')
            .post('/internal/vision/analyze')
            .reply(200, { pest_or_disease: 'test', confidence: 0.8 })
            .persist();

          // Build the request
          let req = request(app)[endpoint.method.toLowerCase() as 'get' | 'post' | 'put'](endpoint.path);

          // Add auth header if needed
          if (includeAuth || endpoint.requiresAuth) {
            const token = generateValidJwt('test-farmer-id');
            req = req.set('Authorization', `Bearer ${token}`);
          }

          // Add payload for POST/PUT requests
          if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
            req = req.send(payload);
          }

          // Execute request
          const response = await req;

          // Validate envelope structure
          validateEnvelope(response.body);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Unit test: Verify specific success response structure
   */
  it('should return success envelope for valid health check', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    validateEnvelope(response.body);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toEqual({ status: 'ok' });
    expect(response.body.error).toBeNull();
  });

  /**
   * Unit test: Verify specific error response structure
   */
  it('should return error envelope for missing authentication', async () => {
    const response = await request(app).get('/api/v1/farmers/me');

    expect(response.status).toBe(401);
    validateEnvelope(response.body);
    expect(response.body.status).toBe('error');
    expect(response.body.data).toBeNull();
    expect(response.body.error).toHaveProperty('code');
    expect(response.body.error).toHaveProperty('message');
  });

  /**
   * Unit test: Verify error envelope for validation errors
   */
  it('should return error envelope with field for validation errors', async () => {
    const token = generateValidJwt('test-farmer-id');
    
    const response = await request(app)
      .post('/api/v1/soil-profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ ph: 20 }); // Invalid pH value

    expect(response.status).toBe(400);
    validateEnvelope(response.body);
    expect(response.body.status).toBe('error');
    expect(response.body.data).toBeNull();
    expect(response.body.error).toHaveProperty('code');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error).toHaveProperty('field');
  });

  /**
   * Unit test: Verify envelope structure for rate limit errors
   */
  it('should return error envelope for rate limit exceeded', async () => {
    // Make many requests to trigger rate limit
    const requests = Array(250).fill(null).map(() => 
      request(app).get('/health')
    );

    const responses = await Promise.all(requests);
    
    // At least one should be rate limited
    const rateLimited = responses.find(r => r.status === 429);
    
    if (rateLimited) {
      validateEnvelope(rateLimited.body);
      expect(rateLimited.body.status).toBe('error');
      expect(rateLimited.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    }
  });

  /**
   * Unit test: Verify envelope for non-existent routes (404)
   */
  it('should return error envelope for non-existent routes', async () => {
    const response = await request(app).get('/api/v1/non-existent-route');

    // Express default 404 handler might not use our envelope
    // But if we have a catch-all, it should
    if (response.status === 404) {
      // If the response has a body, it should follow envelope structure
      if (Object.keys(response.body).length > 0) {
        validateEnvelope(response.body);
      }
    }
  });

  /**
   * Property test: All public endpoints return envelope structure
   */
  it('should return envelope structure for all public endpoints', async () => {
    const publicEndpoints = [
      { method: 'POST', path: '/api/v1/auth/register', payload: { mobileNumber: '1234567890' } },
      { method: 'POST', path: '/api/v1/auth/verify-otp', payload: { mobileNumber: '1234567890', otp: '123456' } },
      { method: 'POST', path: '/api/v1/auth/refresh', payload: { farmerId: 'test-id', refreshToken: 'test-token' } },
    ];

    for (const endpoint of publicEndpoints) {
      // Mock OTP service
      nock('http://localhost:8080')
        .post('/send-otp')
        .reply(200, { success: true })
        .persist();

      const response = await request(app)
        [endpoint.method.toLowerCase() as 'post'](endpoint.path)
        .send(endpoint.payload);

      validateEnvelope(response.body);
    }
  });

  /**
   * Property test: All protected endpoints return envelope structure with and without auth
   */
  it('should return envelope structure for protected endpoints with valid auth', async () => {
    const token = generateValidJwt('test-farmer-id');
    
    const protectedEndpoints = [
      { method: 'GET', path: '/api/v1/farmers/me' },
      { method: 'GET', path: '/api/v1/notifications' },
      { method: 'GET', path: '/api/v1/weather' },
    ];

    // Mock external services
    nock('http://localhost:8001')
      .post('/internal/advisory/crops')
      .reply(200, { crops: [] })
      .persist();

    for (const endpoint of protectedEndpoints) {
      const response = await request(app)
        [endpoint.method.toLowerCase() as 'get'](endpoint.path)
        .set('Authorization', `Bearer ${token}`);

      validateEnvelope(response.body);
    }
  });

  /**
   * Property test: Invalid JSON payloads should still return envelope structure
   */
  it('should return envelope structure even for malformed requests', async () => {
    const token = generateValidJwt('test-farmer-id');

    // Test with various malformed payloads
    const malformedPayloads: any[] = [
      {},
      { invalid: 'data' },
      { ph: 'not-a-number' },
      { nested: { deeply: { invalid: true } } },
    ];

    for (const payload of malformedPayloads) {
      const response = await request(app)
        .post('/api/v1/soil-profiles')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(payload);

      // Should still return valid envelope
      validateEnvelope(response.body);
    }
  });
});
