// Set up environment variables FIRST before any imports
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

import * as fc from 'fast-check';
import { v4 as uuidv4 } from 'uuid';

// Mock the database module
jest.mock('../db', () => ({
  query: jest.fn(),
  pool: {
    query: jest.fn(),
    end: jest.fn(),
  },
}));

// Mock ioredis to prevent real Redis connections
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
  }));
});

import {
  createFarmerProfile,
  updateFarmerProfile,
  getFarmerProfile,
  FarmerProfileData,
  AppError,
} from './userService';
import { query } from '../db';

const mockQuery = query as jest.MockedFunction<typeof query>;

// ─── Arbitraries (Generators) ────────────────────────────────────────────────

/**
 * Generator for valid mobile numbers (10-15 digits)
 */
const arbMobileNumber = fc.string({ minLength: 10, maxLength: 15 }).filter(s => /^\d+$/.test(s));

/**
 * Generator for valid farmer profile data
 */
const arbFarmerProfile: fc.Arbitrary<FarmerProfileData> = fc.record({
  mobileNumber: arbMobileNumber,
  name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  preferredLang: fc.option(fc.constantFrom<'en' | 'hi' | 'pa'>('en', 'hi', 'pa'), { nil: undefined }),
  village: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  district: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  state: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  landSizeAcres: fc.option(fc.float({ min: Math.fround(0.1), max: Math.fround(1000), noNaN: true }), { nil: undefined }),
}) as fc.Arbitrary<FarmerProfileData>;

/**
 * Generator for partial profile updates
 */
