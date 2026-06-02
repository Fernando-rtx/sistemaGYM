import{C as e,_ as t,a as n,b as r,d as i,g as a,h as o,i as s,m as c,o as l,u,x as d}from"./index-DcmvT0CB.js";var f=()=>`
        <div class="dashboard-grid-premium" id="dashboardContainer">
            <!-- Rendered in JS -->
        </div>

        <style>
            .dashboard-grid-premium {
                display: flex;
                flex-direction: column;
                gap: 24px;
                padding-bottom: 24px;
            }
            .card {
                background: var(--color-bg-base);
                border: 1px solid rgba(255,255,255,0.03);
                border-radius: var(--border-radius-lg);
            }
            /* Custom Scrollbar for Alerts */
            .alerts-container::-webkit-scrollbar {
                width: 6px;
            }
            .alerts-container::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.1); 
            }
            .alerts-container::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.1); 
                border-radius: 4px;
            }
            .alerts-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.2); 
            }
            
            /* Responsive adjust */
            @media (max-width: 1024px) {
                .top-row { grid-template-columns: 1fr !important; }
                .bottom-row { grid-template-columns: 1fr !important; }
            }
        </style>
    `,p=async()=>{let e=await o(),s=await a();await c();let l=await i(),f=await u(),p=await t(),h=await n();await r();let g=await d(3),_=s.filter(e=>e.estado===`Activo`).length,v=s.filter(e=>e.estado===`Vencido`),y=new Date,b=s.filter(e=>{if(e.estado===`Vencido`)return!1;let t=f.filter(t=>t.socioId===e.id),n=999;if(t.length>0)n=(y-new Date(t[0].fecha+`T00:00:00`))/(1e3*60*60*24);else{let t=e.fechaRegistro?e.fechaRegistro:y.toISOString().split(`T`)[0];n=(y-new Date(t+`T00:00:00`))/(1e3*60*60*24)}return n>5}),x=y.getMonth(),S=y.getFullYear(),C=p.filter(e=>{if(e.tipo!==`ingreso`)return!1;let t=new Date(e.fecha+`T00:00:00`);return t.getMonth()===x&&t.getFullYear()===S}).reduce((e,t)=>e+t.monto,0).toFixed(2),w=h.length>0?h[0].racha:0,T=y.toLocaleDateString(`es-ES`,{day:`numeric`,month:`short`,year:`numeric`}).toUpperCase(),E=[...v.map(e=>({...e,alertType:`Vencido`})),...g.map(e=>({...e,alertType:`PorRenovar`}))];E.sort((e,t)=>new Date(e.fechaVencimiento+`T00:00:00`)-new Date(t.fechaVencimiento+`T00:00:00`));let D=E.length>0?E.map(e=>{let t=new Date((e.fechaVencimiento||y.toISOString().split(`T`)[0])+`T00:00:00`),n=Math.floor((y-t)/(1e3*60*60*24)),r=n>0?`Venció hace ${n} días`:n<0?`Vence en ${Math.abs(n)} días`:`Vence hoy`,i=e.alertType===`Vencido`?`color: var(--color-danger); border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.05);`:`color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.05);`,a=e.telefono?e.telefono.replace(/[^0-9]/g,``):``,o=a?`https://wa.me/${a}?text=${encodeURIComponent(`Hola `+e.nombre+`, te contactamos de NEXFIT.

Notamos que tu membresía `+r.toLowerCase()+`. ¡Te invitamos a renovar para seguir entrenando juntos!`)}`:`#`;return`
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.02); gap: 10px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 44px; height: 44px; background: rgba(148, 255, 0, 0.1); color: var(--color-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0;">${e.nombre.substring(0,2).toUpperCase()}</div>
                <div>
                    <div style="font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">${e.nombre}</div>
                    <div style="color: var(--color-text-secondary); font-size: 12px; margin-top: 4px;">${r} · Plan ${e.membresia}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="${i} font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 12px; display: flex; align-items: center; gap: 4px; letter-spacing: 1px;">
                    <span style="font-size: 8px;">●</span> ${e.alertType===`Vencido`?`VENCIDO`:`POR RENOVAR`}
                </div>
                <a href="${o}" target="${a?`_blank`:`_self`}" title="${a?`Enviar WhatsApp`:`Sin número`}" class="btn btn-outline" style="padding: 8px; border-radius: 8px; color: var(--color-text-primary); border-color: rgba(255,255,255,0.1); ${a?``:`opacity: 0.3; pointer-events: none;`}">
                    <span class="material-icons-round" style="font-size: 18px;">chat</span>
                </a>
                <button class="btn btn-primary btn-renovar" data-socio-id="${e.id}" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: 1px;">RENOVAR</button>
            </div>
        </div>`}).join(``):`<div style="padding: 40px; text-align: center; color: var(--color-text-secondary); font-size: 14px;">🎉 No hay alertas de renovación pendientes. Todo al día.</div>`,O=h.length>0?h.slice(0,5).map((e,t)=>`
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.02);">
            <div style="display: flex; align-items: center; gap: 20px;">
                <div style="font-size: 20px; font-weight: 900; color: var(--color-primary); width: 24px; text-align: center;">${t+1}</div>
                <div>
                    <div style="font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">${e.nombre}</div>
                    <div style="color: var(--color-text-secondary); font-size: 12px; margin-top: 4px;">Plan ${s.find(t=>t.id===e.socioId)?.membresia||``}</div>
                </div>
            </div>
            <div style="color: var(--color-primary); font-weight: 800; font-size: 15px;">
                🔥 ${e.racha}
            </div>
        </div>
    `).join(``):`<div style="padding: 20px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">Sin rachas. ¡Invita a tus socios a entrenar!</div>`,k=document.getElementById(`dashboardContainer`);k&&(k.innerHTML=`
            <div class="top-row" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;">
                <!-- Panel de Control Principal -->
                <div class="main-panel card" style="background: linear-gradient(135deg, rgba(148, 255, 0, 0.03) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(148, 255, 0, 0.1); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
                    <!-- Decorativo -->
                    <div style="position: absolute; top: -50%; left: -10%; width: 50%; height: 200%; background: radial-gradient(circle, rgba(148, 255, 0, 0.05) 0%, rgba(0,0,0,0) 70%); pointer-events: none;"></div>
                    
                    <div style="padding: 24px; position: relative; z-index: 1;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--color-primary); letter-spacing: 2px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 6px; height: 6px; background: var(--color-primary); border-radius: 50%; box-shadow: 0 0 8px var(--color-primary);"></span>
                            PANEL DE CONTROL · ${T}
                        </div>
                        <h1 style="color: var(--color-primary); font-size: 36px; font-weight: 900; margin: 0 0 16px 0; letter-spacing: -1px; text-shadow: 0 0 20px rgba(148,255,0,0.2);">${e.brandName.toUpperCase()}</h1>
                        <p style="color: var(--color-text-secondary); font-size: 14px; line-height: 1.6; max-width: 450px; margin: 0;">Resumen operativo del gimnasio. Atiende renovaciones, registra asistencias y mantén el ritmo en una sola vista.</p>
                    </div>
                    
                    <div style="display: flex; gap: 32px; padding: 24px; border-top: 1px solid rgba(255,255,255,0.03); background: rgba(0,0,0,0.2); position: relative; z-index: 1; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">CHECK-INS HOY</div>
                            <div style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${l.length}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">SOCIOS TOTALES</div>
                            <div style="font-size: 28px; font-weight: 800;">${s.length}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">INGRESOS DEL MES</div>
                            <div style="font-size: 28px; font-weight: 800;">$${C}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">RACHA RÉCORD</div>
                            <div style="font-size: 28px; font-weight: 800;">${w} <span style="font-size:12px; font-weight:600; color:var(--color-text-secondary);">DÍAS</span></div>
                        </div>
                    </div>
                </div>

                <!-- Metric Cards 2x2 -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="card" style="border-left: 4px solid var(--color-success); padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">bolt</span> ACTIVOS</div>
                        <div style="font-size: 36px; font-weight: 800; color: var(--color-success); margin: 8px 0 4px 0;">${_}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">de ${s.length} socios</div>
                    </div>
                    <div class="card" style="border-left: 4px solid #f59e0b; padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">notifications</span> POR RENOVAR</div>
                        <div style="font-size: 36px; font-weight: 800; color: #f59e0b; margin: 8px 0 4px 0;">${g.length}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">≤ 3 días para vencer</div>
                    </div>
                    <div class="card" style="border-left: 4px solid var(--color-danger); padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">schedule</span> VENCIDOS</div>
                        <div style="font-size: 36px; font-weight: 800; color: var(--color-danger); margin: 8px 0 4px 0;">${v.length}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">requieren acción</div>
                    </div>
                    <div class="card" style="border-left: 4px solid #6b7280; padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">person_off</span> AUSENTES</div>
                        <div style="font-size: 36px; font-weight: 800; color: #9ca3af; margin: 8px 0 4px 0;">${b.length}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">+5 días sin asistir</div>
                    </div>
                </div>
            </div>

            <!-- Bottom Row 2:1 -->
            <div class="bottom-row" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;">
                <!-- Alertas de Renovación -->
                <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px;">ALERTAS DE RENOVACIÓN <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">${E.length} pendientes</span></div>
                        <button class="btn btn-outline" style="font-size:11px; padding: 6px 12px; letter-spacing:1px; border-radius: 6px; font-weight: 700;">VER TODOS</button>
                    </div>
                    <div class="alerts-container" style="display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 520px; padding-right: 8px;">
                        ${D}
                    </div>
                </div>

                <!-- Right Column: Asistencia y Rachas -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 24px;">ASISTENCIA SEMANAL <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">últimos 7 días</span></div>
                        <div style="height: 180px; width: 100%;">
                            <canvas id="weeklyChart"></canvas>
                        </div>
                    </div>
                    <div class="card" style="padding: 24px; flex: 1;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 24px;">TOP RACHAS <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">consecutivos</span></div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${O}
                        </div>
                    </div>
                </div>
            </div>
        `);let A=f,j=document.getElementById(`weeklyChart`);if(j&&window.Chart){let e=[],t=[],n=0,r=-1;for(let i=6;i>=0;i--){let a=new Date;a.setDate(a.getDate()-i);let o=`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,`0`)}-${String(a.getDate()).padStart(2,`0`)}`,s=a.toLocaleDateString(`es-ES`,{weekday:`short`}).toUpperCase();e.push(s);let c=A.filter(e=>e.fecha===o).length;t.push(c),c>=r&&(r=c,n=6-i)}r===0&&(n=6);let i=t.map((e,t)=>t===n?`#94ff00`:`rgba(255,255,255,0.1)`);new window.Chart(j,{type:`bar`,data:{labels:e,datasets:[{label:`Check-ins`,data:t,backgroundColor:i,borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{display:!1,beginAtZero:!0},x:{grid:{display:!1},ticks:{color:`#aaa`,font:{size:10,weight:`bold`}},border:{display:!1}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:`#1e1e1e`,titleColor:`#fff`,bodyColor:`#94ff00`,displayColors:!1,cornerRadius:8,padding:10}}}})}document.querySelectorAll(`.btn-renovar`).forEach(e=>{e.addEventListener(`click`,()=>{m(e.getAttribute(`data-socio-id`))})})};async function m(t){let n=(await a()).find(e=>e.id===t);if(!n)return;let r=(await o()).precios||{Mensual:20,Quincenal:10,Diario:3},i=`
        <div class="modal-header">
            <h3 class="modal-title">RENOVAR MEMBRESÍA</h3>
            <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: rgba(148,255,0,0.1); color: var(--color-primary); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; margin-bottom: 10px;">${n.nombre.substring(0,2).toUpperCase()}</div>
            <h3 style="font-size: 18px; font-weight: 800;">${n.nombre}</h3>
            <p style="color: var(--color-text-secondary); font-size: 13px;">Plan actual: ${n.membresia}</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <div class="plan-card selected" data-plan="Mensual" data-precio="${r.Mensual}" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 800;">MENSUAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$${r.Mensual.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Quincenal" data-precio="${r.Quincenal}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 800;">QUINCENAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${r.Quincenal.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Diario" data-precio="${r.Diario}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 800;">DIARIO</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${r.Diario.toFixed(2)}</div>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
            <button class="btn btn-primary" id="btnConfirmarRenovar" style="flex: 1; justify-content: center;">RENOVAR</button>
        </div>
    `;window.openModal(i);let c=`Mensual`,u=r.Mensual,d=document.querySelectorAll(`.plan-card`);d.forEach(e=>{e.addEventListener(`click`,function(){d.forEach(e=>{e.classList.remove(`selected`),e.style.border=`1px solid rgba(255,255,255,0.1)`,e.style.backgroundColor=`transparent`,e.style.opacity=`0.5`,e.querySelector(`.plan-name`).style.color=`var(--color-text-secondary)`,e.querySelector(`.plan-price`).style.color=`var(--color-text-primary)`}),this.classList.add(`selected`),this.style.border=`2px solid var(--color-primary)`,this.style.backgroundColor=`rgba(148, 255, 0, 0.05)`,this.style.opacity=`1`,this.querySelector(`.plan-name`).style.color=`var(--color-primary)`,this.querySelector(`.plan-price`).style.color=`var(--color-primary)`,c=this.getAttribute(`data-plan`),u=parseFloat(this.getAttribute(`data-precio`))})}),document.getElementById(`btnConfirmarRenovar`).addEventListener(`click`,async()=>{let r=l(c);await e(t,{membresia:c,precio:u,fechaVencimiento:r,estado:`Activo`}),await s({tipo:`ingreso`,concepto:`Renovación ${c} - ${n.nombre}`,monto:u}),window.closeModal(),window.showToast(`Membresía de ${n.nombre} renovada con éxito`,`success`),await p()})}export{p as init,f as render};