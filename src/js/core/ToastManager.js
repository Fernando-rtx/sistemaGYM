export class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'info', duration = 3000) {
        if (!this.container) {
            this.container = document.getElementById('toastContainer');
            if (!this.container) return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        
        const icons = { success: 'check_circle', danger: 'error', info: 'info', warning: 'warning' };
        const icon = icons[type] || 'info';
        toast.innerHTML = `<span class="material-icons-round">${icon}</span> ${message}`;
        
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    danger(message, duration) {
        this.show(message, 'danger', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

export const toastManager = new ToastManager();
