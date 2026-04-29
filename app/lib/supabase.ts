import { createClient } from '@supabase/supabase-js';


const supabaseUrl = "https://oubqymtsjsrjhknqexwj.supabase.co";

// Paste your actual publishable key right here inside the quotes:
const supabaseAnonKey = "sb_publishable_OccmDFyFU1WwhzWscb5KIA_NpHNx0IX"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);