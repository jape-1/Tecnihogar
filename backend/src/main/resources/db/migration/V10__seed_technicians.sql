-- ============================================================
-- Seed de datos. Password de todos: "tecni1234"
-- Hash bcrypt ($2b$10$) generado con BCrypt (compatible con BCryptPasswordEncoder)
-- ============================================================

-- Usuarios tecnicos (ids 1..6) + un cliente demo (id 7)
INSERT INTO users (nombre, email, password, rol) VALUES
('Carlos Mendoza', 'carlos@tecnihogar.pe', '$2b$10$qqfyVXk01Y0fnWqVQfPxQuYzokIZ/T8B8j6oso9jY7BLbLGmk9uTu', 'TECNICO'),
('Ana Torres',     'ana@tecnihogar.pe',    '$2b$10$qqfyVXk01Y0fnWqVQfPxQuYzokIZ/T8B8j6oso9jY7BLbLGmk9uTu', 'TECNICO'),
('Javier Ramirez', 'javier@tecnihogar.pe', '$2b$10$qqfyVXk01Y0fnWqVQfPxQuYzokIZ/T8B8j6oso9jY7BLbLGmk9uTu', 'TECNICO'),
('Maria Vargas',   'maria@tecnihogar.pe',  '$2b$10$qqfyVXk01Y0fnWqVQfPxQuYzokIZ/T8B8j6oso9jY7BLbLGmk9uTu', 'TECNICO'),
('Luis Paredes',   'luis@tecnihogar.pe',   '$2b$10$qqfyVXk01Y0fnWqVQfPxQuYzokIZ/T8B8j6oso9jY7BLbLGmk9uTu', 'TECNICO'),
('Diego Castillo', 'diego@tecnihogar.pe',  '$2b$10$qqfyVXk01Y0fnWqVQfPxQuYzokIZ/T8B8j6oso9jY7BLbLGmk9uTu', 'TECNICO'),
('Rosa Diaz',      'rosa@tecnihogar.pe',   '$2b$10$qqfyVXk01Y0fnWqVQfPxQuYzokIZ/T8B8j6oso9jY7BLbLGmk9uTu', 'CLIENTE');

-- Perfiles tecnicos (ids 1..6)
INSERT INTO technician_profiles
  (user_id, especialidad, experiencia_anios, bio, tarifa_desde,
   tiempo_respuesta, garantia_dias, disponible, verificado,
   rating_promedio, total_resenas, foto_url, perfil_completitud) VALUES
(1,'GASFITERIA',8,'Tecnico gasfitero con mas de 8 anios de experiencia en instalaciones, reparacion de fugas y desague. Trabajo garantizado.',60,'~20 min',30,true,true,4.9,126,
   'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=27500A&color=EAF3DE&size=200',100),
(2,'ELECTRICIDAD',6,'Electricista certificada. Especialista en tableros, luminarias y puntos de energia. Atencion rapida y limpia.',80,'~30 min',15,true,true,4.8,94,
   'https://ui-avatars.com/api/?name=Ana+Torres&background=185FA5&color=E6F1FB&size=200',95),
(3,'MANTENIMIENTO',10,'Todo tipo de reparaciones y mantenimiento del hogar: pintura, carpinteria menor, puertas y ventanas.',50,'~40 min',7,true,true,4.7,81,
   'https://ui-avatars.com/api/?name=Javier+Ramirez&background=3B6D11&color=EAF3DE&size=200',90),
(4,'GASFITERIA',4,'Especialista en instalaciones de griferia y sanitarios. Presupuesto sin compromiso.',55,'~25 min',10,true,false,4.6,58,
   'https://ui-avatars.com/api/?name=Maria+Vargas&background=993556&color=FBEAF0&size=200',70),
(5,'GASFITERIA',12,'Tecnico senior, mas de 140 servicios completados. Deteccion de fugas y reparaciones complejas.',65,'~15 min',30,true,true,4.9,143,
   'https://ui-avatars.com/api/?name=Luis+Paredes&background=27500A&color=EAF3DE&size=200',100),
(6,'ELECTRICIDAD',5,'Instalaciones y reparaciones electricas residenciales. Puntualidad garantizada.',70,'~35 min',15,true,true,4.5,37,
   'https://ui-avatars.com/api/?name=Diego+Castillo&background=185FA5&color=E6F1FB&size=200',85);

-- Zonas por tecnico
INSERT INTO technician_zones (tecnico_id, distrito) VALUES
(1,'Miraflores'),(1,'San Isidro'),(1,'Surco'),(1,'Barranco'),(1,'La Molina'),
(2,'Surco'),(2,'La Molina'),(2,'San Borja'),
(3,'Barranco'),(3,'Chorrillos'),(3,'San Miguel'),
(4,'Barranco'),(4,'Lince'),
(5,'La Molina'),(5,'Surco'),(5,'San Borja'),(5,'Miraflores'),
(6,'Chorrillos'),(6,'Surco');

-- Fotos de trabajos (picsum)
INSERT INTO technician_works (tecnico_id, imagen_url, descripcion) VALUES
(1,'https://picsum.photos/seed/plumbing1/400/300','Instalacion de griferia'),
(1,'https://picsum.photos/seed/plumbing2/400/300','Reparacion de desague'),
(1,'https://picsum.photos/seed/plumbing3/400/300','Deteccion de fuga'),
(2,'https://picsum.photos/seed/electric1/400/300','Tablero electrico'),
(2,'https://picsum.photos/seed/electric2/400/300','Instalacion de luminarias'),
(3,'https://picsum.photos/seed/maint1/400/300','Pintura de sala'),
(3,'https://picsum.photos/seed/maint2/400/300','Reparacion de puertas'),
(5,'https://picsum.photos/seed/plumbing4/400/300','Cambio de tuberias'),
(5,'https://picsum.photos/seed/plumbing5/400/300','Instalacion de calentador');

-- Solicitudes finalizadas del cliente demo (Rosa, id 7) para poblar resenas y paneles
INSERT INTO service_requests
  (codigo_referencia, cliente_id, tecnico_id, tipo_servicio, descripcion,
   direccion, distrito, fecha_preferida, hora_preferida, estado) VALUES
('TH-00001', 7, 1, 'Gasfiteria - Fuga', 'Fuga bajo el lavadero de la cocina.', 'Av. Larco 123', 'Miraflores', '2026-06-10', '10:00', 'FINALIZADA'),
('TH-00002', 7, 2, 'Electricidad - Tablero', 'El tablero salta cuando enciendo el horno.', 'Calle Los Pinos 45', 'Surco', '2026-06-15', '15:00', 'FINALIZADA'),
('TH-00003', 7, 5, 'Gasfiteria - Instalacion', 'Instalacion de calentador de agua a gas.', 'Jr. Union 890', 'La Molina', '2026-06-25', '09:00', 'ACEPTADA');

-- Resenas de las solicitudes finalizadas (para mostrar en el perfil)
INSERT INTO reviews (request_id, cliente_id, tecnico_id, estrellas, comentario) VALUES
(1, 7, 1, 5, 'Excelente trabajo, resolvio la fuga en 20 minutos. Muy recomendado.'),
(2, 7, 2, 5, 'Puntual y ordenada. Explico todo el problema del tablero con claridad.');

-- Notificaciones del cliente demo
INSERT INTO notifications (user_id, mensaje, leida, tipo) VALUES
(7, 'Tu servicio TH-00001 fue finalizado. Deja una resena a Carlos Mendoza.', true, 'SERVICIO_FINALIZADO'),
(7, 'Luis Paredes acepto tu solicitud TH-00003.', false, 'SOLICITUD_ACEPTADA');
