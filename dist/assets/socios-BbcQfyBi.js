import{a as e,d as t,g as n,n as r,o as i,r as a,s as o,t as s,u as c}from"./index-BBDbYyKX.js";var l=()=>`
        <div class="socios-header">
            <div class="filters">
                <input type="text" class="search-input" placeholder="🔍 Buscar socio...">
                <div class="status-filters">
                    <button class="filter-btn active">TODOS (0)</button>
                    <button class="filter-btn text-success">ACTIVOS (0)</button>
                    <button class="filter-btn text-danger">VENCIDOS (0)</button>
                </div>
            </div>
            <button class="btn btn-primary" id="btnNuevoSocio">
                <span class="material-icons-round">add</span> NUEVO SOCIO
            </button>
        </div>

        <div class="card socios-table-container">
            <table class="socios-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>MEMBRESÍA</th>
                        <th>VENCIMIENTO</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody id="sociosTbody">
                </tbody>
            </table>
        </div>

        <style>
            .socios-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .filters {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            .search-input {
                background-color: var(--color-bg-surface);
                border: 1px solid rgba(255,255,255,0.1);
                color: var(--color-text-primary);
                padding: 12px 20px;
                border-radius: var(--border-radius-md);
                width: 300px;
                outline: none;
                transition: border-color var(--transition-fast);
            }
            .search-input:focus { border-color: var(--color-primary); }
            
            .status-filters {
                display: flex;
                gap: 10px;
                background-color: var(--color-bg-surface);
                padding: 4px;
                border-radius: var(--border-radius-md);
            }
            .filter-btn {
                background: transparent; border: none;
                color: var(--color-text-secondary);
                padding: 8px 16px;
                border-radius: var(--border-radius-sm);
                cursor: pointer; font-size: 13px; font-weight: 600;
            }
            .filter-btn.active { background-color: rgba(255,255,255,0.1); color: var(--color-text-primary); }
            .text-success { color: var(--color-success); }
            .text-danger { color: var(--color-danger); }
            
            .socios-table-container {
                padding: 0;
                overflow: hidden;
            }
            .socios-table {
                width: 100%;
                border-collapse: collapse;
            }
            .socios-table th {
                text-align: left;
                padding: 16px 24px;
                color: var(--color-text-secondary);
                font-size: 12px;
                font-weight: 600;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                letter-spacing: 1px;
            }
            .socios-table td {
                padding: 16px 24px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                font-size: 14px;
            }
            .socios-table tbody tr:hover {
                background-color: rgba(255,255,255,0.02);
            }
            .status-badge {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }
            .status-activo { background-color: rgba(16, 185, 129, 0.1); color: var(--color-success); }
            .status-vencido { background-color: rgba(239, 68, 68, 0.1); color: var(--color-danger); }
            
            .avatar-sm {
                display: inline-flex; width: 30px; height: 30px;
                background-color: var(--color-bg-surface-hover);
                align-items: center; justify-content: center;
                border-radius: 50%; margin-right: 12px;
                font-size: 12px; font-weight: 600;
            }
            .action-btns { display: flex; gap: 6px; }
            .btn-icon {
                background: transparent; border: 1px solid rgba(255,255,255,0.1);
                color: var(--color-text-secondary); cursor: pointer;
                width: 32px; height: 32px; border-radius: 8px;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s;
            }
            .btn-icon:hover { border-color: var(--color-primary); color: var(--color-primary); }
            .btn-icon.danger:hover { border-color: var(--color-danger); color: var(--color-danger); }
        </style>
    `,u=()=>{let l=t(),u=`TODOS`,f=``,p=document.getElementById(`sociosTbody`),m=document.querySelector(`.search-input`),h=document.querySelectorAll(`.filter-btn`),g=c().precios||{Mensual:20,Quincenal:10,Diario:3},_=()=>{if(l=t(),!p)return;p.innerHTML=l.filter(e=>{let t=e.nombre.toLowerCase().includes(f.toLowerCase())||e.id.includes(f),n=u===`TODOS`||e.estado.toUpperCase()===u;return t&&n}).map(e=>`
            <tr>
                <td style="color: var(--color-text-secondary);">#${e.id.substring(0,6)}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <span class="avatar-sm">${e.nombre.substring(0,2).toUpperCase()}</span>
                        <div>
                            <div>${e.nombre}</div>
                            ${e.telefono?`<div style="font-size: 12px; color: var(--color-text-secondary);">${e.telefono}</div>`:``}
                        </div>
                    </div>
                </td>
                <td>${e.membresia}</td>
                <td>${o(e.fechaVencimiento)}</td>
                <td>
                    <span class="status-badge ${e.estado===`Activo`?`status-activo`:`status-vencido`}">
                        ${e.estado.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon btn-checkin-row" data-id="${e.id}" data-nombre="${e.nombre}" title="Check-in">
                            <span class="material-icons-round" style="font-size: 16px;">login</span>
                        </button>
                        <button class="btn-icon btn-edit-row" data-id="${e.id}" title="Editar">
                            <span class="material-icons-round" style="font-size: 16px;">edit</span>
                        </button>
                        <button class="btn-icon danger btn-delete-row" data-id="${e.id}" data-nombre="${e.nombre}" title="Eliminar">
                            <span class="material-icons-round" style="font-size: 16px;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join(``);let e=l.length,n=l.filter(e=>e.estado===`Activo`).length,r=l.filter(e=>e.estado===`Vencido`).length;h[0].textContent=`TODOS (${e})`,h[1].textContent=`ACTIVOS (${n})`,h[2].textContent=`VENCIDOS (${r})`,document.querySelectorAll(`.btn-checkin-row`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-id`),n=e.getAttribute(`data-nombre`);s(t,n),window.showToast(`Check-in registrado para ${n}`,`success`)})}),document.querySelectorAll(`.btn-edit-row`).forEach(e=>{e.addEventListener(`click`,()=>{v(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.btn-delete-row`).forEach(e=>{e.addEventListener(`click`,()=>{y(e.getAttribute(`data-id`),e.getAttribute(`data-nombre`))})})};m&&m.addEventListener(`input`,e=>{f=e.target.value,_()}),h.forEach(e=>{e.addEventListener(`click`,e=>{h.forEach(e=>e.classList.remove(`active`)),e.currentTarget.classList.add(`active`);let t=e.currentTarget.textContent;t.includes(`TODOS`)&&(u=`TODOS`),t.includes(`ACTIVOS`)&&(u=`ACTIVO`),t.includes(`VENCIDOS`)&&(u=`VENCIDO`),_()})}),_(),document.getElementById(`btnNuevoSocio`).addEventListener(`click`,()=>{let t=`
            <div class="modal-header">
                <h3 class="modal-title">NUEVO SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Nombre completo</label>
                <input type="text" id="inpSocioNombre" placeholder="Nombre del socio" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Teléfono</label>
                <input type="tel" id="inpSocioTel" placeholder="7777-1234" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Plan de Membresía</label>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    <div class="plan-card selected" data-plan="Mensual" data-precio="${g.Mensual}" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s;">
                        <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 600;">MENSUAL</div>
                        <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$${g.Mensual.toFixed(2)}</div>
                    </div>
                    <div class="plan-card" data-plan="Quincenal" data-precio="${g.Quincenal}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                        <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">QUINCENAL</div>
                        <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${g.Quincenal.toFixed(2)}</div>
                    </div>
                    <div class="plan-card" data-plan="Diario" data-precio="${g.Diario}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                        <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">DIARIO</div>
                        <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${g.Diario.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnGuardarSocio" style="flex: 1; justify-content: center;">REGISTRAR</button>
            </div>
        `;window.openModal(t),d(),document.getElementById(`btnGuardarSocio`).addEventListener(`click`,()=>{let t=document.getElementById(`inpSocioNombre`).value.trim();if(!t){window.showToast(`El nombre es obligatorio`,`danger`);return}let n=document.getElementById(`inpSocioTel`).value.trim(),i=document.querySelector(`.plan-card.selected`),o=i?i.getAttribute(`data-plan`):`Mensual`,s=i?parseFloat(i.getAttribute(`data-precio`)):g.Mensual;r({nombre:t,telefono:n,membresia:o,precio:s,fechaVencimiento:e(o)}),a({tipo:`ingreso`,concepto:`Membresía ${o} - ${t}`,monto:s}),window.closeModal(),window.showToast(`${t} registrado con éxito`,`success`),_()})});function v(e){let t=l.find(t=>t.id===e);if(!t)return;let r=`
            <div class="modal-header">
                <h3 class="modal-title">EDITAR SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Nombre completo</label>
                <input type="text" id="editNombre" value="${t.nombre}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Teléfono</label>
                <input type="tel" id="editTel" value="${t.telefono||``}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnUpdateSocio" style="flex: 1; justify-content: center;">GUARDAR</button>
            </div>
        `;window.openModal(r),document.getElementById(`btnUpdateSocio`).addEventListener(`click`,()=>{let t=document.getElementById(`editNombre`).value.trim(),r=document.getElementById(`editTel`).value.trim();if(!t){window.showToast(`El nombre es obligatorio`,`danger`);return}n(e,{nombre:t,telefono:r}),window.closeModal(),window.showToast(`Socio actualizado`,`success`),_()})}function y(e,t){let n=`
            <div class="modal-header">
                <h3 class="modal-title">ELIMINAR SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <span class="material-icons-round" style="font-size: 48px; color: var(--color-danger);">warning</span>
                <p style="margin-top: 15px; font-size: 16px;">¿Estás seguro de eliminar a <strong>${t}</strong>?</p>
                <p style="color: var(--color-text-secondary); font-size: 13px; margin-top: 8px;">Esta acción no se puede deshacer.</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmDelete" style="flex: 1; justify-content: center; background-color: var(--color-danger);">ELIMINAR</button>
            </div>
        `;window.openModal(n),document.getElementById(`btnConfirmDelete`).addEventListener(`click`,()=>{i(e),window.closeModal(),window.showToast(`${t} eliminado`,`success`),_()})}};function d(){let e=document.querySelectorAll(`.plan-card`);e.forEach(t=>{t.addEventListener(`click`,function(){e.forEach(e=>{e.classList.remove(`selected`),e.style.border=`1px solid rgba(255,255,255,0.1)`,e.style.backgroundColor=`transparent`,e.style.opacity=`0.5`,e.querySelector(`.plan-name`).style.color=`var(--color-text-secondary)`,e.querySelector(`.plan-price`).style.color=`var(--color-text-primary)`}),this.classList.add(`selected`),this.style.border=`2px solid var(--color-primary)`,this.style.backgroundColor=`rgba(148, 255, 0, 0.05)`,this.style.opacity=`1`,this.querySelector(`.plan-name`).style.color=`var(--color-primary)`,this.querySelector(`.plan-price`).style.color=`var(--color-primary)`})})}export{u as init,l as render};