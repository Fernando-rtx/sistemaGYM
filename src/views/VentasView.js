import { BaseView } from '../js/core/BaseView.js';
import { Cart } from './components/Cart.js';
import { ProductGrid } from './components/ProductGrid.js';
import { escapeHtml } from '../js/utils/escapeHtml.js';

export class VentasView extends BaseView {
    constructor(container, services, eventBus) {
        super(container, services, eventBus);
        this.cart = null;
        this.productGrid = null;
    }

    render() {
        return `
            <div class="ventas-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 class="view-title" style="margin: 0; font-size: 24px; font-weight: 700;">Ventas y Caja</h2>
                <button class="btn btn-outline" id="btnAdminProductos">
                    <span class="material-icons-round" aria-hidden="true">inventory_2</span> Administrar Productos
                </button>
            </div>

            <div class="ventas-grid">
                <div class="pos-panel">
                    <div class="card">
                        <h3 style="margin-bottom: 20px; color: var(--color-text-secondary);">PUNTO DE VENTA RÁPIDO</h3>
                        <div class="products-grid" id="productsGrid">
                            <!-- Generado dinámicamente -->
                        </div>

                        <!-- Carrito -->
                        <div id="carritoSection" style="margin-top: 24px; display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h4 style="color: var(--color-text-secondary); font-size: 13px; letter-spacing: 1px;">CARRITO</h4>
                                <button class="btn-icon" id="btnLimpiarCarrito" title="Limpiar carrito" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-secondary); cursor: pointer; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons-round" aria-hidden="true" style="font-size: 16px;">delete_sweep</span>
                                </button>
                            </div>
                            <div id="carritoItems" style="display: flex; flex-direction: column; gap: 8px;"></div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <span style="font-size: 16px; font-weight: 700;">TOTAL:</span>
                                <span id="carritoTotal" style="font-size: 22px; font-weight: 800; color: var(--color-primary);">$0.00</span>
                            </div>
                            <button class="btn btn-primary" id="btnCobrar" style="width: 100%; margin-top: 12px; justify-content: center; padding: 14px;">
                                <span class="material-icons-round" aria-hidden="true">paid</span> COBRAR
                            </button>
                        </div>
                    </div>

                    <div class="card mt-4 table-responsive">
                        <h3 style="margin-bottom: 20px; color: var(--color-text-secondary);">DETALLE DE TRANSACCIONES</h3>
                        <table class="trans-table">
                            <thead>
                                <tr>
                                    <th>HORA</th>
                                    <th>CONCEPTO</th>
                                    <th>MONTO</th>
                                </tr>
                            </thead>
                            <tbody id="transTbody">
                            </tbody>
                        </table>
                        <div id="transEmpty" style="padding: 20px; text-align: center; color: var(--color-text-secondary); display: none;">Sin transacciones hoy.</div>
                    </div>
                </div>

                <div class="caja-panel">
                    <div class="card caja-summary">
                        <h3>CIERRE DE CAJA</h3>
                        <div class="caja-total" id="cajaTotal">$0.00</div>
                        <p style="color: var(--color-text-secondary); margin-bottom: 30px;">Efectivo en Caja</p>
                        
                        <div class="caja-stats">
                            <div class="caja-stat-row">
                                <span>Ingresos:</span>
                                <span class="text-success" id="cajaIngresos">$0.00</span>
                            </div>
                            <div class="caja-stat-row">
                                <span>Salidas:</span>
                                <span class="text-danger" id="cajaSalidas">-$0.00</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 30px;">
                            <button class="btn btn-outline" style="flex: 1;" id="btnEntradaCaja">ENTRADA</button>
                            <button class="btn btn-outline" style="flex: 1;" id="btnSalidaCaja">SALIDA</button>
                        </div>
                        <button class="btn btn-primary" style="width: 100%; margin-top: 10px; justify-content: center;" id="btnCerrarCaja">CERRAR CAJA</button>
                    </div>
                </div>
            </div>

            <style>
                .mt-4 { margin-top: 24px; }
                .ventas-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                }
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                }
                .product-item {
                    background-color: var(--color-bg-base);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: var(--border-radius-md);
                    padding: 15px 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    position: relative;
                }
                .product-item:hover {
                    border-color: var(--color-primary);
                    transform: translateY(-2px);
                    background-color: color-mix(in srgb, var(--color-primary) 5%, transparent);
                }
                .product-item.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                    filter: grayscale(100%);
                }
                .prod-name { font-size: 12px; font-weight: 500; line-height: 1.2; height: 28px; display: flex; align-items: center; }
                .prod-price { font-size: 16px; font-weight: 700; color: var(--color-primary); }
                .prod-stock { position: absolute; top: 5px; right: 5px; font-size: 10px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px; }

                .trans-table { width: 100%; border-collapse: collapse; }
                .trans-table th {
                    text-align: left; padding: 12px; font-size: 12px;
                    color: var(--color-text-secondary); border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .trans-table td {
                    padding: 16px 12px; font-size: 14px;
                    border-bottom: 1px solid rgba(255,255,255,0.02);
                }
                .text-success { color: var(--color-success); font-weight: 600;}
                .text-danger { color: var(--color-danger); font-weight: 600;}

                .caja-summary { text-align: center; }
                .caja-total { font-size: 48px; font-weight: 800; color: var(--color-primary); margin: 20px 0 5px; }
                .caja-stats { background-color: var(--color-bg-base); padding: 20px; border-radius: var(--border-radius-sm); display: flex; flex-direction: column; gap: 12px; }
                .caja-stat-row { display: flex; justify-content: space-between; font-size: 15px; font-weight: 500; }
                .carrito-item { display: flex; justify-content: space-between; align-items: center; background: var(--color-bg-base); padding: 10px 14px; border-radius: var(--border-radius-sm); font-size: 14px; }
                
                @media (max-width: 768px) {
                    .ventas-grid { grid-template-columns: 1fr; }
                    .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
                    .ventas-header { flex-direction: column; align-items: stretch !important; gap: 15px; }
                }
            </style>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();

        const gridContainer = this.$('#productsGrid');
        const cartContainer = this.$('#carritoSection');

        // Hide admin button for non-admins
        const user = this.services.auth.getCurrentUser();
        const btnAdmin = this.$('#btnAdminProductos');
        if (!user || user.role === 'Empleado') {
            if (btnAdmin) btnAdmin.style.display = 'none';
        }

        // 1. Instanciar Cart
        this.cart = new Cart(cartContainer, () => {
            this.productGrid.render(this.cart.getItems());
        });

        // 2. Instanciar ProductGrid
        this.productGrid = new ProductGrid(gridContainer, this.services, (product) => {
            this.cart.addItem(product);
        });

        // Wire events
        this.bindEvent(this.$('#btnLimpiarCarrito'), 'click', () => {
            this.services.modal.confirm(
                'LIMPIAR CARRITO',
                '¿Estás seguro de limpiar el carrito? Todos los productos serán removidos.',
                () => {
                    this.cart.clear();
                }
            );
        });

        this.bindEvent(this.$('#btnCobrar'), 'click', () => {
            this.openCobrarModal();
        });

        this.bindEvent(this.$('#btnEntradaCaja'), 'click', () => {
            this.openMovimientoModal('ENTRADA');
        });

        this.bindEvent(this.$('#btnSalidaCaja'), 'click', () => {
            this.openMovimientoModal('SALIDA');
        });

        this.bindEvent(this.$('#btnCerrarCaja'), 'click', () => {
            this.openCerrarCajaModal();
        });

        if (btnAdmin) {
            this.bindEvent(btnAdmin, 'click', () => {
                this.openAdminInventarioModal();
            });
        }

        // Load initial data
        await this.productGrid.refresh(this.cart.getItems());
        await this.refreshCajaAndTransactions();
    }

    async refreshCajaAndTransactions() {
        const [caja, trans] = await Promise.all([
            this.services.transaccion.getResumenCaja(),
            this.services.transaccion.getHoy()
        ]);

        const totalEl = this.$('#cajaTotal');
        const ingresosEl = this.$('#cajaIngresos');
        const salidasEl = this.$('#cajaSalidas');

        if (totalEl) totalEl.textContent = '$' + caja.total.toFixed(2);
        if (ingresosEl) ingresosEl.textContent = '$' + caja.ingresos.toFixed(2);
        if (salidasEl) salidasEl.textContent = '-$' + caja.salidas.toFixed(2);

        const tbody = this.$('#transTbody');
        const empty = this.$('#transEmpty');

        if (!tbody) return;

        if (trans.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        tbody.innerHTML = trans.map(t => `
            <tr>
                <td>${escapeHtml(t.hora)}</td>
                <td>${escapeHtml(t.concepto)}</td>
                <td class="${t.tipo === 'ingreso' ? 'text-success' : 'text-danger'}">${t.tipo === 'ingreso' ? '+' : '-'}$${parseFloat(t.monto).toFixed(2)}</td>
            </tr>
        `).join('');
    }

    openCobrarModal() {
        const items = this.cart.getItems();
        if (items.length === 0) return;
        const total = this.cart.getTotal();

        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">COBRAR VENTA</h3>
                <button class="btn-close" id="btnCloseCobrarModal"><span class="material-icons-round" aria-hidden="true">close</span></button>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 14px; color: var(--color-text-secondary);">Total a cobrar:</div>
                <div style="font-size: 48px; font-weight: 800; color: var(--color-primary);">$${total.toFixed(2)}</div>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 30px;">
                <div class="payment-method selected" data-method="Efectivo" style="flex: 1; border: 2px solid var(--color-primary); background: color-mix(in srgb, var(--color-primary) 5%, transparent); padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;">
                    <span class="material-icons-round" aria-hidden="true" style="font-size: 32px; color: var(--color-primary);">payments</span>
                    <div style="margin-top: 5px; font-weight: 600; color: var(--color-primary);">EFECTIVO</div>
                </div>
                <div class="payment-method" data-method="Tarjeta" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: center; cursor: pointer; opacity: 0.5;">
                    <span class="material-icons-round" aria-hidden="true" style="font-size: 32px; color: var(--color-text-secondary);">credit_card</span>
                    <div style="margin-top: 5px; font-weight: 600; color: var(--color-text-secondary);">TARJETA</div>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" id="btnCancelCobro">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmarCobro" style="flex: 1; justify-content: center;">CONFIRMAR PAGO</button>
            </div>
        `;

        this.services.modal.open(modalHtml);

        let metodo = 'Efectivo';
        const methods = document.querySelectorAll('.payment-method');
        methods.forEach(m => m.addEventListener('click', function() {
            methods.forEach(x => {
                x.classList.remove('selected');
                x.style.border = '1px solid rgba(255,255,255,0.1)';
                x.style.background = 'transparent';
                x.style.opacity = '0.5';
                x.querySelector('span').style.color = 'var(--color-text-secondary)';
                x.querySelector('div').style.color = 'var(--color-text-secondary)';
            });
            this.classList.add('selected');
            this.style.border = '2px solid var(--color-primary)';
            this.style.background = 'color-mix(in srgb, var(--color-primary) 5%, transparent)';
            this.style.opacity = '1';
            this.querySelector('span').style.color = 'var(--color-primary)';
            this.querySelector('div').style.color = 'var(--color-primary)';
            metodo = this.getAttribute('data-method');
        }));

        const btnClose = document.getElementById('btnCloseCobrarModal');
        const btnCancel = document.getElementById('btnCancelCobro');
        const btnConfirm = document.getElementById('btnConfirmarCobro');

        const cleanup = () => this.services.modal.close();

        if (btnClose) btnClose.addEventListener('click', cleanup);
        if (btnCancel) btnCancel.addEventListener('click', cleanup);

        if (btnConfirm) {
            btnConfirm.addEventListener('click', async () => {
                const itemsStr = items.map(i => `${escapeHtml(i.name)} x${i.qty}`).join(', ');
                btnConfirm.disabled = true;

                try {
                    // 1. First create transaction
                    const transaccion = await this.services.transaccion.crear({
                        tipo: 'ingreso',
                        concepto: `Venta (${metodo}): ${itemsStr}`,
                        monto: total
                    });

                    // 2. Then deduct stock
                    const inv = await this.services.inventario.getAll();
                    const stockErrors = [];
                    for (const item of items) {
                        const prod = inv.find(p => p.id === item.id);
                        if (prod) {
                            const newStock = prod.stock - item.qty;
                            if (newStock < 0) {
                                stockErrors.push(`Stock insuficiente para ${escapeHtml(item.name)}`);
                                continue;
                            }
                            await this.services.inventario.update(prod.id, { stock: newStock });
                        }
                    }

                    if (stockErrors.length > 0) {
                        console.warn('Stock errors during sale:', stockErrors.join(', '));
                    }

                    this.services.toast.success('Venta cobrada con éxito');
                    this.cart.clear();
                    this._showComprobanteModal(items, total, metodo);
                    cleanup();
                    await this.productGrid.refresh([]);
                    await this.refreshCajaAndTransactions();
                } catch (e) {
                    console.error('Error processing payment:', e);
                    this.services.toast.danger('Error al procesar el cobro');
                    btnConfirm.disabled = false;
                }
            });
        }
    }

