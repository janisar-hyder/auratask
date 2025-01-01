import { useMemo, useEffect, useState } from "react";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TaskInsightsProps {
  tasks: Task[];
  currentTask?: Task;
}

interface UserStats {
  avg_completion_time: number;
  completion_rate: number;
  total_tasks: number;
  completed_tasks: number;
}

export const TaskInsights = ({ tasks, currentTask }: TaskInsightsProps) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const loadUserStats = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Try to get existing stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      // If no stats exist, create initial stats
      if (!existingStats && !fetchError) {
        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.user.id,
            avg_completion_time: 0,
            completion_rate: 0,
            total_tasks: 0,
            completed_tasks: 0
          })
          .select()
          .single();

        if (!insertError && newStats) {
          setUserStats(newStats);
        }
      } else if (existingStats) {
        setUserStats(existingStats);
      }
    };

    loadUserStats();
  }, [tasks]);

  const insights = useMemo(() => {
    // Calculate priority-specific completion rates
    const priorityStats = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 },
    };

    tasks.forEach(task => {
      priorityStats[task.priority].total++;
      if (task.completed) {
        priorityStats[task.priority].completed++;
      }
    });

    // Predict time for current task based on historical data
    let predictedTime = 0;
    if (currentTask) {
      const similarTasks = tasks.filter(t => 
        t.completed && 
        t.priority === currentTask.priority && 
        t.category === currentTask.category
      );
      predictedTime = similarTasks.length > 0
        ? similarTasks.reduce((acc, task) => acc + (task.actualTime || 0), 0) / similarTasks.length
        : (currentTask.estimatedTime || 0);
    }

    return {
      avgCompletionTime: userStats?.avg_completion_time || 0,
      completionRate: userStats?.completion_rate || 0,
      priorityStats,
      predictedTime,
    };
  }, [tasks, currentTask, userStats]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Average Completion Time</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">
          {insights.avgCompletionTime.toFixed(1)}h
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Completion Rate</h3>
        </div>
        <div className="mt-2 space-y-2">
          {Object.entries(insights.priorityStats).map(([priority, stats]) => (
            <div key={priority} className="flex items-center justify-between">
              <Badge variant="outline">{priority}</Badge>
              <span className="font-medium">
                {stats.total > 0 
                  ? `${((stats.completed / stats.total) * 100).toFixed(0)}%`
                  : '0%'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">AI Prediction</h3>
        </div>
        {currentTask && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              Estimated completion time:
            </p>
            <p className="text-2xl font-bold">
              {insights.predictedTime.toFixed(1)}h
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};