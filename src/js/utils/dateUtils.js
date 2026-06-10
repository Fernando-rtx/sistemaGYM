export function todayStr() {
    return new Date().toISOString().split('T')[0];
}

const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function formatDate(dateStr) {
    if (dateStr == null || dateStr === 'Próximo mes') return dateStr || '';
    if (typeof dateStr !== 'string') return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parseInt(parts[2])} ${meses[parseInt(parts[1]) - 1]}`;
}

export function toDateStr(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) {
        console.warn('toDateStr: invalid date', d);
        return '';
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getMonthRange(mes, anio) {
    const startStr = `${anio}-${String(mes).padStart(2, '0')}-01`;
    const end = new Date(Date.UTC(anio, mes, 0, 12));
    const endStr = `${anio}-${String(mes).padStart(2, '0')}-${String(end.getUTCDate()).padStart(2, '0')}`;
    return { startStr, endStr };
}

export function getLastNMonths(n = 6) {
    const months = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = `${meses[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
        months.push({ key, label, mes: d.getMonth() + 1, anio: d.getFullYear() });
    }
    return months;
}
