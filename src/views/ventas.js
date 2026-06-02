export const render = () => {
    return `
        <div class="ventas-grid">
            <div class="pos-panel">
                <div class="card">
                    <h3 style="margin-bottom: 20px; color: var(--color-text-secondary);">PUNTO DE VENTA RÁPIDO</h3>
                    <div class="products-grid">
                        <div class="product-item">
                            <span class="material-icons-round" style="font-size: 32px; color: #3b82f6;">water_drop</span>
                            <div class="prod-name">Botella de Agua</div>
                            <div class="prod-price">$0.50</div>
                        </div>
                        <div class="product-item">
                            <span class="material-icons-round" style="font-size: 32px; color: #ef4444;">sports_bar</span>
                            <div class="prod-name">Powerade</div>
                            <div class="prod-price">$0.75</div>
                        </div>
                        <div class="product-item">
                            <span class="material-icons-round" style="font-size: 32px; color: var(--color-primary);">bolt</span>
                            <div class="prod-name">Hi Energy</div>
                            <div class="prod-price">$0.50</div>
                        </div>
                        <div class="product-item">
                            <span class="material-icons-round" style="font-size: 32px; color: #ffffff;">local_drink</span>
                            <div class="prod-name">Monster Blanco</div>
                            <div class="prod-price">$2.50</div>
                        </div>
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
                        <tbody>
                            <tr>
                                <td>15:30</td>
                                <td>Membresía - Plan Mensual (Nuevo Socio)</td>
                                <td class="text-success">+$11.00</td>
                            </tr>
                            <tr>
                                <td>13:15</td>
                                <td>Venta - Botella de Agua</td>
                                <td class="text-success">+$0.50</td>
                            </tr>
                            <tr>
                                <td>10:00</td>
                                <td>Pago Proveedor (Salida)</td>
                                <td class="text-danger">-$50.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="caja-panel">
                <div class="card caja-summary">
                    <h3>CIERRE DE CAJA</h3>
                    <div class="caja-total">$22.00</div>
                    <p style="color: var(--color-text-secondary); margin-bottom: 30px;">Efectivo en Caja</p>
                    
                    <div class="caja-stats">
                        <div class="caja-stat-row">
                            <span>Ingresos:</span>
                            <span class="text-success">$22.00</span>
                        </div>
                        <div class="caja-stat-row">
                            <span>Salidas:</span>
                            <span class="text-danger">-$50.00</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 30px;">
                        <button class="btn btn-outline" style="flex: 1;" id="btnEntradaCaja">ENTRADA</button>
                        <button class="btn btn-outline" style="flex: 1;" id="btnSalidaCaja">SALIDA</button>
                    </div>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 10px; justify-content: center;" onclick="window.showToast('Caja cerrada. Imprimiendo corte Z...', 'success')">CERRAR CAJA</button>
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
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 10px;
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            .product-item:hover {
                border-color: var(--color-primary);
                transform: translateY(-2px);
                background-color: rgba(148, 255, 0, 0.05);
            }
            .prod-name { font-size: 13px; font-weight: 500; }
            .prod-price { font-size: 16px; font-weight: 700; color: var(--color-primary); }

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

            .caja-summary {
                text-align: center;
            }
            .caja-total {
                font-size: 48px;
                font-weight: 800;
                color: var(--color-primary);
                margin: 20px 0 5px;
            }
            .caja-stats {
                background-color: var(--color-bg-base);
                padding: 20px;
                border-radius: var(--border-radius-sm);
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .caja-stat-row {
                display: flex;
                justify-content: space-between;
                font-size: 15px;
                font-weight: 500;
            }
        </style>
    `;
};

export const init = () => {
    // Interacciones básicas del punto de venta
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.querySelector('.prod-name').textContent;
            // Solo una animación visual para indicar que se añadió
            item.style.transform = 'scale(0.95)';
            window.showToast('Añadido al carrito: ' + name, 'success');
            setTimeout(() => item.style.transform = '', 150);
        });
    });

    const openMovimientoModal = (tipo) => {
        const isEntrada = tipo === 'ENTRADA';
        const color = isEntrada ? 'var(--color-success)' : 'var(--color-danger)';
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">REGISTRAR ${tipo} DE EFECTIVO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div class="form-group" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Concepto / Motivo</label>
                <input type="text" class="form-input" placeholder="Ej. Pago a proveedor" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box;">
            </div>
            <div class="form-group" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Monto</label>
                <input type="number" class="form-input" placeholder="$ 0.00" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: ${color}; padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 24px; font-weight: 800; width: 100%; box-sizing: border-box;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" style="flex: 1; justify-content: center;" onclick="window.closeModal(); window.showToast('${tipo} registrada con éxito', 'success')">REGISTRAR ${tipo}</button>
            </div>
        `;
        window.openModal(modalHtml);
    };

    const btnEntrada = document.getElementById('btnEntradaCaja');
    const btnSalida = document.getElementById('btnSalidaCaja');
    
    if (btnEntrada) btnEntrada.addEventListener('click', () => openMovimientoModal('ENTRADA'));
    if (btnSalida) btnSalida.addEventListener('click', () => openMovimientoModal('SALIDA'));
};
