import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aamwreofmasacvmibrid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbXdyZW9mbWFzYWN2bWlicmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODg3NTEsImV4cCI6MjA3NzY2NDc1MX0.52VecbJkBmrh_u0APozwMxjqUmFX9T-XZV_lGXQlTJA';

export const supabase = createClient(supabaseUrl, supabaseKey);
