import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drvruowhubypiyvhkvgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRydnJ1b3dodWJ5cGl5dmhrdmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzA3ODAsImV4cCI6MjA4NjgwNjc4MH0.pevrdXjzePcL6SBDomNF6XfDdBk9JqORCQv3q-jcZPo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);