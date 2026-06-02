import { getTransaccionesHoy, addTransaccion, getResumenCaja, getInventario, addProducto, updateProducto, deleteProducto, getCurrentUser } from '../js/dataStore.js';

export const render = () => {
    return `
        <div class="ventas-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 class="view-title" style="margin: 0; font-size: 24px; font-weight: 700;">Ventas y Caja</h2>
            <button class="btn btn-outline" id="btnAdminProductos">
                <span class="material-icons-round">inventory_2</span> Administrar Productos
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
                                <span class="material-icons-round" style="font-size: 16px;">delete_sweep</span>
                            </button>
                        </div>
                        <div id="carritoItems" style="display: flex; flex-direction: column; gap: 8px;"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 16px; font-weight: 700;">TOTAL:</span>
                            <span id="carritoTotal" style="font-size: 22px; font-weight: 800; color: var(--color-primary);">$0.00</span>
                        </div>
                        <button class="btn btn-primary" id="btnCobrar" style="width: 100%; margin-top: 12px; justify-content: center; padding: 14px;">
                            <span class="material-icons-round">paid</span> COBRAR
                        </button>
                    </div>
                </div>

                <div class="card mt-4">
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
                background-color: rgba(148, 255, 0, 0.05);
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
        </style>
    `;
};

