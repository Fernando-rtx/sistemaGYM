export function generateWhatsAppLink(phone, message) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function buildRenewalReminder(socio, gymName = 'NEXFIT') {
    return `Hola ${socio.nombre}! 🏋️ Te recordamos que tu membresía en ${gymName} está por vencer el ${socio.fechaVencimiento}. ¡Renueva ahora y sigue entrenando! 💪`;
}

export function buildCheckinTicket(socio, gymName = 'NEXFIT') {
    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return `✅ CHECK-IN ${gymName}\nSocio: ${socio.nombre}\nPlan: ${socio.membresia}\nVence: ${socio.fechaVencimiento}\nHora: ${hora}`;
}
