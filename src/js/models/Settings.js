export class Settings {
    constructor({ id, brandName, brandColor, precios }) {
        this.id = id;
        this.brandName = brandName || 'NEXFIT';
        this.brandColor = brandColor || '#94ff00';
        this.precios = precios || { Diario: 3, Mensual: 20, Quincenal: 10 };
    }

    applyToDOM() {
        if (this.brandColor) {
            document.documentElement.style.setProperty('--color-primary', this.brandColor);
        }
        if (this.brandName) {
            const brandEls = document.querySelectorAll('.brand-name');
            brandEls.forEach(el => el.textContent = this.brandName);
        }
    }

    static fromSupabase(row) {
        let precios = row.precios;
        if (typeof precios === 'string') {
            try { precios = JSON.parse(precios); } catch { precios = {}; }
        }
        return new Settings({
            id: row.id,
            brandName: row.brand_name,
            brandColor: row.brand_color,
            precios
        });
    }

    toSupabase() {
        const data = {
            brand_name: this.brandName,
            brand_color: this.brandColor,
            precios: this.precios
        };
        if (this.id) data.id = this.id;
        return data;
    }

    static defaults() {
        return new Settings({
            brandName: 'NEXFIT',
            brandColor: '#94ff00',
            precios: { Diario: 3, Mensual: 20, Quincenal: 10 }
        });
    }
}
