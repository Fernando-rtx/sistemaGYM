import { createDemoData } from './demoSeed.js';

const KEY = 'sistemaGYM-original-demo-v2';
const tables = ['socios', 'checkins', 'inventario', 'transacciones', 'ajustes', 'historial_renovaciones', 'cortes_caja'];
function load() {
    try {
        const saved = JSON.parse(localStorage.getItem(KEY));
        if (saved && tables.every(name => Array.isArray(saved[name]))) return saved;
    } catch { /* Start from a fresh demo when storage is unavailable or corrupt. */ }
    return createDemoData();
}
let state = load();

export function resetDemo() {
    state = createDemoData();
    try { localStorage.removeItem(KEY); } catch { /* Reset also works in memory. */ }
}

// Implements the existing services' query interface entirely in the browser.
// No URLs, tokens, network clients or production data are used.
class LocalQuery {
    constructor(table) {
        this.table = table;
        this.filters = [];
        this.operation = 'read';
        this.selection = '*';
        this.options = {};
        this.window = null;
        this.sort = null;
        this.resultShape = 'many';
    }
    select(selection = '*', options = {}) { this.selection = selection; this.options = options; return this; }
    eq(field, value) { this.filters.push(row => row[field] === value); return this; }
    lt(field, value) { this.filters.push(row => row[field] < value); return this; }
    gte(field, value) { this.filters.push(row => row[field] >= value); return this; }
    lte(field, value) { this.filters.push(row => row[field] <= value); return this; }
    order(field, {ascending = true} = {}) { this.sort = {field, ascending}; return this; }
    range(start, end) { this.window = [start, end + 1]; return this; }
    limit(count) { this.window = [0, count]; return this; }
    single() { this.resultShape = 'single'; return this; }
    maybeSingle() { this.resultShape = 'optional'; return this; }
    insert(rows) { this.operation = 'insert'; this.changes = Array.isArray(rows) ? rows : [rows]; return this; }
    upsert(rows) { this.operation = 'upsert'; this.changes = Array.isArray(rows) ? rows : [rows]; return this; }
    update(changes) { this.operation = 'update'; this.changes = changes; return this; }
    delete() { this.operation = 'delete'; return this; }
    then(resolve, reject) {
        this.resultPromise ??= Promise.resolve().then(() => this.execute());
        return this.resultPromise.then(resolve, reject);
    }
    execute() {
        if (!tables.includes(this.table)) return {data: null, count: 0, error: {message: 'Sección de demo desconocida'}};
        const snapshot = this.operation === 'read' ? null : structuredClone(state);
        try {
            let rows = state[this.table].filter(row => this.filters.every(match => match(row)));
            if (this.operation === 'insert' || this.operation === 'upsert') {
                rows = this.changes.map(changes => {
                    const current = this.operation === 'upsert' && state[this.table].find(row => row.id === changes.id);
                    if (current) { Object.assign(current, changes); return current; }
                    const row = {id: crypto.randomUUID(), created_at: new Date().toISOString(),
                        ...(this.table === 'socios' ? {activo: true} : {}), ...changes};
                    state[this.table].push(row);
                    return row;
                });
            } else if (this.operation === 'update') {
                rows.forEach(row => Object.assign(row, this.changes));
            } else if (this.operation === 'delete') {
                const removed = new Set(rows);
                state[this.table] = state[this.table].filter(row => !removed.has(row));
            }
            if (this.operation !== 'read') {
                // A failed write rolls back instead of reporting a change that was not saved.
                localStorage.setItem(KEY, JSON.stringify(state));
            }
            const count = rows.length;
            if (this.sort) {
                const {field, ascending} = this.sort;
                rows = [...rows].sort((a, b) => a[field] === b[field] ? 0 :
                    ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1) * (ascending ? 1 : -1));
            }
            if (this.window) rows = rows.slice(...this.window);
            rows = rows.map(row => this.table === 'checkins' && this.selection.includes('socios(')
                ? {...row, socios: {nombre: state.socios.find(s => s.id === row.socio_id)?.nombre || 'Socio de ejemplo'}}
                : {...row});
            if (this.resultShape === 'single' && rows.length !== 1) {
                return {data: null, count, error: {message: 'No se encontró el registro de ejemplo'}};
            }
            if (this.resultShape === 'optional' && rows.length > 1) {
                return {data: null, count, error: {message: 'Hay más de un registro de ejemplo'}};
            }
            const data = this.options.head ? null : this.resultShape === 'many' ? rows : rows[0] || null;
            return {data: structuredClone(data), count, error: null};
        } catch {
            if (snapshot) state = snapshot;
            return {data: null, count: 0, error: {message: 'No se pudieron guardar los cambios. Revisa el espacio disponible o permite el almacenamiento del sitio.'}};
        }
    }
}

export const demoStore = {from: table => new LocalQuery(table)};
