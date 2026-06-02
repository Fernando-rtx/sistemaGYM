import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfpajvbjvdmmpsphjxgg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcGFqdmJqdmRtbXBzcGhqeGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzE5MTMsImV4cCI6MjA5NjAwNzkxM30.l8eHldVncTYYfTkKQ_1LBuzNV2XcBiMFpv19i7tg9Yk';

export const supabase = createClient(supabaseUrl, supabaseKey);
