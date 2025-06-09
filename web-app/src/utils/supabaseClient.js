import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qydykruzcngqaskudwsy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5ZHlrcnV6Y25ncWFza3Vkd3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMDA0NjcsImV4cCI6MjA2NDU3NjQ2N30.XsPo7tmgmszRYsWayAFr9IlA4JS8hd9Y9FEght2ktHk';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase