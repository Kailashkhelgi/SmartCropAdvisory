const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const adminUrl = 'postgresql://postgres:password@localhost:5432/postgres';
const dbName = 'smart_crop_advisory';
const dbUrl = `postgresql://postgres:password@localhost:5432/${dbName}`;

async function run() {
  console.log('🔄 Checking database existence...');
  const adminClient = new Client({ connectionString: adminUrl });
  
  try {
    await adminClient.connect();
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL admin console:', err.message);
    process.exit(1);
  }

  try {
    const res = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rows.length === 0) {
      console.log(`➕ Database "${dbName}" does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully.`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Error checking/creating database:', err.message);
    await adminClient.end();
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  console.log('🔄 Connecting to the target database and running migrations...');
  const dbClient = new Client({ connectionString: dbUrl });
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
    await dbClient.end();
    process.exit(1);
  } finally {
    await dbClient.end();
  }
}

run();
