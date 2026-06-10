import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const MISSING_ERR = { data: null, error: { message: 'Supabase no configurado' } };

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no definidas. Usando auth local.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

const realClient = createSupabaseClient();

export const supabase = new Proxy({}, {
  get(target, prop) {
    if (!realClient) {
      if (prop === 'from') {
        return () => ({
          select: () => ({ eq: () => ({ single: async () => MISSING_ERR, gte: () => ({ lte: () => ({ order: async () => MISSING_ERR }) }), order: async () => MISSING_ERR }),
          insert: async () => MISSING_ERR,
          update: () => ({ eq: () => ({ select: () => ({ single: async () => MISSING_ERR }) }) }),
          delete: () => ({ eq: async () => MISSING_ERR }),
          limit: () => ({ single: async () => MISSING_ERR }),
          order: () => ({ eq: () => ({ single: async () => MISSING_ERR }) })
        });
      }
      if (prop === 'auth') {
        return {
          signInWithPassword: async () => MISSING_ERR,
          signOut: async () => {}
        };
      }
      return undefined;
    }
    return realClient[prop];
  }
});
