import { supabase } from './supabase';

export const setupDatabase = async () => {
  // Create tasks table
  const { error: tasksError } = await supabase.rpc('create_tasks_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id),
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
        category TEXT,
        deadline TIMESTAMP WITH TIME ZONE,
        estimated_time NUMERIC,
        actual_time NUMERIC,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  // Create user_stats table
  const { error: statsError } = await supabase.rpc('create_user_stats_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_stats (
        user_id UUID PRIMARY KEY REFERENCES auth.users(id),
        avg_completion_time NUMERIC DEFAULT 0,
        completion_rate NUMERIC DEFAULT 0,
        total_tasks INTEGER DEFAULT 0,
        completed_tasks INTEGER DEFAULT 0
      );
    `
  });

  if (tasksError || statsError) {
    console.error('Database setup error:', tasksError || statsError);
  }
};