const PLANES = [
    { key: 'Diario', label: 'Diario', days: 1, icon: 'today' },
    { key: 'Quincenal', label: 'Quincenal', days: 15, icon: 'calendar_view_week' },
    { key: 'Mensual', label: 'Mensual', days: 30, icon: 'calendar_month' }
];

export function getPlanes() {
    return PLANES;
}

export function calcularVencimiento(planKey) {
    const plan = PLANES.find(p => p.key === planKey);
    if (!plan) return null;
    const d = new Date();
    d.setDate(d.getDate() + plan.days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function renderPlanCards(precios = {}) {
    return PLANES.map(p => {
        const precio = precios[p.key] || 0;
        return `
            <div class="plan-card-ns" data-plan="${p.key}" data-precio="${precio}" data-dias="${p.days}"
                 style="border:2px solid rgba(255,255,255,0.1); border-radius:var(--border-radius-md); padding:16px; text-align:center; cursor:pointer; transition:all 0.2s; background:transparent;">
                <span class="material-icons-round" style="font-size:32px; color:var(--color-primary); margin-bottom:8px;">${p.icon}</span>
                <div style="font-weight:600; margin-bottom:4px;">${p.label}</div>
                <div style="font-size:18px; font-weight:700; color:var(--color-primary);">$${precio.toFixed(2)}</div>
                <div style="font-size:11px; color:var(--color-text-secondary); margin-top:4px;">${p.days} días</div>
            </div>
        `;
    }).join('');
}

export function setupPlanSelector(container, onSelect, precios = {}) {
    const cards = container.querySelectorAll('.plan-card-ns');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => {
                c.style.border = '2px solid rgba(255,255,255,0.1)';
                c.style.background = 'transparent';
                c.style.opacity = '0.6';
            });
            card.style.border = `2px solid var(--color-primary)`;
            card.style.background = `color-mix(in srgb, var(--color-primary) 15%, transparent)`;
            card.style.opacity = '1';
            const plan = card.dataset.plan;
            const precio = parseFloat(card.dataset.precio || 0);
            onSelect({ plan, precio, dias: parseInt(card.dataset.dias) });
        });
    });
}
