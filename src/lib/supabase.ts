import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqxbtzvohpnmstwrdrvs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeGJ0enZvaHBubXN0d3JkcnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNjY4NjEsImV4cCI6MjA4NDY0Mjg2MX0.wcN0jClYMrZiV2Zr777nzh1DftP0Wp2lgIaUJBIJCT0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