export const init = () => {
    let carrito = [];

    const carritoSection = document.getElementById('carritoSection');
    const carritoItems = document.getElementById('carritoItems');
    const carritoTotal = document.getElementById('carritoTotal');
    const productsGrid = document.getElementById('productsGrid');

    const user = getCurrentUser();
    const btnAdminProductos = document.getElementById('btnAdminProductos');
    if (user && user.role === 'Empleado' && btnAdminProductos) {
        btnAdminProductos.style.display = 'none';
    }

    // ===== Render functions =====
    const renderProductos = () => {
        const inventario = getInventario();
        productsGrid.innerHTML = inventario.map(p => {
            const inCart = carrito.find(c => c.id === p.id);
            const qtyCart = inCart ? inCart.qty : 0;
            const stockRestante = p.stock - qtyCart;
            const disabled = stockRestante <= 0 ? 'disabled' : '';

            return `
                <div class="product-item ${disabled}" data-id="${p.id}">
                    <div class="prod-stock">${p.stock}</div>
                    <span class="material-icons-round" style="font-size: 32px; color: ${p.color};">${p.icono}</span>
                    <div class="prod-name">${p.nombre}</div>
                    <div class="prod-price">$${p.precio.toFixed(2)}</div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.product-item').forEach(item => {
            item.addEventListener('click', () => {
                if(item.classList.contains('disabled')) return;
                const id = item.getAttribute('data-id');
                const prod = inventario.find(p => p.id === id);
                
                item.style.transform = 'scale(0.95)';
                setTimeout(() => { item.style.transform = ''; }, 150);

                const existing = carrito.find(c => c.id === id);
                if (existing) {
                    existing.qty++;
                } else {
                    carrito.push({ id: prod.id, name: prod.nombre, price: prod.precio, qty: 1 });
                }
                renderCarrito();
                renderProductos(); // Para actualizar stock restante
            });
        });
    };

    const renderCaja = () => {
        const caja = getResumenCaja();
        document.getElementById('cajaTotal').textContent = '$' + caja.total.toFixed(2);
        document.getElementById('cajaIngresos').textContent = '$' + caja.ingresos.toFixed(2);
        document.getElementById('cajaSalidas').textContent = '-$' + caja.salidas.toFixed(2);
    };

    const renderTransacciones = () => {
        const trans = getTransaccionesHoy();
        const tbody = document.getElementById('transTbody');
        const empty = document.getElementById('transEmpty');

        if (trans.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';
        tbody.innerHTML = trans.map(t => `
            <tr>
                <td>${t.hora}</td>
                <td>${t.concepto}</td>
                <td class="${t.tipo === 'ingreso' ? 'text-success' : 'text-danger'}">${t.tipo === 'ingreso' ? '+' : '-'}$${t.monto.toFixed(2)}</td>
            </tr>
        `).join('');
    };

    const renderCarrito = () => {
        if (carrito.length === 0) {
            carritoSection.style.display = 'none';
            return;
        }
        carritoSection.style.display = 'block';
        const total = carrito.reduce((s, i) => s + i.price * i.qty, 0);
        carritoTotal.textContent = '$' + total.toFixed(2);
        carritoItems.innerHTML = carrito.map((item, idx) => `
            <div class="carrito-item">
                <span>${item.name} x${item.qty}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: var(--color-primary); font-weight: 600;">$${(item.price * item.qty).toFixed(2)}</span>
                    <button class="btn-remove-item" data-idx="${idx}" style="background: transparent; border: none; color: var(--color-danger); cursor: pointer; font-size: 18px; line-height: 1;">×</button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                carrito.splice(idx, 1);
                renderCarrito();
                renderProductos();
            });
        });
    };

    // Clear cart
    document.getElementById('btnLimpiarCarrito').addEventListener('click', () => {
        carrito = [];
        renderCarrito();
        renderProductos();
    });

    // Cobrar Modal
    document.getElementById('btnCobrar').addEventListener('click', () => {
        if (carrito.length === 0) return;
        const total = carrito.reduce((s, i) => s + i.price * i.qty, 0);
        
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">COBRAR VENTA</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 14px; color: var(--color-text-secondary);">Total a cobrar:</div>
                <div style="font-size: 48px; font-weight: 800; color: var(--color-primary);">$${total.toFixed(2)}</div>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 30px;">
                <div class="payment-method selected" data-method="Efectivo" style="flex: 1; border: 2px solid var(--color-primary); background: rgba(148,255,0,0.05); padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;">
                    <span class="material-icons-round" style="font-size: 32px; color: var(--color-primary);">payments</span>
                    <div style="margin-top: 5px; font-weight: 600; color: var(--color-primary);">EFECTIVO</div>
                </div>
                <div class="payment-method" data-method="Tarjeta" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: center; cursor: pointer; opacity: 0.5;">
                    <span class="material-icons-round" style="font-size: 32px; color: var(--color-text-secondary);">credit_card</span>
                    <div style="margin-top: 5px; font-weight: 600; color: var(--color-text-secondary);">TARJETA</div>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmarCobro" style="flex: 1; justify-content: center;">CONFIRMAR PAGO</button>
            </div>
        `;
        window.openModal(modalHtml);

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
            this.style.background = 'rgba(148,255,0,0.05)';
            this.style.opacity = '1';
            this.querySelector('span').style.color = 'var(--color-primary)';
            this.querySelector('div').style.color = 'var(--color-primary)';
            metodo = this.getAttribute('data-method');
        }));

        document.getElementById('btnConfirmarCobro').addEventListener('click', () => {
            const itemsStr = carrito.map(i => `${i.name} x${i.qty}`).join(', ');
            
            // Restar stock
            const inv = getInventario();
            carrito.forEach(item => {
                const prod = inv.find(p => p.id === item.id);
                if (prod) {
                    updateProducto(prod.id, { stock: prod.stock - item.qty });
                }
            });

            addTransaccion({ tipo: 'ingreso', concepto: `Venta (${metodo}): ${itemsStr}`, monto: total });
            window.showToast(`Venta cobrada con éxito`, 'success');
            carrito = [];
            window.closeModal();
            renderCarrito();
            renderTransacciones();
            renderCaja();
            renderProductos(); // Actualizar el UI de stock
        });
    });

    // Entrada / Salida
    const openMovimientoModal = (tipo) => {
        const isEntrada = tipo === 'ENTRADA';
        const color = isEntrada ? 'var(--color-success)' : 'var(--color-danger)';
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">REGISTRAR ${tipo} DE EFECTIVO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
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
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnRegistrarMov" style="flex: 1; justify-content: center;">REGISTRAR ${tipo}</button>
            </div>
        `;
        window.openModal(modalHtml);

        document.getElementById('btnRegistrarMov').addEventListener('click', () => {
            const concepto = document.getElementById('movConcepto').value.trim() || `${tipo} de efectivo`;
            const monto = parseFloat(document.getElementById('movMonto').value);
            if (!monto || monto <= 0) { window.showToast('Ingresa un monto válido', 'danger'); return; }

            addTransaccion({
                tipo: isEntrada ? 'ingreso' : 'salida',
                concepto,
                monto,
            });
            window.closeModal();
            window.showToast(`${tipo} registrada: $${monto.toFixed(2)}`, 'success');
            renderTransacciones();
            renderCaja();
        });
    };

    document.getElementById('btnEntradaCaja').addEventListener('click', () => openMovimientoModal('ENTRADA'));
    document.getElementById('btnSalidaCaja').addEventListener('click', () => openMovimientoModal('SALIDA'));

    // Cerrar caja
    document.getElementById('btnCerrarCaja').addEventListener('click', () => {
        const caja = getResumenCaja();
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">CERRAR CAJA</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
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
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmarCierre" style="flex: 1; justify-content: center;">CONFIRMAR CIERRE</button>
            </div>
        `;
        window.openModal(modalHtml);
        document.getElementById('btnConfirmarCierre').addEventListener('click', () => {
            window.closeModal();
            window.showToast('Caja cerrada exitosamente. Corte Z generado.', 'success');
        });
    });

    // ==================== INVENTARIO CRUD ====================
    document.getElementById('btnAdminProductos').addEventListener('click', () => {
        openAdminInventarioModal();
    });

    const openAdminInventarioModal = () => {
        const inventario = getInventario();
        let listHtml = inventario.map(p => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="material-icons-round" style="color:${p.color};">${p.icono}</span>
                    <div>
                        <div style="font-size: 14px; font-weight: 600;">${p.nombre}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">Stock: ${p.stock} | Precio: $${p.precio.toFixed(2)}</div>
                    </div>
                </div>
                <button class="btn-icon danger btn-delete-prod" data-id="${p.id}" style="width: 28px; height: 28px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: var(--color-danger); cursor: pointer;">
                    <span class="material-icons-round" style="font-size: 16px;">delete</span>
                </button>
            </div>
        `).join('');

        if (inventario.length === 0) listHtml = '<div style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No hay productos</div>';

        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">ADMINISTRAR PRODUCTOS</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; padding-right: 5px;">
                ${listHtml}
            </div>
            
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
        window.openModal(modalHtml);

        document.querySelectorAll('.btn-delete-prod').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteProducto(id);
                openAdminInventarioModal(); // Refresh modal
                renderProductos(); // Refresh main view
            });
        });

        document.getElementById('btnAddProd').addEventListener('click', () => {
            const nombre = document.getElementById('newProdName').value.trim();
            const precio = parseFloat(document.getElementById('newProdPrice').value);
            const stock = parseInt(document.getElementById('newProdStock').value);
            
            if (!nombre || isNaN(precio) || isNaN(stock)) {
                window.showToast('Completa todos los campos correctamente', 'danger');
                return;
            }

            addProducto({ nombre, precio, stock });
            openAdminInventarioModal();
            renderProductos();
            window.showToast('Producto añadido', 'success');
        });
    };

    // Initial render
    renderProductos();
    renderTransacciones();
    renderCaja();
};
