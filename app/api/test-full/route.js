import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  const logs = [];
  
  logs.push('🔍 Starting database test...');
  
  try {
    logs.push('📡 Attempting to connect to MongoDB...');
    await connectDB();
    logs.push('✅ Database connected successfully!');
    
    // Check connection state
    const { connection } = await import('mongoose');
    logs.push(`📊 Connection state: ${connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Count users
    const userCount = await User.countDocuments();
    logs.push(`👥 Total users in database: ${userCount}`);
    
    // Get database info
    const db = connection.db;
    const collections = await db.listCollections().toArray();
    logs.push(`📚 Collections: ${collections.map(c => c.name).join(', ') || 'none yet'}`);
    
    logs.push('✨ Database test completed successfully!');
    
    return NextResponse.json({
      success: true,
      logs,
      details: {
        userCount,
        collections: collections.map(c => c.name),
        readyState: connection.readyState,
        databaseName: db.databaseName
      }
    });
    
  } catch (error) {
    logs.push(`❌ Error: ${error.message}`);
    console.error('Test error:', error);
    
    return NextResponse.json({
      success: false,
      logs,
      error: error.message
    }, { status: 500 });
  }
}