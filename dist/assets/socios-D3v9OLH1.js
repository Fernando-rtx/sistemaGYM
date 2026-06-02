var e=()=>`
        <div class="socios-header">
            <div class="filters">
                <input type="text" class="search-input" placeholder="🔍 Buscar socio...">
                <div class="status-filters">
                    <button class="filter-btn active" onclick="window.showToast('Filtro aplicado: TODOS', 'success')">TODOS (25)</button>
                    <button class="filter-btn text-success" onclick="window.showToast('Filtro aplicado: ACTIVOS', 'success')">ACTIVOS (18)</button>
                    <button class="filter-btn text-danger" onclick="window.showToast('Filtro aplicado: VENCIDOS', 'success')">VENCIDOS (7)</button>
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
                    <!-- Se llena con JS -->
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
        </style>
    `,t=()=>{localStorage.getItem(`gym_socios`)||localStorage.setItem(`gym_socios`,JSON.stringify([{id:`001`,nombre:`Carlos Mendoza`,membresia:`Mensual`,vencimiento:`18 May`,estado:`Vencido`},{id:`002`,nombre:`María Fernanda López`,membresia:`Mensual`,vencimiento:`09 Jun`,estado:`Activo`},{id:`003`,nombre:`Roberto Castillo`,membresia:`Anual`,vencimiento:`15 Dic`,estado:`Activo`},{id:`004`,nombre:`Miguel Vargas`,membresia:`Mensual`,vencimiento:`03 Jun`,estado:`Vencido`},{id:`005`,nombre:`Sofía Méndez`,membresia:`Quincenal`,vencimiento:`01 Jun`,estado:`Vencido`}]));let e=JSON.parse(localStorage.getItem(`gym_socios`)),t=`TODOS`,n=``,r=document.getElementById(`sociosTbody`),i=document.querySelector(`.search-input`),a=document.querySelectorAll(`.filter-btn`),o=()=>{if(!r)return;r.innerHTML=e.filter(e=>{let r=e.nombre.toLowerCase().includes(n.toLowerCase())||e.id.includes(n),i=t===`TODOS`||e.estado.toUpperCase()===t;return r&&i}).map(e=>`
            <tr>
                <td style="color: var(--color-text-secondary);">#${e.id}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <span class="avatar-sm">${e.nombre.substring(0,2).toUpperCase()}</span>
                        ${e.nombre}
                    </div>
                </td>
                <td>${e.membresia}</td>
                <td>${e.vencimiento}</td>
                <td>
                    <span class="status-badge ${e.estado===`Activo`?`status-activo`:`status-vencido`}">
                        ${e.estado.toUpperCase()}
                    </span>
                </td>
                <td>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="window.showToast('Check-in manual registrado para ${e.nombre}', 'success')">CHECK-IN</button>
                </td>
            </tr>
        `).join(``);let i=e.length,o=e.filter(e=>e.estado===`Activo`).length,s=e.filter(e=>e.estado===`Vencido`).length;a[0].textContent=`TODOS (${i})`,a[1].textContent=`ACTIVOS (${o})`,a[2].textContent=`VENCIDOS (${s})`};i&&i.addEventListener(`input`,e=>{n=e.target.value,o()}),a.forEach(e=>{e.removeAttribute(`onclick`),e.addEventListener(`click`,e=>{a.forEach(e=>e.classList.remove(`active`)),e.currentTarget.classList.add(`active`);let n=e.currentTarget.textContent;n.includes(`TODOS`)&&(t=`TODOS`),n.includes(`ACTIVOS`)&&(t=`ACTIVO`),n.includes(`VENCIDOS`)&&(t=`VENCIDO`),o()})}),o();let s=document.getElementById(`btnNuevoSocio`);s&&s.addEventListener(`click`,()=>{window.openModal(`
                <div class="modal-header">
                    <h3 class="modal-title">NUEVO SOCIO</h3>
                    <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
                </div>
                <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Nombres</label>
                    <input type="text" id="inpSocioNombre" class="form-input" placeholder="Nombres del socio" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box;">
                </div>
                <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Plan de Membresía</label>
                    <div style="display: flex; gap: 10px; margin-top: 5px;">
                        <div class="plan-card selected" data-plan="Mensual" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s;">
                            <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 600;">PLAN MENSUAL</div>
                            <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$20.00</div>
                        </div>
                        <div class="plan-card" data-plan="Quincenal" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                            <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">PLAN QUINCENAL</div>
                            <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$10.00</div>
                        </div>
                        <div class="plan-card" data-plan="Diario" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                            <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">PLAN DIARIO</div>
                            <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$3.00</div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                    <button class="btn btn-primary" id="btnGuardarSocio" style="flex: 1; justify-content: center;">REGISTRAR</button>
                </div>
            `);let t=`Mensual`,n=document.querySelectorAll(`.plan-card`);n.forEach(e=>{e.addEventListener(`click`,function(){n.forEach(e=>{e.classList.remove(`selected`),e.style.border=`1px solid rgba(255,255,255,0.1)`,e.style.backgroundColor=`transparent`,e.style.opacity=`0.5`,e.querySelector(`.plan-name`).style.color=`var(--color-text-secondary)`,e.querySelector(`.plan-price`).style.color=`var(--color-text-primary)`}),this.classList.add(`selected`),this.style.border=`2px solid var(--color-primary)`,this.style.backgroundColor=`rgba(148, 255, 0, 0.05)`,this.style.opacity=`1`,this.querySelector(`.plan-name`).style.color=`var(--color-primary)`,this.querySelector(`.plan-price`).style.color=`var(--color-primary)`,t=this.getAttribute(`data-plan`)})}),document.getElementById(`btnGuardarSocio`).addEventListener(`click`,()=>{let n=document.getElementById(`inpSocioNombre`).value||`Nuevo Socio`,r=String(e.length+1).padStart(3,`0`);e.unshift({id:r,nombre:n,membresia:t,vencimiento:`Próximo mes`,estado:`Activo`}),localStorage.setItem(`gym_socios`,JSON.stringify(e)),o(),window.closeModal(),window.showToast(`Socio registrado con éxito`,`success`)})})};export{t as init,e as render};