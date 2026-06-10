import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://zfpajvbjvdmmpsphjxgg.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcGFqdmJqdmRtbXBzcGhqeGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzE5MTMsImV4cCI6MjA5NjAwNzkxM30.l8eHldVncTYYfTkKQ_1LBuzNV2XcBiMFpv19i7tg9Yk';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
