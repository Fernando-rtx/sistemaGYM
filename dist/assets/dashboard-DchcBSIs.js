import{a as e,c as t,d as n,g as r,h as i,i as a,l as o,m as s,r as c,s as l,u}from"./index-BBDbYyKX.js";var d=()=>`
        <div class="dashboard-grid">
            <div class="stats-cards">
                <div class="card stat-card">
                    <h3>INGRESOS HOY</h3>
                    <div class="stat-value" id="dashIngresos">$0.00</div>
                    <div class="stat-trend" id="dashIngresosTrend">Actualizado hoy</div>
                </div>
                <div class="card stat-card">
                    <h3>SOCIOS ACTIVOS</h3>
                    <div class="stat-value" id="dashActivos">0</div>
                    <div class="stat-trend success" id="dashNuevos">+0 nuevos hoy</div>
                </div>
                <div class="card stat-card">
                    <h3>POR VENCER (7D)</h3>
                    <div class="stat-value" id="dashVencer">0</div>
                    <div class="stat-trend danger">Requiere atención</div>
                </div>
            </div>

            <div class="dashboard-main">
                <div class="card">
                    <div class="card-header">
                        <h3>ALERTAS DE RENOVACIÓN</h3>
                        <span id="alertCount" style="font-size: 13px; color: var(--color-text-secondary);"></span>
                    </div>
                    <div class="alerts-list" id="alertsList">
                        <!-- Generado en JS -->
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3>TOP RACHAS (ASISTENCIA)</h3>
                    </div>
                    <div class="streaks-list" id="streaksList">
                        <!-- Generado en JS -->
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>CHECK-INS HOY</h3>
                    <span id="checkinCount" style="font-size: 13px; color: var(--color-text-secondary);"></span>
                </div>
                <div id="checkinsList" style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <!-- Generado en JS -->
                </div>
            </div>
        </div>

        <style>
            .dashboard-grid {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            .stats-cards {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
            }
            .stat-card {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .stat-card h3 {
                font-size: 14px;
                color: var(--color-text-secondary);
                letter-spacing: 1px;
            }
            .stat-value {
                font-size: 36px;
                font-weight: 700;
                color: var(--color-text-primary);
            }
            .stat-trend {
                font-size: 13px;
                font-weight: 500;
                color: var(--color-text-secondary);
            }
            .success { color: var(--color-success); }
            .danger { color: var(--color-danger); }
            
            .dashboard-main {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 24px;
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            .alerts-list, .streaks-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .alert-item {
                display: flex;
                align-items: center;
                gap: 16px;
                background-color: var(--color-bg-base);
                padding: 12px;
                border-radius: var(--border-radius-sm);
            }
            .alert-avatar {
                width: 40px; height: 40px;
                background-color: var(--color-bg-surface-hover);
                color: var(--color-text-primary);
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-weight: 600; font-size: 13px; flex-shrink: 0;
            }
            .alert-info { flex: 1; }
            .alert-info h4 { font-size: 15px; margin-bottom: 4px; }
            .alert-info span { font-size: 13px; color: var(--color-text-secondary); }
            
            .streak-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background-color: var(--color-bg-base);
                border-radius: var(--border-radius-sm);
                font-weight: 500;
            }
            .streak-count {
                color: var(--color-primary);
            }
            .checkin-chip {
                background-color: var(--color-bg-base);
                padding: 8px 14px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 500;
                display: flex; align-items: center; gap: 8px;
            }
            .checkin-chip .material-icons-round { font-size: 16px; color: var(--color-success); }
        </style>
    `,f=()=>{let e=n(),r=o(),c=t(),u=a(),d=s(),f=i(7),m=e.filter(e=>e.estado===`Activo`).length,h=e.filter(e=>e.estado===`Vencido`),g=document.getElementById(`dashIngresos`),_=document.getElementById(`dashActivos`),v=document.getElementById(`dashVencer`),y=document.getElementById(`dashNuevos`),b=document.getElementById(`dashIngresosTrend`);g&&(g.textContent=`$`+r.ingresos.toFixed(2)),_&&(_.textContent=m),v&&(v.textContent=h.length+f.length),y&&(y.textContent=`+${d} nuevos hoy`,y.className=d>0?`stat-trend success`:`stat-trend`),b&&r.numTransacciones>0&&(b.textContent=`${r.numTransacciones} transacciones hoy`,b.className=`stat-trend success`);let x=document.getElementById(`alertsList`),S=document.getElementById(`alertCount`),C=[...h,...f];S&&(S.textContent=`${C.length} alertas`),x&&C.length>0?(x.innerHTML=C.slice(0,5).map(e=>`
            <div class="alert-item">
                <div class="alert-avatar">${e.nombre.substring(0,2).toUpperCase()}</div>
                <div class="alert-info">
                    <h4>${e.nombre}</h4>
                    <span>${e.estado===`Vencido`?`❌ Vencido: `:`⚠️ Vence: `}${l(e.fechaVencimiento)}</span>
                </div>
                <button class="btn btn-primary btn-renovar" data-socio-id="${e.id}" style="padding: 5px 15px;">Renovar</button>
            </div>
        `).join(``),document.querySelectorAll(`.btn-renovar`).forEach(e=>{e.addEventListener(`click`,()=>{p(e.getAttribute(`data-socio-id`))})})):x&&(x.innerHTML=`<div style="padding: 20px; text-align: center; color: var(--color-text-secondary);">🎉 No hay alertas pendientes.</div>`);let w=document.getElementById(`streaksList`);w&&(u.length>0?w.innerHTML=u.map((e,t)=>`
                <div class="streak-item">
                    <span>${t+1}. ${e.nombre}</span>
                    <div class="streak-count">🔥 ${e.racha} días</div>
                </div>
            `).join(``):w.innerHTML=`<div style="padding: 20px; text-align: center; color: var(--color-text-secondary);">Sin datos de asistencia aún. Registra check-ins para ver rachas.</div>`);let T=document.getElementById(`checkinsList`),E=document.getElementById(`checkinCount`);E&&(E.textContent=`${c.length} ingresos`),T&&(c.length>0?T.innerHTML=c.slice(0,10).map(e=>`
                <div class="checkin-chip">
                    <span class="material-icons-round">check_circle</span>
                    ${e.nombre} <span style="color: var(--color-text-secondary); font-size: 12px;">${e.hora}</span>
                </div>
            `).join(``):T.innerHTML=`<div style="padding: 20px; text-align: center; color: var(--color-text-secondary); width: 100%;">Ningún ingreso registrado hoy.</div>`)};function p(t){let i=n().find(e=>e.id===t);if(!i)return;let a=u().precios||{Mensual:20,Quincenal:10,Diario:3},o=`
        <div class="modal-header">
            <h3 class="modal-title">RENOVAR MEMBRESÍA</h3>
            <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: var(--color-bg-base); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; margin-bottom: 10px;">${i.nombre.substring(0,2).toUpperCase()}</div>
            <h3 style="font-size: 18px;">${i.nombre}</h3>
            <p style="color: var(--color-text-secondary); font-size: 13px;">Plan actual: ${i.membresia}</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <div class="plan-card selected" data-plan="Mensual" data-precio="${a.Mensual}" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 600;">MENSUAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$${a.Mensual.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Quincenal" data-precio="${a.Quincenal}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">QUINCENAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${a.Quincenal.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Diario" data-precio="${a.Diario}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">DIARIO</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${a.Diario.toFixed(2)}</div>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
            <button class="btn btn-primary" id="btnConfirmarRenovar" style="flex: 1; justify-content: center;">RENOVAR</button>
        </div>
    `;window.openModal(o);let s=`Mensual`,l=a.Mensual,d=document.querySelectorAll(`.plan-card`);d.forEach(e=>{e.addEventListener(`click`,function(){d.forEach(e=>{e.classList.remove(`selected`),e.style.border=`1px solid rgba(255,255,255,0.1)`,e.style.backgroundColor=`transparent`,e.style.opacity=`0.5`,e.querySelector(`.plan-name`).style.color=`var(--color-text-secondary)`,e.querySelector(`.plan-price`).style.color=`var(--color-text-primary)`}),this.classList.add(`selected`),this.style.border=`2px solid var(--color-primary)`,this.style.backgroundColor=`rgba(148, 255, 0, 0.05)`,this.style.opacity=`1`,this.querySelector(`.plan-name`).style.color=`var(--color-primary)`,this.querySelector(`.plan-price`).style.color=`var(--color-primary)`,s=this.getAttribute(`data-plan`),l=parseFloat(this.getAttribute(`data-precio`))})}),document.getElementById(`btnConfirmarRenovar`).addEventListener(`click`,()=>{let n=e(s);r(t,{membresia:s,precio:l,fechaVencimiento:n,estado:`Activo`}),c({tipo:`ingreso`,concepto:`Renovación ${s} - ${i.nombre}`,monto:l}),window.closeModal(),window.showToast(`Membresía de ${i.nombre} renovada con éxito`,`success`),f()})}export{f as init,d as render};