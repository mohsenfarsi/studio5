import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddsfemupgawvspyscggd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkc2ZlbXVwZ2F3dnNweXNjZ2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzc0MzUsImV4cCI6MjA2NDY1MzQzNX0.Rznvz9jLm7DOIa5ENp86lrW5NMBeOAfxHQkBV-fW-3Q';

export const supabase = createClient(supabaseUrl, supabaseKey);