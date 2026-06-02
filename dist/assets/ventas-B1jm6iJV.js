import{f as e,l as t,r as n}from"./index-BBDbYyKX.js";var r=()=>`
        <div class="ventas-grid">
            <div class="pos-panel">
                <div class="card">
                    <h3 style="margin-bottom: 20px; color: var(--color-text-secondary);">PUNTO DE VENTA RÁPIDO</h3>
                    <div class="products-grid">
                        <div class="product-item" data-name="Botella de Agua" data-price="0.50">
                            <span class="material-icons-round" style="font-size: 32px; color: #3b82f6;">water_drop</span>
                            <div class="prod-name">Botella de Agua</div>
                            <div class="prod-price">$0.50</div>
                        </div>
                        <div class="product-item" data-name="Powerade" data-price="0.75">
                            <span class="material-icons-round" style="font-size: 32px; color: #ef4444;">sports_bar</span>
                            <div class="prod-name">Powerade</div>
                            <div class="prod-price">$0.75</div>
                        </div>
                        <div class="product-item" data-name="Hi Energy" data-price="0.50">
                            <span class="material-icons-round" style="font-size: 32px; color: var(--color-primary);">bolt</span>
                            <div class="prod-name">Hi Energy</div>
                            <div class="prod-price">$0.50</div>
                        </div>
                        <div class="product-item" data-name="Monster Blanco" data-price="2.50">
                            <span class="material-icons-round" style="font-size: 32px; color: #ffffff;">local_drink</span>
                            <div class="prod-name">Monster Blanco</div>
                            <div class="prod-price">$2.50</div>
                        </div>
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
            .carrito-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--color-bg-base);
                padding: 10px 14px;
                border-radius: var(--border-radius-sm);
                font-size: 14px;
            }
        </style>
    `,i=()=>{let r=[],i=document.getElementById(`carritoSection`),a=document.getElementById(`carritoItems`),o=document.getElementById(`carritoTotal`),s=()=>{let e=t();document.getElementById(`cajaTotal`).textContent=`$`+e.total.toFixed(2),document.getElementById(`cajaIngresos`).textContent=`$`+e.ingresos.toFixed(2),document.getElementById(`cajaSalidas`).textContent=`-$`+e.salidas.toFixed(2)},c=()=>{let t=e(),n=document.getElementById(`transTbody`),r=document.getElementById(`transEmpty`);if(t.length===0){n.innerHTML=``,r.style.display=`block`;return}r.style.display=`none`,n.innerHTML=t.map(e=>`
            <tr>
                <td>${e.hora}</td>
                <td>${e.concepto}</td>
                <td class="${e.tipo===`ingreso`?`text-success`:`text-danger`}">${e.tipo===`ingreso`?`+`:`-`}$${e.monto.toFixed(2)}</td>
            </tr>
        `).join(``)},l=()=>{if(r.length===0){i.style.display=`none`;return}i.style.display=`block`,o.textContent=`$`+r.reduce((e,t)=>e+t.price*t.qty,0).toFixed(2),a.innerHTML=r.map((e,t)=>`
            <div class="carrito-item">
                <span>${e.name} x${e.qty}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: var(--color-primary); font-weight: 600;">$${(e.price*e.qty).toFixed(2)}</span>
                    <button class="btn-remove-item" data-idx="${t}" style="background: transparent; border: none; color: var(--color-danger); cursor: pointer; font-size: 18px; line-height: 1;">×</button>
                </div>
            </div>
        `).join(``),document.querySelectorAll(`.btn-remove-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.getAttribute(`data-idx`));r.splice(t,1),l()})})};document.querySelectorAll(`.product-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-name`),n=parseFloat(e.getAttribute(`data-price`));e.style.transform=`scale(0.95)`,setTimeout(()=>{e.style.transform=``},150);let i=r.find(e=>e.name===t);i?i.qty++:r.push({name:t,price:n,qty:1}),l(),window.showToast(`${t} añadido al carrito`,`success`)})}),document.getElementById(`btnLimpiarCarrito`).addEventListener(`click`,()=>{r=[],l()}),document.getElementById(`btnCobrar`).addEventListener(`click`,()=>{if(r.length===0)return;let e=r.reduce((e,t)=>e+t.price*t.qty,0);n({tipo:`ingreso`,concepto:`Venta: ${r.map(e=>`${e.name} x${e.qty}`).join(`, `)}`,monto:e}),window.showToast(`Venta cobrada: $${e.toFixed(2)}`,`success`),r=[],l(),c(),s()});let u=e=>{let t=e===`ENTRADA`,r=`
            <div class="modal-header">
                <h3 class="modal-title">REGISTRAR ${e} DE EFECTIVO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Concepto / Motivo</label>
                <input type="text" id="movConcepto" placeholder="Ej. Pago a proveedor" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Monto</label>
                <input type="number" id="movMonto" placeholder="0.00" min="0.01" step="0.01" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: ${t?`var(--color-success)`:`var(--color-danger)`}; padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 24px; font-weight: 800; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnRegistrarMov" style="flex: 1; justify-content: center;">REGISTRAR ${e}</button>
            </div>
        `;window.openModal(r),document.getElementById(`btnRegistrarMov`).addEventListener(`click`,()=>{let r=document.getElementById(`movConcepto`).value.trim()||`${e} de efectivo`,i=parseFloat(document.getElementById(`movMonto`).value);if(!i||i<=0){window.showToast(`Ingresa un monto válido`,`danger`);return}n({tipo:t?`ingreso`:`salida`,concepto:r,monto:i}),window.closeModal(),window.showToast(`${e} registrada: $${i.toFixed(2)}`,`success`),c(),s()})};document.getElementById(`btnEntradaCaja`).addEventListener(`click`,()=>u(`ENTRADA`)),document.getElementById(`btnSalidaCaja`).addEventListener(`click`,()=>u(`SALIDA`)),document.getElementById(`btnCerrarCaja`).addEventListener(`click`,()=>{let e=t(),n=`
            <div class="modal-header">
                <h3 class="modal-title">CERRAR CAJA</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 48px; font-weight: 800; color: var(--color-primary); margin-bottom: 10px;">$${e.total.toFixed(2)}</div>
                <p style="color: var(--color-text-secondary); margin-bottom: 20px;">${e.numTransacciones} transacciones hoy</p>
                <div style="background: var(--color-bg-base); padding: 15px; border-radius: var(--border-radius-sm); display: flex; justify-content: space-around;">
                    <div><div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 5px;">Ingresos</div><div style="color: var(--color-success); font-weight: 700;">$${e.ingresos.toFixed(2)}</div></div>
                    <div><div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 5px;">Salidas</div><div style="color: var(--color-danger); font-weight: 700;">$${e.salidas.toFixed(2)}</div></div>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmarCierre" style="flex: 1; justify-content: center;">CONFIRMAR CIERRE</button>
            </div>
        `;window.openModal(n),document.getElementById(`btnConfirmarCierre`).addEventListener(`click`,()=>{window.closeModal(),window.showToast(`Caja cerrada exitosamente. Corte Z generado.`,`success`)})}),c(),s()};export{i as init,r as render};