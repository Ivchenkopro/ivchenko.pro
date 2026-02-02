import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqxbtzvohpnmstwrdrvs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_secret_QmQ2jl1RcXQgU9-EPSXCqQ_f98S2OQL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
