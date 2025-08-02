#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { initializeDatabase } from '../src/db/init';

// Load environment variables
dotenv.config();

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');

    // Initialize database with basic tables
    await initializeDatabase();

    // Optionally run migrations if you have any
    // await runMigrations();

    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();