    openMovimientoModal(tipo) {
        const isEntrada = tipo === 'ENTRADA';
        const color = isEntrada ? 'var(--color-success)' : 'var(--color-danger)';
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">REGISTRAR ${tipo} DE EFECTIVO</h3>
                <button class="btn-close" id="btnCloseMovModal"><span class="material-icons-round" aria-hidden="true">close</span></button>
            </div>
            <div style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Concepto / Motivo</label>
                <input type="text" id="movConcepto" placeholder="Ej. Pago a proveedor" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Monto</label>
                <input type="number" id="movMonto" placeholder="0.00" min="0.01" step="0.01" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: ${color}; padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 24px; font-weight: 800; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" id="btnCancelMov">CANCELAR</button>
                <button class="btn btn-primary" id="btnRegistrarMov" style="flex: 1; justify-content: center;">REGISTRAR ${tipo}</button>
            </div>
        `;
        
        this.services.modal.open(modalHtml);

        const btnClose = document.getElementById('btnCloseMovModal');
        const btnCancel = document.getElementById('btnCancelMov');
        const btnConfirm = document.getElementById('btnRegistrarMov');

        const cleanup = () => this.services.modal.close();

        if (btnClose) btnClose.addEventListener('click', cleanup);
        if (btnCancel) btnCancel.addEventListener('click', cleanup);

        if (btnConfirm) {
            btnConfirm.addEventListener('click', async () => {
                const concepto = document.getElementById('movConcepto').value.trim() || `${tipo} de efectivo`;
                const monto = parseFloat(document.getElementById('movMonto').value);

                if (!monto || monto <= 0) {
                    this.services.toast.danger('Ingresa un monto válido');
                    return;
                }

                await this.services.transaccion.crear({
                    tipo: isEntrada ? 'ingreso' : 'salida',
                    concepto,
                    monto
                });

                this.services.toast.success(`${tipo} registrada: $${monto.toFixed(2)}`);
                cleanup();
                await this.refreshCajaAndTransactions();
            });
        }
    }

    async openCerrarCajaModal() {
        const caja = await this.services.transaccion.getResumenCaja();
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">CERRAR CAJA</h3>
                <button class="btn-close" id="btnCloseCierreModal"><span class="material-icons-round" aria-hidden="true">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 48px; font-weight: 800; color: var(--color-primary); margin-bottom: 10px;">$${caja.total.toFixed(2)}</div>
                <p style="color: var(--color-text-secondary); margin-bottom: 20px;">${caja.numTransacciones} transacciones hoy</p>
                <div style="background: var(--color-bg-base); padding: 15px; border-radius: var(--border-radius-sm); display: flex; justify-content: space-around;">
                    <div><div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 5px;">Ingresos</div><div style="color: var(--color-success); font-weight: 700;">$${caja.ingresos.toFixed(2)}</div></div>
                    <div><div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 5px;">Salidas</div><div style="color: var(--color-danger); font-weight: 700;">$${caja.salidas.toFixed(2)}</div></div>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" id="btnCancelCierre">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmarCierre" style="flex: 1; justify-content: center;">CONFIRMAR CIERRE</button>
            </div>
        `;
        
        this.services.modal.open(modalHtml);

        const btnClose = document.getElementById('btnCloseCierreModal');
        const btnCancel = document.getElementById('btnCancelCierre');
        const btnConfirm = document.getElementById('btnConfirmarCierre');

        const cleanup = () => this.services.modal.close();

        if (btnClose) btnClose.addEventListener('click', cleanup);
        if (btnCancel) btnCancel.addEventListener('click', cleanup);

        if (btnConfirm) {
            btnConfirm.addEventListener('click', async () => {
                // Registrar corte de caja
                await this.services.corteCaja.guardarCorte(caja);

                this.services.toast.success('Caja cerrada exitosamente. Corte Z generado.');
                cleanup();
                await this.refreshCajaAndTransactions();
            });
        }
    }

