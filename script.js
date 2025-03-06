// Base de datos local con localStorage
const DB_KEYS = {
    CUENTAS: 'sistema_cuentas',
    CLIENTES: 'sistema_clientes',
    PERFILES: 'sistema_perfiles',
    NOTIFICACIONES: 'sistema_notificaciones',
    MENSAJES: 'sistema_mensajes',
    HISTORIAL: 'sistema_historial'
};

// Inicialización de la base de datos
function initDB() {
    if (!localStorage.getItem(DB_KEYS.CUENTAS)) {
        localStorage.setItem(DB_KEYS.CUENTAS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.CLIENTES)) {
        localStorage.setItem(DB_KEYS.CLIENTES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.PERFILES)) {
        localStorage.setItem(DB_KEYS.PERFILES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.NOTIFICACIONES)) {
        localStorage.setItem(DB_KEYS.NOTIFICACIONES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.HISTORIAL)) {
        localStorage.setItem(DB_KEYS.HISTORIAL, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.MENSAJES)) {
        localStorage.setItem(DB_KEYS.MENSAJES, JSON.stringify({
            asignacion: "Hola {cliente}, te has suscrito a {plataforma}. Accede con: Email: {email} / Contraseña: {password} / Tu perfil: {perfil}. Vence el {vencimiento}.",
            reemplazo: "Hola {cliente}, tu cuenta de {plataforma} ha sido reemplazada. Accede con: Email: {email} / Contraseña: {password} / Tu perfil: {perfil}.",
            vencimiento: "Hola {cliente}, tu suscripción de {plataforma} vence en {dias} días. Contacta para renovar."
        }));
    }
}

// Funciones para manejar la base de datos
function getDB(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setDB(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    initDB();
    setupNavigation();
    loadAllData();
    setupEventListeners();
    checkExpirations();
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));

            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Funciones de carga de datos
function loadAllData() {
    loadCuentas();
    loadClientes();
    loadPerfiles();
    loadCuentasDisponibles();
    loadClientesReasignados();
    loadVencimientos();
    loadNotificaciones();
    loadClientesDropdowns();
    cargarMensajesConfig();
}

function loadCuentas() {
    const cuentas = getDB(DB_KEYS.CUENTAS);
    const perfiles = getDB(DB_KEYS.PERFILES);
    const tbody = document.querySelector('#cuentas-table tbody');
    tbody.innerHTML = '';

    cuentas.forEach(cuenta => {
        const perfilesUsados = perfiles.filter(p => p.cuentaId === cuenta.id).length;
        const row = document.createElement('tr');

        const vencimientoDate = new Date(cuenta.vencimiento);
        const hoy = new Date();
        const diferenciaDias = Math.floor((vencimientoDate - hoy) / (1000 * 60 * 60 * 24));

        let estadoClass = '';
        if (diferenciaDias < 0) {
            estadoClass = 'class="expired"';
        } else if (diferenciaDias < 7) {
            estadoClass = 'class="expiring-soon"';
        }

        row.innerHTML = `
            <td>${cuenta.plataforma}</td>
            <td>${cuenta.email}</td>
            <td>${cuenta.perfilesTotal}</td>
            <td>${perfilesUsados} / ${cuenta.perfilesTotal}</td>
            <td ${estadoClass}>${formatDate(cuenta.vencimiento)} (${diferenciaDias} días)</td>
            <td class="actions">
                <button class="btn btn-danger btn-sm" onclick="eliminarCuenta('${cuenta.id}')">Eliminar</button>
                <button class="btn btn-secondary btn-sm" onclick="mostrarEditarCuenta('${cuenta.id}')">Editar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadClientes() {
    const clientes = getDB(DB_KEYS.CLIENTES);
    const perfiles = getDB(DB_KEYS.PERFILES);
    const tbody = document.querySelector('#clientes-table tbody');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
        const perfilesCliente = perfiles.filter(p => p.clienteId === cliente.id).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.email || '-'}</td>
            <td>${perfilesCliente}</td>
            <td class="actions">
                <button class="btn btn-danger btn-sm" onclick="eliminarCliente('${cliente.id}')">Eliminar</button>
                <button class="btn btn-secondary btn-sm" onclick="mostrarEditarCliente('${cliente.id}')">Editar</button>
                <button class="btn btn-primary btn-sm" onclick="enviarWhatsApp('${cliente.id}')">WhatsApp</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadPerfiles() {
    const perfiles = getDB(DB_KEYS.PERFILES);
    const clientes = getDB(DB_KEYS.CLIENTES);
    const cuentas = getDB(DB_KEYS.CUENTAS);
    const tbody = document.querySelector('#perfiles-table tbody');
    tbody.innerHTML = '';

    perfiles.forEach(perfil => {
        const cliente = clientes.find(c => c.id === perfil.clienteId);
        const cuenta = cuentas.find(c => c.id === perfil.cuentaId);

        if (!cliente || !cuenta) return;

        const vencimientoDate = new Date(perfil.vencimiento);
        const hoy = new Date();
        const diferenciaDias = Math.floor((vencimientoDate - hoy) / (1000 * 60 * 60 * 24));

        let estadoClass = '';
        if (diferenciaDias < 0) {
            estadoClass = 'class="expired"';
        } else if (diferenciaDias < 7) {
            estadoClass = 'class="expiring-soon"';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cuenta.plataforma}</td>
            <td>${cuenta.email}</td>
            <td>${perfil.nombre}            <td>${perfil.nombre}</td>
            <td ${estadoClass}>${formatDate(perfil.vencimiento)} (${diferenciaDias} días)</td>
            <td class="actions">
                <button class="btn btn-danger btn-sm" onclick="eliminarPerfil('${perfil.id}')">Eliminar</button>
                <button class="btn btn-secondary btn-sm" onclick="mostrarEditarPerfil('${perfil.id}')">Editar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Evento de carga inicial
document.addEventListener('DOMContentLoaded', function() {
    initDB();
    setupNavigation();
    loadAllData();
});