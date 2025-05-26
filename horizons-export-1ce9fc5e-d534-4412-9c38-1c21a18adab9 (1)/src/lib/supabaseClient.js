import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://jhdfpxazgplkudfcvuzr.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZGZweGF6Z3Bsa3VkZmN2dXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTcyMTAsImV4cCI6MjA2MzM5MzIxMH0.4Yno-gKtiFJTkie8FtAvTlcDyOuBnqgDUvnaOnPE7-s';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);