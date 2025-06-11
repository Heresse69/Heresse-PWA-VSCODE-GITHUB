import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://iqgriclhqqzlnxagustv.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZ3JpY2xocXF6bG54YWd1c3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzQ2ODgsImV4cCI6MjA2NTE1MDY4OH0.5IULU5E8TM4AmTvaRmTtnCsYUOsc0525tACrM3z66zQ';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);