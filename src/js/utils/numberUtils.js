export function formatMoney(amount) {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
}

export function parseMoney(value) {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
}

export function safeInt(value) {
    const n = parseInt(value);
    return isNaN(n) ? 0 : n;
}
