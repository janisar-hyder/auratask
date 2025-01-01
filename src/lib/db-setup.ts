import { supabase } from './supabase';

export const setupDatabase = async () => {
  try {
    // Check if tables exist and are accessible
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (tasksError) {
      console.error('Error checking tasks table:', tasksError);
      throw tasksError;
    }

    const { data: statsData, error: statsError } = await supabase
      .from('user_stats')
      .select('user_id')
      .limit(1);

    if (statsError) {
      console.error('Error checking user_stats table:', statsError);
      throw statsError;
    }

    console.log('Database tables verified successfully');
  } catch (error) {
    console.error('Database setup error:', error);
    throw new Error('Failed to verify database tables');
  }
};

// Function to initialize the database
export const initializeDatabase = async () => {
  try {
    await setupDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};