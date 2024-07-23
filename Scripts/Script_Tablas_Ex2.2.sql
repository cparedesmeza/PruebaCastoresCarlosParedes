use DbPrueba
CREATE TABLE usuarios (
	id_usuario INT IDENTITY(1,1) PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	correo VARCHAR(50) NOT NULL,
	contraseña VARCHAR(25) NOT NULL,
	id_rol INT NOT NULL,
	estatus VARCHAR(50) 
)
CREATE TABLE productos (
	id_producto INT IDENTITY(1,1) PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	cantidad INT NOT NULL,
	estatus VARCHAR(50) NOT NULL,
)

CREATE TABLE roles (
	id_rol INT NOT NULL,
	rol VARCHAR(50) NOT NULL,
	id_permiso INT NOT NULL,
	permiso VARCHAR(50) NOT NULL
)

CREATE TABLE historial (
	id_historial INT IDENTITY(1,1) PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	tarea VARCHAR(50) NOT NULL,
	id_producto INT NOT NULL,
	movimiento VARCHAR(25) NOT NULL,
	fecha_hora VARCHAR(25) NOT NULL,
	modulo VARCHAR(25) NOT NULL
)