    _showComprobanteModal(items, total, metodo) {
        const confirmHtml = `
            <div class="modal-header">
                <h3 class="modal-title">¿GENERAR COMPROBANTE?</h3>
                <button class="btn-close" id="btnCloseComprobanteModal"><span class="material-icons-round">close</span></button>
            </div>
            <div style="padding: 10px; text-align: center;">
                <p style="margin-bottom: 24px; color: var(--color-text-secondary); line-height: 1.5;">
                    La venta de <b>$${total.toFixed(2)}</b> ha sido registrada con éxito.<br>
                    ¿Deseas generar el comprobante de pago?
                </p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="btn btn-outline" id="btnNoComprobante" style="flex: 1; padding: 12px;">NO, CERRAR</button>
                    <button class="btn btn-primary" id="btnSiComprobante" style="flex: 1; padding: 12px;">SÍ, GENERAR</button>
                </div>
            </div>
        `;
        this.services.modal.open(confirmHtml);

        const closeModal = () => this.services.modal.close();
        document.getElementById('btnCloseComprobanteModal')?.addEventListener('click', closeModal);
        document.getElementById('btnNoComprobante')?.addEventListener('click', closeModal);
        document.getElementById('btnSiComprobante')?.addEventListener('click', async () => {
            closeModal();
            const settings = await this.services.settings.get();
            const gymName = settings.brandName || 'NEXFIT';
            const now = new Date();
            const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            const safeGymName = escapeHtml(gymName);
            const itemsRows = items.map(i => `
                <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 13px;">${escapeHtml(i.name)}</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 13px; text-align: center;">${escapeHtml(String(i.qty))}</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right;">$${(i.price * i.qty).toFixed(2)}</td>
                </tr>
            `).join('');

            const printWin = window.open('', '_blank', 'width=380,height=600');
            printWin.document.write(`
                <html>
                <head><title>Comprobante - ${safeGymName}</title>
                <style>
                    body { font-family: 'Courier New', monospace; font-size: 13px; color: #000; margin: 0; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .header h2 { margin: 0; font-size: 18px; letter-spacing: 2px; }
                    .header p { margin: 4px 0; color: #555; font-size: 11px; }
                    .divider { border-top: 1px dashed #999; margin: 12px 0; }
                    table { width: 100%; border-collapse: collapse; }
                    th { padding: 6px 8px; border-bottom: 2px solid #000; font-size: 11px; text-align: left; }
                    .total-row td { padding: 8px; font-weight: bold; border-top: 2px solid #000; font-size: 14px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #888; }
                </style>
                </head>
                <body>
                    <div class="header">
                        <h2>${safeGymName.toUpperCase()}</h2>
                        <p>COMPROBANTE DE PAGO</p>
                        <p>${escapeHtml(dateStr)} — ${escapeHtml(timeStr)}</p>
                        <p>Método: ${escapeHtml(metodo.toUpperCase())}</p>
                    </div>
                    <div class="divider"></div>
                    <table>
                        <thead>
                            <tr><th>PRODUCTO</th><th style="text-align:center;">CTD</th><th style="text-align:right;">IMPORTE</th></tr>
                        </thead>
                        <tbody>
                            ${itemsRows}
                        </tbody>
                    </table>
                    <div class="divider"></div>
                    <div style="text-align: right; font-size: 14px; font-weight: bold;">TOTAL: $${total.toFixed(2)}</div>
                    <div class="footer">
                        ¡Gracias por tu compra!<br>
                        Este comprobante es para control interno.
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(function() { window.print(); window.close(); }, 400);
                        };
                    <\/script>
                </body>
                </html>
            `);
            printWin.document.close();
        });
    }