const arbProfileUpdate: fc.Arbitrary<Partial<FarmerProfileData>> = fc.record({
  name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  preferredLang: fc.option(fc.constantFrom<'en' | 'hi' | 'pa'>('en', 'hi', 'pa'), { nil: undefined }),
  village: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  district: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  state: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  landSizeAcres: fc.option(fc.float({ min: Math.fround(0.1), max: Math.fround(1000), noNaN: true }), { nil: undefined }),
}, { requiredKeys: [] }) as fc.Arbitrary<Partial<FarmerProfileData>>;

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('UserService - Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReset();
  });

  // ─── Property 1: Registration creates a complete farmer profile ────────────

  // Feature: smart-crop-advisory, Property 1: Registration creates a complete farmer profile
  describe('Property 1: Registration creates a complete farmer profile', () => {
    it('should create a farmer profile with all required fields present in DB after registration', async () => {
      await fc.assert(
        fc.asyncProperty(arbFarmerProfile, async (profileData) => {
          const farmerId = uuidv4();

          // Mock the database INSERT query
          mockQuery.mockResolvedValueOnce({
            rows: [
              {
                id: farmerId,
                mobile_number: profileData.mobileNumber,
                name: profileData.name ?? null,
                preferred_lang: profileData.preferredLang ?? 'en',
                village: profileData.village ?? null,
                district: profileData.district ?? null,
                state: profileData.state ?? null,
                land_size_acres: profileData.landSizeAcres !== undefined ? profileData.landSizeAcres.toString() : null,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ],
            rowCount: 1,
            command: 'INSERT',
            oid: 0,
            fields: [],
          });

          // Create the farmer profile
          const result = await createFarmerProfile(farmerId, profileData);

          // Assert all required fields are present
          expect(result.id).toBe(farmerId);
          expect(result.mobileNumber).toBe(profileData.mobileNumber);
          expect(result.preferredLang).toBe(profileData.preferredLang ?? 'en');

          // Optional fields should match what was submitted
          if (profileData.name !== undefined) {
            expect(result.name).toBe(profileData.name);
          }
          if (profileData.village !== undefined) {
            expect(result.village).toBe(profileData.village);
          }
          if (profileData.district !== undefined) {
            expect(result.district).toBe(profileData.district);
          }
          if (profileData.state !== undefined) {
            expect(result.state).toBe(profileData.state);
          }
          if (profileData.landSizeAcres !== undefined) {
            expect(result.landSizeAcres).toBe(profileData.landSizeAcres);
          }

          // Verify the database was called with correct parameters
          expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO farmers'),
            expect.arrayContaining([
              farmerId,
              profileData.mobileNumber,
              profileData.name ?? null,
              profileData.preferredLang ?? 'en',
              profileData.village ?? null,
              profileData.district ?? null,
              profileData.state ?? null,
              profileData.landSizeAcres ?? null,
            ])
          );
        }),
        { numRuns: 100 }
      );
    });

    it('should store all required fields exactly as submitted', async () => {
      const profileData: FarmerProfileData = {
        mobileNumber: '9876543210',
        name: 'Test Farmer',
        preferredLang: 'hi',
        village: 'Test Village',
        district: 'Test District',
        state: 'Punjab',
        landSizeAcres: 5.5,
      };

      const farmerId = uuidv4();

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: farmerId,
            mobile_number: profileData.mobileNumber,
            name: profileData.name,
            preferred_lang: profileData.preferredLang,
            village: profileData.village,
            district: profileData.district,
            state: profileData.state,
            land_size_acres: profileData.landSizeAcres !== undefined ? profileData.landSizeAcres.toString() : null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      const result = await createFarmerProfile(farmerId, profileData);

      expect(result.mobileNumber).toBe(profileData.mobileNumber);
      expect(result.name).toBe(profileData.name);
      expect(result.preferredLang).toBe(profileData.preferredLang);
      expect(result.village).toBe(profileData.village);
      expect(result.district).toBe(profileData.district);
      expect(result.state).toBe(profileData.state);
      expect(result.landSizeAcres).toBe(profileData.landSizeAcres);
    });
  });

  // ─── Property 2: Profile update round-trip ──────────────────────────────────

  // Feature: smart-crop-advisory, Property 2: Profile update round-trip
  describe('Property 2: Profile update round-trip', () => {
    it('should retrieve updated values for every updated field after update operation', async () => {
      await fc.assert(
        fc.asyncProperty(
          arbFarmerProfile,
          arbProfileUpdate,
          async (initialProfile, updates) => {
            const farmerId = uuidv4();

            // Create initial profile
            const initialDbRow = {
              id: farmerId,
              mobile_number: initialProfile.mobileNumber,
              name: initialProfile.name ?? null,
              preferred_lang: initialProfile.preferredLang ?? 'en',
              village: initialProfile.village ?? null,
              district: initialProfile.district ?? null,
              state: initialProfile.state ?? null,
              land_size_acres: initialProfile.landSizeAcres !== undefined ? initialProfile.landSizeAcres.toString() : null,
              created_at: new Date(),
              updated_at: new Date(),
            };

            // Mock the UPDATE query - merge updates with initial values
            const updatedDbRow = {
              ...initialDbRow,
              name: updates.name !== undefined ? updates.name : initialDbRow.name,
              preferred_lang: updates.preferredLang !== undefined ? updates.preferredLang : initialDbRow.preferred_lang,
              village: updates.village !== undefined ? updates.village : initialDbRow.village,
              district: updates.district !== undefined ? updates.district : initialDbRow.district,
              state: updates.state !== undefined ? updates.state : initialDbRow.state,
              land_size_acres: updates.landSizeAcres !== undefined ? updates.landSizeAcres.toString() : initialDbRow.land_size_acres,
              updated_at: new Date(),
            };

            mockQuery.mockResolvedValueOnce({
              rows: [updatedDbRow],
              rowCount: 1,
              command: 'UPDATE',
              oid: 0,
              fields: [],
            });

            // Perform the update
            const result = await updateFarmerProfile(farmerId, updates);

            // Assert that every updated field matches the new value
            if (updates.name !== undefined) {
              expect(result.name).toBe(updates.name);
            }
            if (updates.preferredLang !== undefined) {
              expect(result.preferredLang).toBe(updates.preferredLang);
            }
            if (updates.village !== undefined) {
              expect(result.village).toBe(updates.village);
            }
            if (updates.district !== undefined) {
              expect(result.district).toBe(updates.district);
            }
            if (updates.state !== undefined) {
              expect(result.state).toBe(updates.state);
            }
            if (updates.landSizeAcres !== undefined) {
              expect(result.landSizeAcres).toBe(updates.landSizeAcres);
            }

            // Verify the database was called
            expect(mockQuery).toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve unchanged fields after partial update', async () => {
      const farmerId = uuidv4();
      const initialProfile = {
        id: farmerId,
        mobile_number: '9876543210',
        name: 'Original Name',
        preferred_lang: 'en',
        village: 'Original Village',
        district: 'Original District',
        state: 'Punjab',
        land_size_acres: '10.5',
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Update only the name
      const updates = { name: 'Updated Name' };

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            ...initialProfile,
            name: updates.name,
            updated_at: new Date(),
          },
        ],
        rowCount: 1,
        command: 'UPDATE',
        oid: 0,
        fields: [],
      });

      const result = await updateFarmerProfile(farmerId, updates);

      // Updated field should change
      expect(result.name).toBe('Updated Name');

      // Unchanged fields should remain the same
      expect(result.mobileNumber).toBe(initialProfile.mobile_number);
      expect(result.preferredLang).toBe(initialProfile.preferred_lang);
      expect(result.village).toBe(initialProfile.village);
      expect(result.district).toBe(initialProfile.district);
      expect(result.state).toBe(initialProfile.state);
      expect(result.landSizeAcres).toBe(parseFloat(initialProfile.land_size_acres));
    });
  });

  // ─── Property 3: Duplicate mobile number is rejected ────────────────────────

  // Feature: smart-crop-advisory, Property 3: Duplicate mobile number is rejected
  describe('Property 3: Duplicate mobile number is rejected', () => {
    it('should reject registration with duplicate mobile number and return error', async () => {
      await fc.assert(
        fc.asyncProperty(arbMobileNumber, async (mobileNumber) => {
          const farmerId1 = uuidv4();
          const farmerId2 = uuidv4();

          // First registration succeeds
          mockQuery.mockResolvedValueOnce({
            rows: [
              {
                id: farmerId1,
                mobile_number: mobileNumber,
                name: null,
                preferred_lang: 'en',
                village: null,
                district: null,
                state: null,
                land_size_acres: null,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ],
            rowCount: 1,
            command: 'INSERT',
            oid: 0,
            fields: [],
          });

          const firstProfile = await createFarmerProfile(farmerId1, { mobileNumber });
          expect(firstProfile.mobileNumber).toBe(mobileNumber);

          // Second registration with same mobile number should fail
          // Mock database duplicate key error (PostgreSQL error code 23505)
          const duplicateError: any = new Error('duplicate key value violates unique constraint');
          duplicateError.code = '23505';
          mockQuery.mockRejectedValueOnce(duplicateError);

          // Attempt second registration
          await expect(
            createFarmerProfile(farmerId2, { mobileNumber })
          ).rejects.toThrow(AppError);

          await expect(
            createFarmerProfile(farmerId2, { mobileNumber })
          ).rejects.toMatchObject({
            code: 'DUPLICATE_MOBILE',
            message: expect.stringContaining('already registered'),
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should leave existing profile unchanged when duplicate registration is rejected', async () => {
      const mobileNumber = '9876543210';
      const farmerId1 = uuidv4();
      const farmerId2 = uuidv4();

      const existingProfile = {
        id: farmerId1,
        mobile_number: mobileNumber,
        name: 'Existing Farmer',
        preferred_lang: 'hi',
        village: 'Existing Village',
        district: 'Existing District',
        state: 'Punjab',
        land_size_acres: '15.5',
        created_at: new Date(),
        updated_at: new Date(),
      };

      // First registration succeeds
      mockQuery.mockResolvedValueOnce({
        rows: [existingProfile],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      const firstProfile = await createFarmerProfile(farmerId1, {
        mobileNumber,
        name: 'Existing Farmer',
        preferredLang: 'hi',
        village: 'Existing Village',
        district: 'Existing District',
        state: 'Punjab',
        landSizeAcres: 15.5,
      });

      // Second registration fails
      const duplicateError: any = new Error('duplicate key value violates unique constraint');
      duplicateError.code = '23505';
      mockQuery.mockRejectedValueOnce(duplicateError);

      try {
        await createFarmerProfile(farmerId2, { mobileNumber });
        fail('Should have thrown AppError');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('DUPLICATE_MOBILE');
      }

      // Verify the first profile by fetching it
      mockQuery.mockResolvedValueOnce({
        rows: [existingProfile],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      const retrievedProfile = await getFarmerProfile(farmerId1);

      // Existing profile should remain unchanged
      expect(retrievedProfile.id).toBe(farmerId1);
      expect(retrievedProfile.mobileNumber).toBe(mobileNumber);
      expect(retrievedProfile.name).toBe('Existing Farmer');
      expect(retrievedProfile.preferredLang).toBe('hi');
    });

    it('should reject duplicate mobile numbers regardless of other field values', async () => {
      const mobileNumber = '9876543210';
      const farmerId1 = uuidv4();
      const farmerId2 = uuidv4();

      // First registration with minimal data
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: farmerId1,
            mobile_number: mobileNumber,
            name: null,
            preferred_lang: 'en',
            village: null,
            district: null,
            state: null,
            land_size_acres: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      await createFarmerProfile(farmerId1, { mobileNumber });

      // Second registration with complete data but same mobile number
      const duplicateError: any = new Error('duplicate key value violates unique constraint');
      duplicateError.code = '23505';
      mockQuery.mockRejectedValueOnce(duplicateError);

      await expect(
        createFarmerProfile(farmerId2, {
          mobileNumber,
          name: 'Different Farmer',
          preferredLang: 'pa',
          village: 'Different Village',
          district: 'Different District',
          state: 'Haryana',
          landSizeAcres: 20.0,
        })
      ).rejects.toMatchObject({
        code: 'DUPLICATE_MOBILE',
      });
    });
  });
});
