// Configuración de Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://vdsdtouiokgvzrscaroe.supabase.co"; // Corrige esta URL con tu URL real
const SUPABASE_KEY = "your-actual-anon-key"; // Reemplaza con tu clave anónima real

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Determinar qué funcionalidad necesitamos según la página actual
document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;

    // Detectar en qué página estamos
    if (path.includes("cuenta_completa.html")) {
        initCuentaCompleta();
    } else if (path.includes("perfil_individual.html")) {
        initPerfilIndividual();
    } else if (path.includes("panel.html")) {
        initPanel();
    }
});

// Funcionalidad para la página de cuenta completa (cuenta_completa.html)
function initCuentaCompleta() {
    const form = document.getElementById("cuentaCompletaForm");
    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const correo = document.getElementById("correo").value;
        const cantidad_perfiles = parseInt(document.getElementById("cantidad_perfiles").value);
        const fecha_vencimiento = document.getElementById("fecha_vencimiento").value;
        const plataforma = document.getElementById("plataforma").value;

        try {
            // Insertar en Supabase
            const { data, error } = await supabase
                .from("cuentas_completas")
                .insert([{ correo, cantidad_perfiles, fecha_vencimiento, plataforma }]);

            if (error) throw error;

            alert("Cuenta registrada correctamente.");
            form.reset(); // Limpiar el formulario
        } catch (error) {
            console.error("Error al registrar cuenta:", error);
            alert("Error al registrar la cuenta: " + error.message);
        }
    });
}

// Funcionalidad para la página de perfil individual (perfil_individual.html)
function initPerfilIndividual() {
    const form = document.getElementById("perfilIndividualForm");
    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const nombre_cliente = document.getElementById("nombre_cliente").value;
        const perfil_cliente = document.getElementById("perfil_cliente").value;
        const pin_cliente = document.getElementById("pin_cliente").value || null;
        const correo_cuenta = document.getElementById("correo_cuenta").value;
        const contraseña_cuenta = document.getElementById("contraseña_cuenta").value;
        const fecha_vencimiento = document.getElementById("fecha_vencimiento").value;

        try {
            // Insertar en Supabase
            const { data, error } = await supabase
                .from("perfiles_vendidos")
                .insert([{
                    nombre_cliente,
                    perfil_cliente,
                    pin_cliente,
                    correo_cuenta,
                    contraseña_cuenta,
                    fecha_vencimiento
                }]);

            if (error) throw error;

            alert("Perfil registrado correctamente.");
            form.reset(); // Limpiar el formulario
        } catch (error) {
            console.error("Error al registrar perfil:", error);
            alert("Error al registrar el perfil: " + error.message);
        }
    });
}

// Funcionalidad para la página del panel de gestión (panel.html)
function initPanel() {
    cargarCuentas();
    cargarPerfiles();
}

// Función para cargar cuentas completas
async function cargarCuentas() {
    try {
        const { data, error } = await supabase.from("cuentas_completas").select("*");
        if (error) throw error;

        const tablaCuentas = document.getElementById("tablaCuentas");
        if (!tablaCuentas) return;

        tablaCuentas.innerHTML = ""; // Limpiar la tabla antes de llenar

        data.forEach((cuenta) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cuenta.id}</td>
                <td>${cuenta.correo}</td>
                <td>${cuenta.cantidad_perfiles}</td>
                <td>${cuenta.fecha_vencimiento}</td>
                <td>${cuenta.plataforma}</td>
                <td>
                    <button onclick="eliminarCuenta(${cuenta.id})">Eliminar</button>
                    <button onclick="reemplazarCuenta(${cuenta.id})">Reemplazar</button>
                </td>
            `;
            tablaCuentas.appendChild(row);
        });
    } catch (error) {
        console.error("Error al obtener cuentas:", error);
        alert("Error al cargar las cuentas: " + error.message);
    }
}

// Función para cargar perfiles vendidos
async function cargarPerfiles() {
    try {
        const { data, error } = await supabase.from("perfiles_vendidos").select("*");
        if (error) throw error;

        const tablaPerfiles = document.getElementById("tablaPerfiles");
        if (!tablaPerfiles) return;

        tablaPerfiles.innerHTML = ""; // Limpiar la tabla antes de llenar

        data.forEach((perfil) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${perfil.id}</td>
                <td>${perfil.nombre_cliente}</td>
                <td>${perfil.perfil_cliente}</td>
                <td>${perfil.pin_cliente || "N/A"}</td>
                <td>${perfil.correo_cuenta}</td>
                <td>${perfil.contraseña_cuenta}</td>
                <td>${perfil.fecha_vencimiento}</td>
                <td>
                    <button onclick="eliminarPerfil(${perfil.id})">Eliminar</button>
                    <button onclick="reemplazarPerfil(${perfil.id})">Reemplazar</button>
                </td>
            `;
            tablaPerfiles.appendChild(row);
        });
    } catch (error) {
        console.error("Error al obtener perfiles:", error);
        alert("Error al cargar los perfiles: " + error.message);
    }
}

// Función para eliminar una cuenta
async function eliminarCuenta(id) {
    if (!confirm("¿Está seguro que desea eliminar esta cuenta?")) return;

    try {
        const { error } = await supabase.from("cuentas_completas").delete().match({ id });
        if (error) throw error;

        alert("Cuenta eliminada correctamente.");
        cargarCuentas(); // Recargar la tabla
    } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        alert("Error al eliminar la cuenta: " + error.message);
    }
}

// Función para eliminar un perfil
async function eliminarPerfil(id) {
    if (!confirm("¿Está seguro que desea eliminar este perfil?")) return;

    try {
        const { error } = await supabase.from("perfiles_vendidos").delete().match({ id });
        if (error) throw error;

        alert("Perfil eliminado correctamente.");
        cargarPerfiles(); // Recargar la tabla
    } catch (error) {
        console.error("Error al eliminar perfil:", error);
        alert("Error al eliminar el perfil: " + error.message);
    }
}

// Función para reemplazar una cuenta
async function reemplazarCuenta(id) {
    const nuevoCorreo = prompt("Ingrese el nuevo correo de la cuenta:");
    if (!nuevoCorreo) return;

    try {
        const { error } = await supabase
            .from("cuentas_completas")
            .update({ correo: nuevoCorreo })
            .match({ id });

        if (error) throw error;

        alert("Cuenta actualizada correctamente.");
        cargarCuentas(); // Recargar la tabla
    } catch (error) {
        console.error("Error al reemplazar cuenta:", error);
        alert("Error al actualizar la cuenta: " + error.message);
    }
}

// Función para reemplazar un perfil
async function reemplazarPerfil(id) {
    const nuevoPerfil = prompt("Ingrese el nuevo perfil del cliente:");
    if (!nuevoPerfil) return;

    try {
        const { error } = await supabase
            .from("perfiles_vendidos")
            .update({ perfil_cliente: nuevoPerfil })
            .match({ id });

        if (error) throw error;

        alert("Perfil actualizado correctamente.");
        cargarPerfiles(); // Recargar la tabla
    } catch (error) {
        console.error("Error al reemplazar perfil:", error);
        alert("Error al actualizar el perfil: " + error.message);
    }
}

// Exponer funciones al scope global para que los botones en HTML puedan usarlas
window.eliminarCuenta = eliminarCuenta;
window.reemplazarCuenta = reemplazarCuenta;
window.eliminarPerfil = eliminarPerfil;
window.reemplazarPerfil = reemplazarPerfil;