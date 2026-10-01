export function formatMoney(amount) {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
}

export function parseMoney(value) {
    if (typeof value !== 'number' && typeof value !== 'string') {
        console.warn('parseMoney: non-numeric type', typeof value, value);
    }
    const n = parseFloat(value);
    if (!isFinite(n)) {
        console.warn('parseMoney: value is not finite', value);
        return 0;
    }
    return isNaN(n) ? 0 : n;
}

export function safeInt(value) {
    const n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
}
