import fs from 'fs';
import path from 'path';

// Storage directory
const STORAGE_DIR = path.join(__dirname, '..', 'data');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// File paths
const USERS_FILE = path.join(STORAGE_DIR, 'users.json');
const USERS_BY_ID_FILE = path.join(STORAGE_DIR, 'usersById.json');
const SOIL_PROFILES_FILE = path.join(STORAGE_DIR, 'soilProfiles.json');
const REFRESH_TOKENS_FILE = path.join(STORAGE_DIR, 'refreshTokens.json');

// ─── Storage Interface ────────────────────────────────────────────────────────

export interface PersistedStorage {
  users: Map<string, any>;
  usersById: Map<string, any>;
  soilProfiles: Map<string, any>;
  refreshTokens: Map<string, any>;
}

// ─── Load from disk ───────────────────────────────────────────────────────────

export function loadStorage(): PersistedStorage {
  const users = loadMapFromFile(USERS_FILE);
  const usersById = loadMapFromFile(USERS_BY_ID_FILE);
  const soilProfiles = loadMapFromFile(SOIL_PROFILES_FILE);
  const refreshTokens = loadMapFromFile(REFRESH_TOKENS_FILE);

  console.log(`✅ Loaded ${users.size} users, ${soilProfiles.size} soil profiles from persistent storage`);

  return {
    users,
    usersById,
    soilProfiles,
    refreshTokens,
  };
}

// ─── Save to disk ─────────────────────────────────────────────────────────────

export function saveUsers(users: Map<string, any>, usersById: Map<string, any>): void {
  saveMapToFile(USERS_FILE, users);
  saveMapToFile(USERS_BY_ID_FILE, usersById);
}

export function saveSoilProfiles(soilProfiles: Map<string, any>): void {
  saveMapToFile(SOIL_PROFILES_FILE, soilProfiles);
}

export function saveRefreshTokens(refreshTokens: Map<string, any>): void {
  saveMapToFile(REFRESH_TOKENS_FILE, refreshTokens);
}

// ─── Helper functions ─────────────────────────────────────────────────────────

function loadMapFromFile(filePath: string): Map<string, any> {
  if (!fs.existsSync(filePath)) {
    return new Map();
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const obj = JSON.parse(content);
    return new Map(Object.entries(obj));
  } catch (err) {
    console.error(`⚠️  Failed to load ${filePath}:`, err);
    return new Map();
  }
}

function saveMapToFile(filePath: string, map: Map<string, any>): void {
  try {
    const obj = Object.fromEntries(map);
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error(`⚠️  Failed to save ${filePath}:`, err);
  }
}
