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

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    render() {
        const carritoSection = document.getElementById('carritoSection');
        const carritoItems = document.getElementById('carritoItems');
        const carritoTotal = document.getElementById('carritoTotal');

        if (!carritoSection || !carritoItems || !carritoTotal) return;

        if (this.items.length === 0) {
            carritoSection.style.display = 'none';
            return;
        }

        carritoSection.style.display = 'block';
        carritoTotal.textContent = '$' + this.getTotal().toFixed(2);

        carritoItems.innerHTML = this.items.map((item, idx) => `
            <div class="carrito-item" style="display: flex; justify-content: space-between; align-items: center; background: var(--color-bg-base); padding: 10px 14px; border-radius: var(--border-radius-sm); font-size: 14px; margin-bottom: 8px;">
                <span>${item.name} x${item.qty}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: var(--color-primary); font-weight: 600;">$${(item.price * item.qty).toFixed(2)}</span>
                    <button class="btn-remove-item" data-idx="${idx}" style="background: transparent; border: none; color: var(--color-danger); cursor: pointer; font-size: 20px; line-height: 1; padding: 0 4px;">×</button>
                </div>
            </div>
        `).join('');

        carritoItems.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                this.removeItem(idx);
            });
        });
    }
}
