import{C as e,c as t,f as n,g as r,h as i,i as a,l as o,o as s,r as c,t as l,u}from"./index-DcmvT0CB.js";var d=()=>`
        <div id="sociosMainView">
            <div class="socios-header">
                <div class="filters">
                    <input type="text" class="search-input" placeholder="🔍 Buscar socio...">
                    <div class="status-filters" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="filter-btn active">TODOS (0)</button>
                        <button class="filter-btn text-success">ACTIVOS (0)</button>
                        <button class="filter-btn text-warning" style="color: #eab308;">POR RENOVAR (0)</button>
                        <button class="filter-btn text-danger">VENCIDOS (0)</button>
                        <button class="filter-btn" style="color: #a8a29e;">AUSENTES (0)</button>
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
        </div>

        <div id="sociosProfileView" style="display: none;">
            <!-- Profile content will be injected here -->
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
            .status-ausente { background-color: rgba(255, 255, 255, 0.1); color: var(--color-text-secondary); }
            
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
            
            /* Profile View Specific Styles */
            .profile-stat-card {
                background: var(--color-bg-surface);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: var(--border-radius-md);
                padding: 20px;
            }
            .heatmap-grid {
                display: grid;
                grid-template-columns: repeat(15, 1fr);
                gap: 6px;
            }
            .heatmap-cell {
                aspect-ratio: 1;
                border-radius: 4px;
            }
        </style>
    `,f=async()=>{let d=await r(),f=`TODOS`,p=``,m=document.getElementById(`sociosTbody`),h=document.querySelector(`.search-input`),g=document.querySelectorAll(`.filter-btn`),_=(await i()).precios||{Mensual:20,Quincenal:10,Diario:3},v=async()=>{if(d=await r(),!m)return;let e=await u(),t=new Date,i=0,a=0,s=0,c=0,h=0,_=d.filter(n=>{let r=n.nombre.toLowerCase().includes(p.toLowerCase())||n.id.includes(p),o=n.estado===`Activo`,l=n.estado===`Vencido`,u=(new Date(n.fechaVencimiento)-t)/(1e3*60*60*24),d=o&&u>=0&&u<=3,m=e.filter(e=>e.socioId===n.id),g=999;g=m.length>0?(t-new Date(m[0].fecha+`T00:00:00`))/(1e3*60*60*24):(t-new Date(n.fechaRegistro+`T00:00:00`))/(1e3*60*60*24);let _=g>5;i++,o&&a++,l&&c++,d&&s++,_&&h++;let v=!1;return f===`TODOS`&&(v=!0),f===`ACTIVO`&&o&&(v=!0),f===`VENCIDO`&&l&&(v=!0),f===`POR RENOVAR`&&d&&(v=!0),f===`AUSENTE`&&_&&(v=!0),r&&v}),S=n();m.innerHTML=_.map(n=>{let r=e.filter(e=>e.socioId===n.id),i=999;r.length>0&&(i=(t-new Date(r[0].fecha+`T00:00:00`))/(1e3*60*60*24));let a=i>5&&n.estado!==`Vencido`;return`
            <tr style="cursor: pointer;" class="socio-row" data-id="${n.id}">
                <td style="color: var(--color-text-secondary);">#${n.id.substring(0,6)}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <span class="avatar-sm">${n.nombre.substring(0,2).toUpperCase()}</span>
                        <div>
                            <div>${n.nombre}</div>
                            <div style="font-size: 12px; color: var(--color-text-secondary);">${n.edad?n.edad+` años • `:``}${n.telefono||`Sin teléfono`}</div>
                        </div>
                    </div>
                </td>
                <td>${n.membresia}</td>
                <td>${o(n.fechaVencimiento)}</td>
                <td>
                    <span class="status-badge ${n.estado===`Vencido`?`status-vencido`:a?`status-ausente`:`status-activo`}">
                        ${n.estado===`Vencido`?`VENCIDO`:a?`AUSENTE`:`ACTIVO`}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon btn-checkin-row" data-id="${n.id}" data-nombre="${n.nombre}" title="Check-in">
                            <span class="material-icons-round" style="font-size: 16px;">login</span>
                        </button>
                        <button class="btn-icon btn-edit-row" data-id="${n.id}" title="Editar">
                            <span class="material-icons-round" style="font-size: 16px;">edit</span>
                        </button>
                        ${S&&S.role!==`Empleado`?`
                        <button class="btn-icon danger btn-delete-row" data-id="${n.id}" data-nombre="${n.nombre}" title="Eliminar">
                            <span class="material-icons-round" style="font-size: 16px;">delete</span>
                        </button>
                        `:``}
                    </div>
                </td>
            </tr>
            `}).join(``),g[0].textContent=`TODOS (${i})`,g[1].textContent=`ACTIVOS (${a})`,g[2].textContent=`POR RENOVAR (${s})`,g[3].textContent=`VENCIDOS (${c})`,g[4].textContent=`AUSENTES (${h})`,document.querySelectorAll(`.btn-checkin-row`).forEach(e=>{e.addEventListener(`click`,async t=>{t.stopPropagation();let n=e.getAttribute(`data-id`),r=e.getAttribute(`data-nombre`);await l(n,r),window.showToast(`Check-in registrado para ${r}`,`success`),await v()})}),document.querySelectorAll(`.btn-edit-row`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),y(e.getAttribute(`data-id`))})}),document.querySelectorAll(`.btn-delete-row`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),b(e.getAttribute(`data-id`),e.getAttribute(`data-nombre`))})}),document.querySelectorAll(`.socio-row`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`button`)||t.target.closest(`.action-btns`)||x(e.getAttribute(`data-id`))})})};h&&h.addEventListener(`input`,e=>{p=e.target.value,v()}),g.forEach(e=>{e.addEventListener(`click`,e=>{g.forEach(e=>e.classList.remove(`active`)),e.currentTarget.classList.add(`active`);let t=e.currentTarget.textContent;t.includes(`TODOS`)?f=`TODOS`:t.includes(`ACTIVOS`)?f=`ACTIVO`:t.includes(`POR RENOVAR`)?f=`POR RENOVAR`:t.includes(`VENCIDOS`)?f=`VENCIDO`:t.includes(`AUSENTES`)&&(f=`AUSENTE`),v()})}),await v(),document.getElementById(`btnNuevoSocio`).addEventListener(`click`,()=>{let e=new Date().toISOString().split(`T`)[0],t=`
            <div class="modal-header">
                <h3 class="modal-title" style="font-size: 18px; font-weight: 900; letter-spacing: 0.5px;">NUEVO SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            
            <div class="form-group" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">NOMBRE COMPLETO</label>
                <input type="text" id="inpSocioNombre" placeholder="Ej. María Fernanda Castillo" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; width: 100%; box-sizing: border-box; outline: none; transition: border-color 0.2s;">
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">EDAD</label>
                    <input type="number" id="inpSocioEdad" placeholder="25" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; outline: none; width: 100%; box-sizing: border-box; transition: border-color 0.2s;">
                </div>
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">TELÉFONO</label>
                    <input type="tel" id="inpSocioTel" placeholder="+1 555 000 0000" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; outline: none; width: 100%; box-sizing: border-box; transition: border-color 0.2s;">
                </div>
            </div>
            
            <div class="form-group" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">PLAN CONTRATADO</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px;">
                    <div class="plan-card-ns selected" data-plan="Mensual" data-precio="${_.Mensual}" data-dias="30" style="border: 2px solid var(--color-primary); padding: 16px; border-radius: var(--border-radius-md); cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s; position: relative;">
                        <span class="material-icons-round check-icon-ns" style="position: absolute; top: 12px; right: 12px; color: var(--color-primary); font-size: 20px;">check_circle</span>
                        <div class="plan-name-ns" style="font-size: 12px; margin-bottom: 4px; color: var(--color-text-primary); font-weight: 900;">PLAN MENSUAL</div>
                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 12px; font-weight: 500;">30 días de acceso</div>
                        <div class="plan-price-ns" style="font-size: 24px; font-weight: 900; color: var(--color-primary);">$${_.Mensual.toFixed(2)} <span style="font-size: 10px; font-weight: 700; color: var(--color-text-secondary);">USD</span></div>
                    </div>
                    <div class="plan-card-ns" data-plan="Quincenal" data-precio="${_.Quincenal}" data-dias="15" style="border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: var(--border-radius-md); cursor: pointer; transition: all 0.2s; position: relative; opacity: 0.6;">
                        <span class="material-icons-round check-icon-ns" style="position: absolute; top: 12px; right: 12px; color: transparent; font-size: 20px;">check_circle</span>
                        <div class="plan-name-ns" style="font-size: 12px; margin-bottom: 4px; color: var(--color-text-secondary); font-weight: 900;">PLAN QUINCENAL</div>
                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 12px; font-weight: 500;">15 días de acceso</div>
                        <div class="plan-price-ns" style="font-size: 24px; font-weight: 900; color: var(--color-text-primary);">$${_.Quincenal.toFixed(2)} <span style="font-size: 10px; font-weight: 700; color: var(--color-text-secondary);">USD</span></div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">FECHA DE INICIO</label>
                    <div style="position: relative;">
                        <input type="date" id="inpFechaInicio" value="${e}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; font-weight: 600; outline: none; width: 100%; box-sizing: border-box; cursor: pointer;">
                    </div>
                </div>
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">VENCIMIENTO (AUTO)</label>
                    <input type="text" id="inpFechaVencimiento" readonly style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: var(--color-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; font-weight: 800; outline: none; width: 100%; box-sizing: border-box; text-transform: uppercase;">
                </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn btn-outline" onclick="window.closeModal()" style="padding: 12px 24px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">CANCELAR</button>
                <button class="btn btn-primary" id="btnGuardarSocio" style="padding: 12px 24px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;"><span class="material-icons-round" style="font-size: 18px;">check</span> REGISTRAR</button>
            </div>
        `;window.openModal(t);let n=document.getElementById(`inpFechaInicio`),r=document.getElementById(`inpFechaVencimiento`),i=document.querySelectorAll(`.plan-card-ns`),o=()=>{let e=n.value,t=document.querySelector(`.plan-card-ns.selected`),i=t?parseInt(t.getAttribute(`data-dias`)):30;if(!e)return;let a=new Date(e+`T00:00:00`);a.setDate(a.getDate()+i),r.value=a.toLocaleDateString(`es-ES`,{day:`numeric`,month:`short`,year:`numeric`})};n.addEventListener(`change`,o),i.forEach(e=>{e.addEventListener(`click`,function(){i.forEach(e=>{e.classList.remove(`selected`),e.style.border=`1px solid rgba(255,255,255,0.1)`,e.style.backgroundColor=`transparent`,e.style.opacity=`0.6`,e.querySelector(`.plan-name-ns`).style.color=`var(--color-text-secondary)`,e.querySelector(`.plan-price-ns`).style.color=`var(--color-text-primary)`,e.querySelector(`.check-icon-ns`).style.color=`transparent`}),this.classList.add(`selected`),this.style.border=`2px solid var(--color-primary)`,this.style.backgroundColor=`rgba(148, 255, 0, 0.05)`,this.style.opacity=`1`,this.querySelector(`.plan-name-ns`).style.color=`var(--color-text-primary)`,this.querySelector(`.plan-price-ns`).style.color=`var(--color-primary)`,this.querySelector(`.check-icon-ns`).style.color=`var(--color-primary)`,o()})}),o(),document.getElementById(`btnGuardarSocio`).addEventListener(`click`,async()=>{let e=document.getElementById(`inpSocioNombre`).value.trim();if(!e){window.showToast(`El nombre es obligatorio`,`danger`);return}let t=document.getElementById(`inpSocioTel`).value.trim(),r=document.querySelector(`.plan-card-ns.selected`),i=r?r.getAttribute(`data-plan`):`Mensual`,o=r?parseFloat(r.getAttribute(`data-precio`)):_.Mensual,s=r?parseInt(r.getAttribute(`data-dias`)):30,l=document.getElementById(`inpSocioEdad`).value?parseInt(document.getElementById(`inpSocioEdad`).value):null,u=n.value,d=new Date(u+`T00:00:00`);d.setDate(d.getDate()+s),await c({nombre:e,telefono:t,edad:l,membresia:i,precio:o,fechaRegistro:u,fechaVencimiento:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,`0`)}-${String(d.getDate()).padStart(2,`0`)}`}),await a({tipo:`ingreso`,concepto:`Membresía ${i} - ${e}`,monto:o}),window.closeModal(),window.showToast(`${e} registrado con éxito`,`success`),await v()})});function y(t){let n=d.find(e=>e.id===t);if(!n)return;let r=`
            <div class="modal-header">
                <h3 class="modal-title">EDITAR SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Nombre completo</label>
                <input type="text" id="editNombre" value="${n.nombre}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Teléfono / Edad</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="editEdad" value="${n.edad||``}" placeholder="Edad" style="flex: 1; background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; outline: none;">
                    <input type="tel" id="editTel" value="${n.telefono||``}" placeholder="7777-1234" style="flex: 2; background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; outline: none;">
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnUpdateSocio" style="flex: 1; justify-content: center;">GUARDAR</button>
            </div>
        `;window.openModal(r),document.getElementById(`btnUpdateSocio`).addEventListener(`click`,async()=>{let n=document.getElementById(`editNombre`).value.trim(),r=document.getElementById(`editTel`).value.trim(),i=document.getElementById(`editEdad`).value?parseInt(document.getElementById(`editEdad`).value):null;if(!n){window.showToast(`El nombre es obligatorio`,`danger`);return}await e(t,{nombre:n,telefono:r,edad:i}),window.closeModal(),window.showToast(`Socio actualizado`,`success`),await v();let a=document.getElementById(`sociosProfileView`);a&&a.style.display===`block`&&x(t)})}function b(e,n){let r=`
            <div class="modal-header">
                <h3 class="modal-title">ELIMINAR SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <span class="material-icons-round" style="font-size: 48px; color: var(--color-danger);">warning</span>
                <p style="margin-top: 15px; font-size: 16px;">¿Estás seguro de eliminar a <strong>${n}</strong>?</p>
                <p style="color: var(--color-text-secondary); font-size: 13px; margin-top: 8px;">Esta acción no se puede deshacer.</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmDelete" style="flex: 1; justify-content: center; background-color: var(--color-danger);">ELIMINAR</button>
            </div>
        `;window.openModal(r),document.getElementById(`btnConfirmDelete`).addEventListener(`click`,async()=>{await t(e),window.closeModal(),window.showToast(`${n} eliminado`,`success`);let r=document.getElementById(`sociosProfileView`);r&&r.style.display===`block`&&(document.getElementById(`sociosProfileView`).style.display=`none`,document.getElementById(`sociosMainView`).style.display=`block`),await v()})}async function x(t){let r=d.find(e=>e.id===t);if(!r)return;document.getElementById(`sociosMainView`).style.display=`none`;let i=document.getElementById(`sociosProfileView`);i.style.display=`block`,i.innerHTML=`<div style="text-align:center; padding: 50px;">Cargando perfil...</div>`;let c=new Date,f=new Date(r.fechaRegistro+`T00:00:00`),p=new Date(r.fechaVencimiento+`T00:00:00`),m=Math.max(0,Math.floor((c-f)/(1e3*60*60*24))),h=Math.max(1,Math.ceil((p-f)/(1e3*60*60*24))),g=Math.ceil((p-c)/(1e3*60*60*24)),_=(h-Math.max(0,g))/h*100;_>100&&(_=100),_<0&&(_=0);let y=(await u()).filter(e=>e.socioId===t).sort((e,t)=>new Date(t.fecha)-new Date(e.fecha)),S=0,C=`-`,w=!1;if(y.length>0){C=o(y[0].fecha);let e=new Date(c),t=new Set(y.map(e=>e.fecha)),n=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;for(t.has(n)||e.setDate(e.getDate()-1);;){let n=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;if(t.has(n))S++,e.setDate(e.getDate()-1);else break}w=(c-new Date(y[0].fecha+`T00:00:00`))/(1e3*60*60*24)>5}else w=(c-f)/(1e3*60*60*24)>5;let T=``,E=new Set(y.map(e=>e.fecha)),D=0;for(let e=29;e>=0;e--){let t=new Date;t.setDate(t.getDate()-e);let n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`,r=E.has(n);r&&D++,T+=`<div class="heatmap-cell" style="background-color: ${r?`var(--color-primary)`:`rgba(255,255,255,0.05)`};" title="${n}${r?` (Asistió)`:``}"></div>`}let O=y.slice(0,8).map(e=>`
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; background: rgba(16, 185, 129, 0.1); color: var(--color-success); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span class="material-icons-round" style="font-size: 16px;">login</span>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">Check-in</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">${o(e.fecha)}</div>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--color-success); font-weight: 600;">Acceso concedido</div>
            </div>
        `).join(``),k=n(),A=k&&k.role!==`Empleado`;if(i.innerHTML=`
            <!-- Navigation Header -->
            <div class="profile-nav" style="display: flex; align-items: center; margin-bottom: 24px; gap: 16px;">
                <button class="btn btn-outline" id="btnVolverSocios" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-secondary); padding: 8px 16px; border-radius: var(--border-radius-sm); font-weight: 600;">
                    <span class="material-icons-round" style="font-size: 18px; margin-right: 4px;">arrow_back</span> VOLVER
                </button>
                <div style="color: var(--color-text-secondary); font-size: 13px; font-weight: 600; letter-spacing: 1px;">
                    CLIENTES / <span style="color: var(--color-text-primary);">${r.nombre.toUpperCase()}</span>
                </div>
            </div>

            <!-- Top Header Card -->
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 24px; flex-wrap: wrap; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="width: 80px; height: 80px; background: rgba(148, 255, 0, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: var(--color-primary);">${r.nombre.substring(0,2).toUpperCase()}</div>
                    <div>
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${r.nombre.toUpperCase()}</h1>
                        <div style="display: flex; gap: 16px; color: var(--color-text-secondary); font-size: 13px; margin-top: 8px; align-items: center; flex-wrap: wrap;">
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">person</span> ${r.edad?r.edad+` años`:`-`}</span>
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">phone</span> ${r.telefono||`Sin teléfono`}</span>
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">calendar_today</span> Socio desde ${o(r.fechaRegistro)||``}</span>
                            <span class="status-badge ${r.estado===`Vencido`?`status-vencido`:w?`status-ausente`:`status-activo`}" style="padding: 2px 8px;">
                                ${r.estado===`Vencido`?`VENCIDO`:w?`AUSENTE`:`ACTIVO`}
                            </span>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-outline" id="btnDeudaProfile"><span class="material-icons-round" style="font-size:18px;">add</span> AÑADIR DEUDA</button>
                    <button class="btn btn-outline" id="btnVerQrProfile"><span class="material-icons-round" style="font-size:18px;">qr_code</span> VER QR</button>
                    ${A?`<button class="btn btn-outline danger" id="btnEliminarProfile" style="border-color: rgba(239, 68, 68, 0.2); color: var(--color-danger);"><span class="material-icons-round" style="font-size:18px;">delete</span> ELIMINAR</button>`:``}
                    <button class="btn btn-outline" id="btnRenovarProfile"><span class="material-icons-round" style="font-size:18px;">autorenew</span> RENOVAR PLAN</button>
                    <button class="btn btn-primary" id="btnCheckinProfile"><span class="material-icons-round" style="font-size:18px;">flash_on</span> CHECK-IN</button>
                </div>
            </div>

            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px;">
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">RACHA ACTUAL</div>
                    <div style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${S} <span style="font-size: 14px; font-weight: 500; color: var(--color-text-secondary);">días</span></div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">ASISTENCIAS TOTALES</div>
                    <div style="font-size: 28px; font-weight: 800;">${y.length}</div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">DÍAS COMO SOCIO</div>
                    <div style="font-size: 28px; font-weight: 800;">${m}</div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">ÚLTIMA VISITA</div>
                    <div style="font-size: 20px; font-weight: 800; margin-top: 8px;">${C}</div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                
                <!-- Left Column -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <!-- Plan Status -->
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">ESTADO DEL PLAN <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">Plan ${r.membresia} · $${(r.precio||0).toFixed(2)}</span></div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: var(--color-text-secondary); letter-spacing: 1px; margin-bottom: 8px;">
                            <span>INICIO · ${(o(r.fechaRegistro)||``).toUpperCase()}</span>
                            <span>VENCE · ${(o(r.fechaVencimiento)||``).toUpperCase()}</span>
                        </div>
                        
                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
                            <div style="height: 100%; width: ${_}%; background: ${_>=100?`var(--color-danger)`:`var(--color-primary)`}; border-radius: 3px; transition: width 0.5s ease;"></div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
                            <span style="${_>=100?`color: var(--color-danger);`:``}">${g>0?g+` días restantes`:`Plan Vencido`}</span>
                            <span style="color: var(--color-text-secondary); font-weight: 500;">${Math.floor(_)}% transcurrido</span>
                        </div>
                    </div>

                    <!-- Heatmap -->
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">ASISTENCIA · ÚLTIMOS 30 DÍAS <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">${D} días</span></div>
                        <div class="heatmap-grid">
                            ${T}
                        </div>
                    </div>
                </div>
                
                <!-- Right Column: Historial -->
                <div class="card" style="padding: 24px; min-height: 400px; display: flex; flex-direction: column;">
                    <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">HISTORIAL <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">${y.length} visitas</span></div>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; padding-right: 5px;">
                        ${y.length===0?`
                            <div style="text-align: center; color: var(--color-text-secondary); margin-top: 60px;">
                                <div style="font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px; font-size: 13px;">SIN ASISTENCIAS</div>
                                <div style="font-size: 12px;">Registra el primer check-in.</div>
                            </div>
                        `:O}
                    </div>
                </div>

            </div>
        `,document.getElementById(`btnVolverSocios`).addEventListener(`click`,()=>{i.style.display=`none`,document.getElementById(`sociosMainView`).style.display=`block`,v()}),document.getElementById(`btnCheckinProfile`).addEventListener(`click`,async()=>{await l(r.id,r.nombre),window.showToast(`Check-in registrado para ${r.nombre}`,`success`),x(t)}),A){let e=document.getElementById(`btnEliminarProfile`);e&&e.addEventListener(`click`,()=>{b(t,r.nombre)})}document.getElementById(`btnRenovarProfile`).addEventListener(`click`,async()=>{let n=s(r.membresia);await e(r.id,{fechaVencimiento:n,estado:`Activo`}),await a({tipo:`ingreso`,concepto:`Renovación Membresía ${r.membresia} - ${r.nombre}`,monto:r.precio}),window.showToast(`Plan renovado con éxito`,`success`),x(t)}),document.getElementById(`btnVerQrProfile`).addEventListener(`click`,()=>{let e=`
                <div class="modal-header">
                    <h3 class="modal-title">CÓDIGO QR - ${r.nombre.toUpperCase()}</h3>
                    <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                    <div id="qrcode-large-${r.id}" style="background: white; padding: 15px; border-radius: 8px;"></div>
                    <p style="margin-top: 20px; font-size: 14px; color: var(--color-text-secondary); text-align: center;">Este código permite el acceso automático por la cámara.</p>
                </div>
            `;window.openModal(e),setTimeout(()=>{window.QRCode&&new window.QRCode(document.getElementById(`qrcode-large-${r.id}`),{text:r.id,width:200,height:200,colorDark:`#000000`,colorLight:`#ffffff`,correctLevel:window.QRCode.CorrectLevel.H})},100)}),document.getElementById(`btnDeudaProfile`).addEventListener(`click`,()=>{window.showToast(`Función de AÑADIR DEUDA en desarrollo`,`info`)})}};export{f as init,d as render};