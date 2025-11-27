import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon with WebSocket for serverless environments
function createNeonConnection(databaseUrl: string) {
  // Configure WebSocket constructor for Neon serverless
  neonConfig.webSocketConstructor = ws;
  
  // Create Neon SQL connection
  const sql = neon(databaseUrl, { 
    fetchOptions: {
      cache: 'no-store'
    }
  });
  
  return drizzle(sql);
}

// Database connection utility with proper error handling
export async function testDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not configured, using in-memory storage');
    return false;
  }

  try {
    console.log('🔄 Testing database connection...');
    
    // Create database connection with proper WebSocket configuration
    const db = createNeonConnection(process.env.DATABASE_URL);
    
    // Test basic connection with a simple query
    await db.execute('SELECT 1 as test');
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages for common database issues
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Database server appears to be unreachable. Check DATABASE_URL and network connectivity.');
    } else if (error.message.includes('authentication')) {
      console.error('💡 Database authentication failed. Check credentials in DATABASE_URL.');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('💡 Database does not exist. Ensure the database is created.');
    } else if (error.message.includes('WebSocket')) {
      console.error('💡 WebSocket connection failed. This may be due to serverless environment limitations.');
    }
    
    // Log error but don't throw - let server start even if DB is unavailable
    console.error('⚠️  Continuing startup without database connection');
    
    return false;
  }
}

// Export database connection factory for use in other parts of the application
export function createDatabaseConnection(databaseUrl: string = process.env.DATABASE_URL!) {
  return createNeonConnection(databaseUrl);
}

export function validateDatabaseEnvironment() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.log('⚠️  DATABASE_URL not set - will use in-memory storage');
    return false;
  }
  
  // Basic validation of DATABASE_URL format
  try {
    const url = new URL(dbUrl);
    if (!url.protocol.startsWith('postgres')) {
      console.warn('⚠️  DATABASE_URL does not appear to be a PostgreSQL connection string');
    }
    return true;
  } catch (error) {
    console.error('❌ Invalid DATABASE_URL format:', error);
    return false;
  }
}