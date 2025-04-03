const { testConnection, initDatabase } = require('./config/db');

const initializeDatabase = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    // Initialize database tables
    const isInitialized = await initDatabase();
    
    if (!isInitialized) {
      console.error('Failed to initialize database tables. Exiting...');
      process.exit(1);
    }
    
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();
