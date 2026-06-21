const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;

async function run() {
  let dbClient;

  if (databaseUrl) {
    console.log('🔄 Connecting directly to DATABASE_URL for migrations...');
    dbClient = new Client({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
    });
  } else {
    // Localhost flow
    const adminUrl = 'postgresql://postgres:password@localhost:5432/postgres';
    const dbName = 'smart_crop_advisory';
    const dbUrl = `postgresql://postgres:password@localhost:5432/${dbName}`;

    console.log('🔄 Checking database existence locally...');
    const adminClient = new Client({ connectionString: adminUrl });
    
    try {
      await adminClient.connect();
      const res = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
      if (res.rows.length === 0) {
        console.log(`➕ Database "${dbName}" does not exist. Creating...`);
        await adminClient.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Database "${dbName}" created successfully.`);
      } else {
        console.log(`ℹ️ Database "${dbName}" already exists.`);
      }
    } catch (err) {
      console.warn('⚠️ Could not verify/create local database via admin console:', err.message);
    } finally {
      try { await adminClient.end(); } catch (e) {}
    }

    console.log('🔄 Connecting to the target local database...');
    dbClient = new Client({ connectionString: dbUrl });
  }

  try {
    await dbClient.connect();
  } catch (err) {
    console.error('❌ Failed to connect to target database:', err.message);
    process.exit(1);
  }

  try {
    const sqlPath = path.join(__dirname, 'src', 'migrations', '001_initial_schema.sql');
    console.log(`📂 Reading migration file from ${sqlPath}...`);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute schema creation
    await dbClient.query(sql);
    console.log('🎉 Migrations ran successfully! Database schema is ready.');
  } catch (err) {
    console.error('❌ Error executing migrations:', err.message);
    process.exit(1);
  } finally {
    try { await dbClient.end(); } catch (e) {}
  }
}

run();
