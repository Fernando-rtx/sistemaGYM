import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function makeNullResponse() {
  const nil = { data: null, error: { message: 'Supabase no configurado' } };

  function buildChain(isTerminal) {
    const handler = {
      get(target, prop) {
        if (prop === 'then') {
          if (isTerminal) return (resolve) => resolve(nil);
          return undefined;
        }
        if (prop === 'single') return async () => nil;
        if (prop === 'insert') return () => buildChain(true);
        if (prop === 'update') return () => buildChain(false);
        if (prop === 'delete') return () => buildChain(true);
        if (prop === 'select') {
          return (...args) => {
            if (args[1] && args[1].count) {
              return new Proxy({}, { get: () => () => buildChain(true) });
            }
            return buildChain(false);
          };
        }
        if (['order', 'eq', 'gte', 'lte', 'limit', 'match'].includes(prop)) {
          return () => buildChain(false);
        }
        return buildChain(false);
      }
    };
    return new Proxy({}, handler);
  }

  return {
    from: () => buildChain(false),
    auth: {
      signInWithPassword: async () => nil,
      signOut: async () => {}
    }
  };
}

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no definidas. Usando auth local.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

const realClient = createSupabaseClient();
export const supabase = realClient || makeNullResponse();
