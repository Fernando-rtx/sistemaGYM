import { supabase } from '../supabaseClient.js';
import { Settings } from '../models/Settings.js';
import { BaseService } from '../core/BaseService.js';

export class SettingsService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
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
            if (error) return this.handleError(error, null);
        } else {
            const { data, error } = await supabase.from('ajustes').insert([updates]).select().single();
            if (error) return this.handleError(error, null);
            settings.id = data.id;
        }

        this.emit('settings:changed', settings);
        return settings;
    }

    async resetDefaults() {
        return await this.save(Settings.defaults());
    }

    async init() {
        const { data, error } = await supabase.from('ajustes').select('*').limit(1);
        if (!error && data && data.length === 0) {
            const defaults = Settings.defaults();
            await supabase.from('ajustes').insert([defaults.toSupabase()]);
        }
    }
}
