import { supabase } from './supabase';

export const setupDatabase = async () => {
  // Enable UUID extension
  const { error: uuidError } = await supabase
    .from('_sql')
    .select('*')
    .eq('query', 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  if (uuidError) {
    console.error('Error enabling UUID extension:', uuidError);
  }

  // Create tasks table
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id),
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
      category TEXT,
      deadline TIMESTAMPTZ,
      estimated_time NUMERIC,
      actual_time NUMERIC,
      completed_at TIMESTAMPTZ,
      assigned_to UUID,
      collaborators UUID[],
      comments JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );

    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
    DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
    DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
    DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

    CREATE POLICY "Users can view their own tasks"
      ON tasks FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own tasks"
      ON tasks FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own tasks"
      ON tasks FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own tasks"
      ON tasks FOR DELETE
      USING (auth.uid() = user_id);
  `;

  const { error: tasksError } = await supabase
    .from('_sql')
    .select('*')
    .eq('query', createTasksTable);

  // Create user_stats table
  const createUserStatsTable = `
    CREATE TABLE IF NOT EXISTS user_stats (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id),
      avg_completion_time NUMERIC DEFAULT 0,
      completion_rate NUMERIC DEFAULT 0,
      total_tasks INTEGER DEFAULT 0,
      completed_tasks INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT fk_user_stats FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );

    ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;
    DROP POLICY IF EXISTS "Users can update their own stats" ON user_stats;
    DROP POLICY IF EXISTS "Users can insert their own stats" ON user_stats;

    CREATE POLICY "Users can view their own stats"
      ON user_stats FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update their own stats"
      ON user_stats FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own stats"
      ON user_stats FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  `;

  const { error: statsError } = await supabase
    .from('_sql')
    .select('*')
    .eq('query', createUserStatsTable);

  if (tasksError || statsError) {
    console.error('Database setup error:', tasksError || statsError);
    throw new Error('Failed to set up database tables');
  }

  console.log('Database setup completed successfully');
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