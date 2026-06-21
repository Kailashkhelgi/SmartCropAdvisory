# ⚠️ IMPORTANT: Data Persistence Information

## Why Your Data Doesn't Save

### The Current Situation

Your application is using **in-memory storage** for development purposes. This means:

✅ **Data DOES save** - while the backend server is running
❌ **Data RESETS** - when you restart the backend server

This is **NORMAL BEHAVIOR** for development mode without a database.

---

## What Gets Reset

When you restart the backend (Terminal 8), all of the following data is lost:

1. **User Accounts** (mobile number + password)
2. **Profile Information** (name, village, district, etc.)
3. **Soil Profiles** (all your field data)
4. **JWT Tokens** (you'll need to login again)

---

## Why This Happens

```typescript
// In-memory storage (in RAM, not on disk)
const users = new Map<string, UserData>();           // Reset on restart
const usersById = new Map<string, UserData>();       // Reset on restart
const soilProfiles = new Map<string, SoilProfile>(); // Reset on restart
const refreshTokens = new Map<string, string>();     // Reset on restart
```

These `Map` data structures exist only in the server's memory. When the server stops, they disappear.

---

## How to Keep Your Data Between Sessions

### Option 1: Don't Restart the Backend (Easiest)

**Current Backend Status**: Running on Terminal 8

✅ **As long as Terminal 8 keeps running**, your data persists!

❌ **If you close Terminal 8 or restart the backend**, data is lost

**When does backend restart?**
- When you manually stop it (`Ctrl+C` in terminal)
- When you close the terminal window
- When you run `npm run dev` again
- When your computer restarts

---

### Option 2: Use a Database (Production Solution)

For permanent data storage, you need PostgreSQL. Here's how:

#### Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set during installation

**After Installation:**
```bash
# Create the database
psql -U postgres
CREATE DATABASE smart_crop_advisory;
\q
```

#### Update Environment Variables

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smart_crop_advisory
```

#### Run Migrations

```bash
cd backend
npm install pg
# Run the migration file
psql -U postgres -d smart_crop_advisory -f src/migrations/001_initial_schema.sql
```

#### Benefits of Database
- ✅ Data persists across restarts
- ✅ Data saved to disk
- ✅ Can handle thousands of users
- ✅ Production-ready

---

## Current Workaround: Manual Data Recreation

Since we don't have a database yet, you need to recreate your data after each backend restart:

### After Restarting Backend (Terminal 8):

1. **Register Again**
   - Go to http://localhost:5173
   - Register with your mobile number and password
   - Login

2. **Fill Profile Again**
   - Go to "My Profile"
   - Enter your details (name, village, district, etc.)
   - Save

3. **Create Soil Profiles Again**
   - Go to "Soil Profile"
   - Create your field profiles
   - Add all the soil data (pH, NPK, etc.)

4. **Now Everything Works**
   - Crop Advisory will see your soil profiles
   - Weather will work
   - All features operational

---

## Fixes Applied for Crop Advisory

### Issue: "No soil profiles found"

**Problem**: Crop Advisory page couldn't list soil profiles

**Solution Applied**:
1. Added `listSoilProfiles()` function in backend service
2. Added `GET /api/v1/soil-profiles` endpoint
3. Returns all soil profiles for the logged-in farmer

**Files Modified**:
- `backend/src/services/soilProfileService.ts`
- `backend/src/routes/soilProfiles.ts`

**Now Working**:
- ✅ Crop Advisory page can list all your soil profiles
- ✅ You can select a field to get recommendations
- ✅ Advisory Engine integration ready

---

## Testing the Fix

### Test Crop Advisory Feature:

1. **First, ensure you have data** (if backend was restarted):
   - Register/Login
   - Create at least one soil profile

2. **Go to Crop Advisory**:
   - Should see "Select Your Field" dropdown
   - Your soil profiles should appear in the list
   - Select a field
   - Click "Get Recommendations"

3. **Expected Behavior**:
   - ✅ Dropdown shows your soil profiles
   - ✅ Can select a field
   - ✅ Can request crop recommendations
   - ❌ Advisory Engine not running (you'll see an error about that)

---

## Advisory Engine Status

The Crop Advisory feature expects an Advisory Engine microservice to be running:

**Current Status**: ❌ Not running

**What it does**: Provides AI-powered crop recommendations based on soil data

**To start it** (Python required):
```bash
cd advisory-engine
pip install -r requirements.txt
python main.py
```

**Without it**: You'll see an error "Advisory Engine unavailable" when requesting recommendations

---

## Summary

### What Works Now ✅
1. User registration and login
2. Profile management
3. Soil profile creation and listing
4. Weather with location detection
5. **NEW**: Crop Advisory can access soil profiles

### What Still Resets ⚠️
- All data when backend restarts
- This is expected behavior for in-memory storage

### Solutions 🔧

**Short-term**: Keep backend running (don't restart Terminal 8)

**Long-term**: Set up PostgreSQL database

---

## Quick Reference

### Backend Status
- **Running**: Terminal 8
- **Port**: 3000
- **Storage**: In-memory (temporary)

### Frontend Status
- **Running**: Terminal 2
- **Port**: 5173
- **URL**: http://localhost:5173

### To Keep Data
1. **DON'T** close Terminal 8
2. **DON'T** restart the backend
3. **DO** keep both terminals running

### If You Must Restart
1. Stop backend (Ctrl+C in Terminal 8)
2. Start backend: `npm run dev`
3. Re-register your account
4. Re-create your profiles
5. Everything works again

---

## Need Help?

### If Crop Advisory still shows "No soil profiles":
1. Check if you're logged in
2. Create a soil profile first
3. Refresh the Crop Advisory page
4. Check browser console for errors

### If Login doesn't work:
- Backend probably restarted
- Register a new account
- This is normal for in-memory storage

### To make data permanent:
- Follow "Option 2: Use a Database" above
- Or keep backend running continuously

---

**Remember**: This is development mode. For production or long-term use, you'll need a proper database! 🚀
