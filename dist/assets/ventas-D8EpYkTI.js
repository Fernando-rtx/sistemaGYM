import{S as e,f as t,i as n,m as r,n as i,p as a,s as o,v as s}from"./index-DcmvT0CB.js";var c=()=>`
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
    `,l=async()=>{let c=[],l=document.getElementById(`carritoSection`),u=document.getElementById(`carritoItems`),d=document.getElementById(`carritoTotal`),f=document.getElementById(`productsGrid`),p=t(),m=document.getElementById(`btnAdminProductos`);p&&p.role===`Empleado`&&m&&(m.style.display=`none`);let h=async()=>{let e=await a();f.innerHTML=e.map(e=>{let t=c.find(t=>t.id===e.id),n=t?t.qty:0;return`
                <div class="product-item ${e.stock-n<=0?`disabled`:``}" data-id="${e.id}">
                    <div class="prod-stock">${e.stock}</div>
                    <span class="material-icons-round" style="font-size: 32px; color: ${e.color};">${e.icono}</span>
                    <div class="prod-name">${e.nombre}</div>
                    <div class="prod-price">$${e.precio.toFixed(2)}</div>
                </div>
            `}).join(``),document.querySelectorAll(`.product-item`).forEach(t=>{t.addEventListener(`click`,()=>{if(t.classList.contains(`disabled`))return;let n=t.getAttribute(`data-id`),r=e.find(e=>e.id===n);t.style.transform=`scale(0.95)`,setTimeout(()=>{t.style.transform=``},150);let i=c.find(e=>e.id===n);i?i.qty++:c.push({id:r.id,name:r.nombre,price:r.precio,qty:1}),v(),h()})})},g=async()=>{let e=await r();document.getElementById(`cajaTotal`).textContent=`$`+e.total.toFixed(2),document.getElementById(`cajaIngresos`).textContent=`$`+e.ingresos.toFixed(2),document.getElementById(`cajaSalidas`).textContent=`-$`+e.salidas.toFixed(2)},_=async()=>{let e=await s(),t=document.getElementById(`transTbody`),n=document.getElementById(`transEmpty`);if(e.length===0){t.innerHTML=``,n.style.display=`block`;return}n.style.display=`none`,t.innerHTML=e.map(e=>`
            <tr>
                <td>${e.hora}</td>
                <td>${e.concepto}</td>
                <td class="${e.tipo===`ingreso`?`text-success`:`text-danger`}">${e.tipo===`ingreso`?`+`:`-`}$${e.monto.toFixed(2)}</td>
            </tr>
        `).join(``)},v=()=>{if(c.length===0){l.style.display=`none`;return}l.style.display=`block`,d.textContent=`$`+c.reduce((e,t)=>e+t.price*t.qty,0).toFixed(2),u.innerHTML=c.map((e,t)=>`
            <div class="carrito-item">
                <span>${e.name} x${e.qty}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: var(--color-primary); font-weight: 600;">$${(e.price*e.qty).toFixed(2)}</span>
                    <button class="btn-remove-item" data-idx="${t}" style="background: transparent; border: none; color: var(--color-danger); cursor: pointer; font-size: 18px; line-height: 1;">×</button>
                </div>
            </div>
        `).join(``),document.querySelectorAll(`.btn-remove-item`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=parseInt(e.getAttribute(`data-idx`));c.splice(t,1),v(),await h()})})};document.getElementById(`btnLimpiarCarrito`).addEventListener(`click`,async()=>{c=[],v(),await h()}),document.getElementById(`btnCobrar`).addEventListener(`click`,()=>{if(c.length===0)return;let t=c.reduce((e,t)=>e+t.price*t.qty,0),r=`
            <div class="modal-header">
                <h3 class="modal-title">COBRAR VENTA</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 14px; color: var(--color-text-secondary);">Total a cobrar:</div>
                <div style="font-size: 48px; font-weight: 800; color: var(--color-primary);">$${t.toFixed(2)}</div>
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
        `;window.openModal(r);let i=`Efectivo`,o=document.querySelectorAll(`.payment-method`);o.forEach(e=>e.addEventListener(`click`,function(){o.forEach(e=>{e.classList.remove(`selected`),e.style.border=`1px solid rgba(255,255,255,0.1)`,e.style.background=`transparent`,e.style.opacity=`0.5`,e.querySelector(`span`).style.color=`var(--color-text-secondary)`,e.querySelector(`div`).style.color=`var(--color-text-secondary)`}),this.classList.add(`selected`),this.style.border=`2px solid var(--color-primary)`,this.style.background=`rgba(148,255,0,0.05)`,this.style.opacity=`1`,this.querySelector(`span`).style.color=`var(--color-primary)`,this.querySelector(`div`).style.color=`var(--color-primary)`,i=this.getAttribute(`data-method`)})),document.getElementById(`btnConfirmarCobro`).addEventListener(`click`,async()=>{let r=c.map(e=>`${e.name} x${e.qty}`).join(`, `),o=await a();for(let t of c){let n=o.find(e=>e.id===t.id);n&&await e(n.id,{stock:n.stock-t.qty})}await n({tipo:`ingreso`,concepto:`Venta (${i}): ${r}`,monto:t}),window.showToast(`Venta cobrada con éxito`,`success`),c=[],window.closeModal(),v(),await _(),await g(),await h()})});let y=e=>{let t=e===`ENTRADA`,r=`
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
        `;window.openModal(r),document.getElementById(`btnRegistrarMov`).addEventListener(`click`,async()=>{let r=document.getElementById(`movConcepto`).value.trim()||`${e} de efectivo`,i=parseFloat(document.getElementById(`movMonto`).value);if(!i||i<=0){window.showToast(`Ingresa un monto válido`,`danger`);return}await n({tipo:t?`ingreso`:`salida`,concepto:r,monto:i}),window.closeModal(),window.showToast(`${e} registrada: $${i.toFixed(2)}`,`success`),await _(),await g()})};document.getElementById(`btnEntradaCaja`).addEventListener(`click`,()=>y(`ENTRADA`)),document.getElementById(`btnSalidaCaja`).addEventListener(`click`,()=>y(`SALIDA`)),document.getElementById(`btnCerrarCaja`).addEventListener(`click`,async()=>{let e=await r(),t=`
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
        `;window.openModal(t),document.getElementById(`btnConfirmarCierre`).addEventListener(`click`,()=>{window.closeModal(),window.showToast(`Caja cerrada exitosamente. Corte Z generado.`,`success`)})}),document.getElementById(`btnAdminProductos`).addEventListener(`click`,()=>{b()});let b=async()=>{let e=await a(),t=e.map(e=>`
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="material-icons-round" style="color:${e.color};">${e.icono}</span>
                    <div>
                        <div style="font-size: 14px; font-weight: 600;">${e.nombre}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">Stock: ${e.stock} | Precio: $${e.precio.toFixed(2)}</div>
                    </div>
                </div>
                <button class="btn-icon danger btn-delete-prod" data-id="${e.id}" style="width: 28px; height: 28px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: var(--color-danger); cursor: pointer;">
                    <span class="material-icons-round" style="font-size: 16px;">delete</span>
                </button>
            </div>
        `).join(``);e.length===0&&(t=`<div style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No hay productos</div>`);let n=`
            <div class="modal-header">
                <h3 class="modal-title">ADMINISTRAR PRODUCTOS</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; padding-right: 5px;">
                ${t}
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
        `;window.openModal(n),document.querySelectorAll(`.btn-delete-prod`).forEach(e=>{e.addEventListener(`click`,async()=>{await o(e.getAttribute(`data-id`)),await b(),await h()})}),document.getElementById(`btnAddProd`).addEventListener(`click`,async()=>{let e=document.getElementById(`newProdName`).value.trim(),t=parseFloat(document.getElementById(`newProdPrice`).value),n=parseInt(document.getElementById(`newProdStock`).value);if(!e||isNaN(t)||isNaN(n)){window.showToast(`Completa todos los campos correctamente`,`danger`);return}await i({nombre:e,precio:t,stock:n}),await b(),await h(),window.showToast(`Producto añadido`,`success`)})};await h(),await _(),await g()};export{l as init,c as render};