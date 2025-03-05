<?php
$host = "bjnp292jihxpw7io51f4-mysql.services.clever-cloud.com";
$usuario = "uosxm93ctl96xwsc";
$contraseña = "c3AO5kiOzBhftFhFpDyN";
$base_datos = "bjnp292jihxpw7io51f4";

$conexion = new mysqli($host, $usuario, $contraseña, $base_datos);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

echo "Conexión exitosa";
?>
