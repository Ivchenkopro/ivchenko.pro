import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqxbtzvohpnmstwrdrvs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rJ0RbBtL4_lvQ13vhiXrQw_GTxhZ68d';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
