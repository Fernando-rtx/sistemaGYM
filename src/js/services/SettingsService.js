import { supabase } from '../supabaseClient.js';
import { Settings } from '../models/Settings.js';

export class SettingsService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async get() {
        const { data, error } = await supabase.from('ajustes').select('*').limit(1).single();
        if (error || !data) {
            return Settings.defaults();
        }
        return Settings.fromSupabase(data);
    }

    async save(changes) {
        const current = await this.get();
        const settings = new Settings({
            id: current.id,
            brandName: changes.brandName !== undefined ? changes.brandName : current.brandName,
            brandColor: changes.brandColor !== undefined ? changes.brandColor : current.brandColor,
            precios: changes.precios !== undefined ? changes.precios : current.precios
        });

        const updates = settings.toSupabase();
        
        if (current.id) {
            const { error } = await supabase.from('ajustes').update(updates).eq('id', current.id);
            if (error) console.error(error);
        } else {
            const { data, error } = await supabase.from('ajustes').insert([updates]).select().single();
            if (error) console.error(error);
            else settings.id = data.id;
        }

        if (this.eventBus) {
            this.eventBus.emit('settings:changed', settings);
        }
        return settings;
    }

    async resetDefaults() {
        return await this.save(Settings.defaults());
    }

    async init() {
        const { data, error } = await supabase.from('ajustes').select('*').limit(1);
        if (data && data.length === 0) {
            const defaults = Settings.defaults();
            await supabase.from('ajustes').insert([defaults.toSupabase()]);
        }
    }
}
