import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojrvdwucalicigithxfz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qcnZkd3VjYWxpY2lnaXRoeGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNjgzMDksImV4cCI6MjA1MDk0NDMwOX0.xBpsroSHd-LM-xa4X_NorQjCKuLMbJzMVMJilbUdBLU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);