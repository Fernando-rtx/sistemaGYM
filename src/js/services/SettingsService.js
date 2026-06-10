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

        const { data, error } = await supabase.from('ajustes').upsert(
            { ...updates, id: current.id || 1 },
            { onConflict: 'id' }
        ).select().single();

        if (error) return this.handleError(error, null);

        this.emit('settings:changed', settings);
        return settings;
    }

    async resetDefaults() {
        return await this.save(Settings.defaults());
    }

    async init() {
        const defaults = Settings.defaults();
        const { error } = await supabase.from('ajustes').upsert(
            { id: 1, ...defaults.toSupabase() },
            { onConflict: 'id' }
        );
        if (error) console.error('Settings init upsert error:', error);
    }
}