    async openAdminInventarioModal() {
        const inventario = await this.services.inventario.getAll();

        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">ADMINISTRAR PRODUCTOS</h3>
                <button class="btn-close" id="btnCloseAdminModal"><span class="material-icons-round" aria-hidden="true">close</span></button>
            </div>

            <div style="margin-bottom: 12px; position: relative;">
                <span class="material-icons-round" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-secondary); font-size: 20px;">search</span>
                <input type="text" id="adminSearchInput" placeholder="Buscar producto..." style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 10px 10px 10px 40px; border-radius: var(--border-radius-md); font-size: 14px; width: 100%; box-sizing: border-box; outline: none;">
            </div>

            <div id="adminProductList" style="max-height: 260px; overflow-y: auto; margin-bottom: 20px; padding-right: 5px;"></div>

            <div style="background: var(--color-bg-base); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <h4 style="font-size: 13px; color: var(--color-primary); margin-bottom: 15px;">NUEVO PRODUCTO</h4>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" id="newProdName" placeholder="Nombre" style="flex: 2; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px; border-radius: 4px;">
                    <input type="number" id="newProdPrice" placeholder="Precio" step="0.01" style="flex: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px; border-radius: 4px;">
                    <input type="number" id="newProdStock" placeholder="Stock" style="flex: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px; border-radius: 4px;">
                </div>
                <button class="btn btn-primary" id="btnAddProd" style="width: 100%; justify-content: center; padding: 8px;">AÑADIR PRODUCTO</button>
            </div>
        `;

        this.services.modal.open(modalHtml);

        const btnClose = document.getElementById('btnCloseAdminModal');
        const btnAdd = document.getElementById('btnAddProd');
        const cleanup = () => this.services.modal.close();

        if (btnClose) btnClose.addEventListener('click', cleanup);

        const renderProductList = (filter) => {
            const listContainer = document.getElementById('adminProductList');
            if (!listContainer) return;

            const filtered = filter
                ? inventario.filter(p => (p.nombre || '').toLowerCase().includes(filter.toLowerCase()))
                : inventario;

            if (filtered.length === 0) {
                listContainer.innerHTML = '<div style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No se encontraron productos</div>';
                return;
            }

            listContainer.innerHTML = filtered.map(p => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="material-icons-round" aria-hidden="true" style="color:${escapeHtml(p.color)};">${escapeHtml(p.icono)}</span>
                        <div>
                            <div style="font-size: 14px; font-weight: 600;">${escapeHtml(p.nombre)}</div>
                            <div style="font-size: 12px; color: var(--color-text-secondary);">Stock: ${escapeHtml(String(p.stock))} | Precio: $${parseFloat(p.precio).toFixed(2)}</div>
                        </div>
                    </div>
                    <button class="btn-icon danger btn-delete-prod" data-id="${escapeHtml(p.id)}" style="width: 28px; height: 28px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: var(--color-danger); cursor: pointer;">
                        <span class="material-icons-round" aria-hidden="true" style="font-size: 16px;">delete</span>
                    </button>
                </div>
            `).join('');

            listContainer.querySelectorAll('.btn-delete-prod').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.services.modal.confirm(
                        'ELIMINAR PRODUCTO',
                        '¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.',
                        async () => {
                            await this.services.inventario.delete(id);
                            cleanup();
                            await this.openAdminInventarioModal();
                            await this.productGrid.refresh(this.cart.getItems());
                        },
                        'CANCELAR',
                        'ELIMINAR',
                        true
                    );
                });
            });
        };

        renderProductList('');

        const searchInput = document.getElementById('adminSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderProductList(e.target.value);
            });
        }

        if (btnAdd) {
            btnAdd.addEventListener('click', async () => {
                const nombre = document.getElementById('newProdName').value.trim();
                const precio = parseFloat(document.getElementById('newProdPrice').value);
                const stock = parseInt(document.getElementById('newProdStock').value);

                if (!nombre || isNaN(precio) || isNaN(stock)) {
                    this.services.toast.danger('Completa todos los campos correctamente');
                    return;
                }

                const colorList = ['#94ff00', '#00e5ff', '#ff007f', '#ffaa00', '#a000ff'];
                const iconList = ['local_drink', 'sports_gymnastics', 'bolt', 'cookie', 'shopping_basket'];
                const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
                const randomIcon = iconList[Math.floor(Math.random() * iconList.length)];

                await this.services.inventario.create({
                    nombre,
                    precio,
                    stock,
                    color: randomColor,
                    icono: randomIcon
                });

                cleanup();
                await this.openAdminInventarioModal();
                await this.productGrid.refresh(this.cart.getItems());
                this.services.toast.success('Producto añadido');
            });
        }
    }
}
