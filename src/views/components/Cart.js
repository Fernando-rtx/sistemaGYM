import { escapeHtml } from '../../js/utils/escapeHtml.js';

export class Cart {
    constructor(container, onCartChanged) {
        this.container = container;
        this.onCartChanged = onCartChanged;
        this.items = []; // array of { id, name, price, qty }
    }

    getItems() {
        return this.items;
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({
                id: product.id,
                name: product.nombre,
                price: parseFloat(product.precio),
                qty: 1
            });
        }
        this.render();
        if (this.onCartChanged) this.onCartChanged();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.render();
        if (this.onCartChanged) this.onCartChanged();
    }

    clear() {
        this.items = [];
        this.render();
        if (this.onCartChanged) this.onCartChanged();
    }

    destroy() {
        const carritoItems = document.getElementById('carritoItems');
        if (carritoItems && this._cartClickHandler) {
            carritoItems.removeEventListener('click', this._cartClickHandler);
        }
        this._cartClickHandler = null;
        this.items = [];
        this.container = null;
        this.onCartChanged = null;
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    render() {
        const carritoSection = document.getElementById('carritoSection');
        const carritoItems = document.getElementById('carritoItems');
        const carritoTotal = document.getElementById('carritoTotal');

        if (!carritoSection || !carritoItems || !carritoTotal) return;

        if (this.items.length === 0) {
            carritoSection.style.display = 'block';
            carritoTotal.textContent = '$0.00';
            carritoItems.innerHTML = `
                <div style="text-align: center; padding: 30px 20px; color: var(--color-text-secondary);">
                    <span class="material-icons-round" style="font-size: 36px; margin-bottom: 12px; opacity: 0.4;">shopping_cart</span>
                    <div style="font-size: 14px; font-weight: 500;">Carrito vacío</div>
                    <div style="font-size: 12px; margin-top: 4px; opacity: 0.7;">Agrega productos desde el inventario</div>
                </div>
            `;
            return;
        }

        carritoSection.style.display = 'block';
        carritoTotal.textContent = '$' + this.getTotal().toFixed(2);

        // Remove previous event delegation listener if any
        if (this._cartClickHandler) {
            carritoItems.removeEventListener('click', this._cartClickHandler);
        }

        carritoItems.innerHTML = this.items.map((item, idx) => `
            <div class="carrito-item" style="display: flex; justify-content: space-between; align-items: center; background: var(--color-bg-base); padding: 10px 14px; border-radius: var(--border-radius-sm); font-size: 14px; margin-bottom: 8px;">
                <span>${escapeHtml(item.name)} x${item.qty}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: var(--color-primary); font-weight: 600;">$${(item.price * item.qty).toFixed(2)}</span>
                    <button class="btn-remove-item" data-idx="${idx}" style="background: transparent; border: none; color: var(--color-danger); cursor: pointer; font-size: 20px; line-height: 1; padding: 0 4px;">×</button>
                </div>
            </div>
        `).join('');

        // Event delegation for remove buttons
        this._cartClickHandler = (e) => {
            const btn = e.target.closest('.btn-remove-item');
            if (btn) {
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                this.removeItem(idx);
            }
        };
        carritoItems.addEventListener('click', this._cartClickHandler);
    }
}
