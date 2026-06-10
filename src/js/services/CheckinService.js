import { supabase } from '../supabaseClient.js';
import { Checkin } from '../models/Checkin.js';
import { BaseService } from '../core/BaseService.js';
import { toDateStr } from '../utils/dateUtils.js';

export class CheckinService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
    }

    async getAll() {
        const { data, error } = await supabase.from('checkins').select(`*, socios(nombre)`).order('created_at', { ascending: false });
        if (error) return this.handleError(error, []);
        return data.map(c => Checkin.fromSupabase(c));
    }

    async getHoy() {
        const hoyStr = this.today();
        const { data, error } = await supabase.from('checkins').select(`*, socios(nombre)`).eq('fecha', hoyStr);
        if (error) return this.handleError(error, []);
        return data.map(c => Checkin.fromSupabase(c));
    }

    async registrar(socioId, nombre) {
        const d = new Date();
        const fecha = toDateStr(d);
        const hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

        const insertData = { socio_id: socioId, fecha, hora };
        const { data, error } = await supabase.from('checkins').insert([insertData]).select().single();
        if (error) return this.handleError(error, null);

        const newCheckin = Checkin.fromSupabase({ ...data, nombre_socio: nombre });
        this.emit('checkin:created', newCheckin);
        return newCheckin;
    }

    async calcularRachas(checkinsList = null) {
        const checkins = checkinsList || await this.getAll();
        const socioMap = {};

        checkins.forEach(c => {
            if (!socioMap[c.socioId]) {
                socioMap[c.socioId] = { nombre: c.nombreSocio, fechas: new Set() };
            }
            socioMap[c.socioId].fechas.add(c.fecha);
        });

        const rachas = [];
        const hoyStr = this.today();

        Object.keys(socioMap).forEach(socioId => {
            const { nombre, fechas } = socioMap[socioId];
            const sortedDates = [...fechas].sort().reverse();

            let racha = 0;
            const hoy = new Date(hoyStr + "T00:00:00");

            for (let i = 0; i < sortedDates.length; i++) {
                const expected = new Date(hoy);
                expected.setDate(expected.getDate() - i);
                const expectedStr = toDateStr(expected);

                if (sortedDates.includes(expectedStr)) {
                    racha++;
                } else {
                    break;
                }
            }

            if (racha > 0) {
                rachas.push({ socioId, nombre, racha });
            }
        });

        return rachas.sort((a, b) => b.racha - a.racha).slice(0, 5);
    }

    esAusente(socio, checkins) {
        return this.calcularDiasAusente(socio, checkins) > 5;
    }

    calcularDiasAusente(socio, checkins) {
        const socioCheckins = checkins.filter(c => c.socioId === socio.id);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (socioCheckins.length > 0) {
            const times = socioCheckins.map(c => new Date(c.fecha + "T00:00:00").getTime());
            const latestCheckinDate = new Date(Math.max(...times));
            latestCheckinDate.setHours(0, 0, 0, 0);
            return Math.floor((hoy - latestCheckinDate) / (1000 * 60 * 60 * 24));
        } else {
            const regDate = new Date((socio.fechaRegistro || hoy.toISOString().split('T')[0]) + "T00:00:00");
            regDate.setHours(0, 0, 0, 0);
            return Math.floor((hoy - regDate) / (1000 * 60 * 60 * 24));
        }
    }
}
