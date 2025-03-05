// Configuración de Supabase - Reemplaza con tus credenciales
const supabaseUrl = 'TU_URL_SUPABASE';
const supabaseKey = 'TU_API_KEY_SUPABASE';
const supabase = supabaseCreateClient(supabaseUrl, supabaseKey);

// Función para crear el cliente de Supabase
function supabaseCreateClient(url, key) {
    return window.supabase.createClient(url, key);
}

// Elementos del DOM
const btnSoporte = document.getElementById('btnSoporte');
const btnVentas = document.getElementById('btnVentas');
const panelSoporte = document.getElementById('panelSoporte');
const panelVentas = document.getElementById('panelVentas');

// Botones de Soporte
const btnNuevoCliente = document.getElementById('btnNuevoCliente');
const btnAsignarCuenta = document.getElementById('btnAsignarCuenta');
const btnMoverPerfiles = document.getElementById('btnMoverPerfiles');
const btnReemplazo = document.getElementById('btnReemplazo');

// Formularios
const formNuevoCliente = document.getElementByI