import { supabase } from '@/lib/supabase';
import { Task } from '@/types';

export const taskService = {
  async createTask(task: Omit<Task, 'id'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: user.user.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          deadline: task.deadline,
          estimated_time: task.estimatedTime,
          completed: false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserTasks() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateTask(taskId: string, updates: Partial<Task>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    if (updates.completed) {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', user.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(taskId: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.user.id);

    if (error) throw error;
  },

  async updateUserStats() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.user.id);

    if (tasksError) throw tasksError;

    const completedTasks = tasks?.filter(t => t.completed) || [];
    const avgCompletionTime = completedTasks.length > 0
      ? completedTasks.reduce((acc, task) => acc + (task.actual_time || 0), 0) / completedTasks.length
      : 0;
    const completionRate = tasks?.length ? (completedTasks.length / tasks.length) * 100 : 0;

    const { error: statsError } = await supabase
      .from('user_stats')
      .upsert({
        user_id: user.user.id,
        avg_completion_time: avgCompletionTime,
        completion_rate: completionRate,
        total_tasks: tasks?.length || 0,
        completed_tasks: completedTasks.length
      });

    if (statsError) throw statsError;
  }
};