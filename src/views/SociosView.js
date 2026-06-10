import { BaseView } from '../js/core/BaseView.js';
import { SociosTable } from './components/SociosTable.js';
import { SocioProfile } from './components/SocioProfile.js';
import { SocioForm } from './components/SocioForm.js';
import { TicketGenerator } from './components/TicketGenerator.js';
import { escapeHtml } from '../js/utils/escapeHtml.js';

export class SociosView extends BaseView {
    constructor(container, services, eventBus) {
        super(container, services, eventBus);
        this.tableComponent = null;
        this.profileComponent = null;
    }

    render() {
        return `
            <div id="sociosMainView" style="display: block;"></div>
            <div id="sociosProfileView" style="display: none; padding-bottom: 24px;"></div>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();

        const mainContainer = this.$('#sociosMainView');
        const profileContainer = this.$('#sociosProfileView');

        // Instanciar el formulario y el generador de tickets
        const formComponent = new SocioForm(this.services, this.eventBus);
        const ticketComponent = new TicketGenerator(this.services);

        // 1. Instanciar e inicializar la tabla de socios
        this.tableComponent = new SociosTable(
            mainContainer,
            this.services,
            this.eventBus,
            // onOpenProfile
            (id) => this.showProfile(id),
            // onOpenEdit (crear o editar)
            async (id) => {
                await formComponent.open(id, async (savedSocio, isNew) => {
                    await this.tableComponent.refreshData();
                    if (isNew && savedSocio) {
                        // Si es nuevo, preguntar si quiere generar ticket
                        const confirmHtml = `
                            <div class="modal-header">
                                <h3 class="modal-title">¿GENERAR COMPROBANTE?</h3>
                                <button class="btn-close" id="btnCloseConfirmTicket"><span class="material-icons-round">close</span></button>
                            </div>
                            <div style="padding: 10px; text-align: center;">
                                <p style="margin-bottom: 24px; color: var(--color-text-secondary); line-height: 1.5;">
                                    El socio <b>${escapeHtml(savedSocio.nombre)}</b> ha sido registrado con éxito.<br>
                                    ¿Deseas generar el ticket comprobante de inscripción?
                                </p>
                                <div style="display: flex; gap: 12px; justify-content: center;">
                                    <button class="btn btn-outline" id="btnNoTicket" style="flex: 1; padding: 12px;">NO, CERRAR</button>
                                    <button class="btn btn-primary" id="btnYesTicket" style="flex: 1; padding: 12px;">SÍ, GENERAR</button>
                                </div>
                            </div>
                        `;
                        this.services.modal.open(confirmHtml);

                        document.getElementById('btnCloseConfirmTicket').addEventListener('click', () => this.services.modal.close());
                        document.getElementById('btnNoTicket').addEventListener('click', () => this.services.modal.close());
                        document.getElementById('btnYesTicket').addEventListener('click', async () => {
                            try {
                                this.services.modal.close();
                                await ticketComponent.open(savedSocio);
                            } catch (e) {
                                console.error('Error generating ticket:', e);
                            }
                        });
                    }
                });
            },
            // onOpenDelete
            async (id) => {
                let socio;
                try {
                    socio = await this.services.socio.getById(id);
                } catch (e) {
                    console.error(e);
                    return;
                }
                if (!socio) return;

                const confirmHtml = `
                    <div class="modal-header">
                        <h3 class="modal-title" style="color: var(--color-danger);">ELIMINAR SOCIO</h3>
                        <button class="btn-close" id="btnCloseConfirmDelete"><span class="material-icons-round">close</span></button>
                    </div>
                    <div style="padding: 10px; text-align: center;">
                        <p style="margin-bottom: 24px; color: var(--color-text-secondary); line-height: 1.5;">
                            ¿Estás seguro de que deseas eliminar al socio <b>${escapeHtml(socio.nombre)}</b>?<br>
                            Esta acción es permanente y eliminará todo su historial.
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button class="btn btn-outline" id="btnCancelDelete" style="flex: 1; padding: 12px;">CANCELAR</button>
                            <button class="btn btn-primary" id="btnConfirmDelete" style="flex: 1; padding: 12px; background: var(--color-danger); border-color: var(--color-danger); color: white;">ELIMINAR</button>
                        </div>
                    </div>
                `;
                this.services.modal.open(confirmHtml);

                document.getElementById('btnCloseConfirmDelete').addEventListener('click', () => this.services.modal.close());
                document.getElementById('btnCancelDelete').addEventListener('click', () => this.services.modal.close());
                document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
                    try {
                        this.services.modal.close();
                        const success = await this.services.socio.delete(id);
                        if (success) {
                            this.services.toast.success(`Socio ${escapeHtml(socio.nombre)} eliminado`);
                            await this.tableComponent.refreshData();
                        } else {
                            this.services.toast.danger('No se pudo eliminar al socio');
                        }
                    } catch (e) {
                        console.error('Error deleting socio:', e);
                        this.services.toast.danger('Error al eliminar al socio');
                    }
                });
            },
            // onRegisterCheckin
            async (id) => {
                try {
                    const socio = await this.services.socio.getById(id);
                    if (!socio) return;

                    if (socio.estado !== 'Activo') {
                        this.services.toast.danger(`Acceso denegado. Membresía de ${escapeHtml(socio.nombre)} está ${escapeHtml(socio.estado.toLowerCase())}`);
                        return;
                    }

                    const checkinObj = await this.services.checkin.registrar(id, socio.nombre);
                    if (checkinObj) {
                        const dias = socio.diasRestantes;
                        if (dias <= 5 && dias >= 0) {
                            this.services.toast.warning(`Check-in registrado. AVISO: Membresía vence en ${dias} días`);
                        } else {
                            this.services.toast.success(`Check-in registrado para ${escapeHtml(socio.nombre)}`);
                        }
                        await this.tableComponent.refreshData();
                    } else {
                        this.services.toast.danger('Error al registrar check-in');
                    }
                } catch (e) {
                    console.error('Error registering checkin:', e);
                    this.services.toast.danger('Error al registrar check-in');
                }
            }
        );

        await this.tableComponent.init();

        // 2. Instanciar el perfil de socios
        this.profileComponent = new SocioProfile(
            profileContainer,
            this.services,
            this.eventBus,
            // onBack
            () => this.showTable()
        );

        // Suscribirse a cambios para mantener sincronizado
        this.subscribe('checkin:created', () => {
            if (mainContainer.style.display === 'block') {
                this.tableComponent.refreshData();
            }
        });

        this.subscribe('socio:updated', () => {
            if (mainContainer.style.display === 'block') {
                this.tableComponent.refreshData();
            }
        });
    }

    async showProfile(socioId) {
        const mainContainer = this.$('#sociosMainView');
        const profileContainer = this.$('#sociosProfileView');

        if (mainContainer && profileContainer) {
            mainContainer.style.display = 'none';
            profileContainer.style.display = 'block';
            profileContainer.innerHTML = '<div style="text-align:center; padding: 50px;">Cargando perfil...</div>';
            await this.profileComponent.loadSocio(socioId);
        }
    }

    async showTable() {
        const mainContainer = this.$('#sociosMainView');
        const profileContainer = this.$('#sociosProfileView');

        if (mainContainer && profileContainer) {
            profileContainer.style.display = 'none';
            mainContainer.style.display = 'block';
            await this.tableComponent.refreshData();
        }
    }

    destroy() {
        if (this.tableComponent) this.tableComponent.destroy?.();
        if (this.profileComponent) this.profileComponent.destroy?.();
        super.destroy();
    }
}
