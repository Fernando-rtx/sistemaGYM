export class ProductGrid {
    constructor(container, services, onProductSelected) {
        this.container = container;
        this.services = services;
        this.onProductSelected = onProductSelected;
        this.products = [];
    }

    async refresh(cartItems = []) {
        this.products = await this.services.inventario.getAll();
        this.render(cartItems);
    }

    render(cartItems = []) {
        if (!this.container) return;

        if (this.products.length === 0) {
            this.container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <span class="material-icons-round" style="font-size: 48px; margin-bottom: 12px; color: rgba(255,255,255,0.1);">inventory_2</span>
                    <div>No hay productos registrados en el inventario.</div>
                </div>
            `;
            return;
        }

        this.container.innerHTML = this.products.map(p => {
            const inCart = cartItems.find(c => c.id === p.id);
            const qtyCart = inCart ? inCart.qty : 0;
            const stockRestante = p.stock - qtyCart;
            const disabled = stockRestante <= 0 ? 'disabled' : '';

            return `
                <div class="product-item ${disabled}" data-id="${p.id}" style="position: relative;">
                    <div class="prod-stock">${p.stock}</div>
                    <span class="material-icons-round" style="font-size: 32px; color: ${p.color};">${p.icono}</span>
                    <div class="prod-name">${p.nombre}</div>
                    <div class="prod-price">$${parseFloat(p.precio).toFixed(2)}</div>
                </div>
            `;
        }).join('');

        this.container.querySelectorAll('.product-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('disabled')) return;
                const id = item.getAttribute('data-id');
                const product = this.products.find(p => p.id === id);
                
                item.style.transform = 'scale(0.95)';
                setTimeout(() => { item.style.transform = ''; }, 150);

                if (this.onProductSelected && product) {
                    this.onProductSelected(product);
                }
            });
        });
    }
}
