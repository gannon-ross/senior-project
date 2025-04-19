import { pool } from './config/db.js';
import User from './models/User.js';

const run = async () => {
  try {
    const { user } = await User.create({
      email: 'admin@test.com',
      password: 'wwwwwwww',
      first_name: 'Admin',
      last_name: 'User',
      role: 'agent'
    });

    console.log('✅ Agent created:', user);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create agent:', err);
    process.exit(1);
  }
};

run();
