-- public_id de Cloudinary para poder borrar las imagenes de trabajos
ALTER TABLE technician_works ADD COLUMN public_id VARCHAR(255);

-- Telefono del tecnico (se revela parcialmente hasta que el servicio esta en curso)
ALTER TABLE technician_profiles ADD COLUMN telefono VARCHAR(30);

-- Telefonos ficticios para los 6 tecnicos del seed
UPDATE technician_profiles SET telefono = '+51 987 654 321' WHERE id = 1;
UPDATE technician_profiles SET telefono = '+51 987 111 222' WHERE id = 2;
UPDATE technician_profiles SET telefono = '+51 987 333 444' WHERE id = 3;
UPDATE technician_profiles SET telefono = '+51 987 555 666' WHERE id = 4;
UPDATE technician_profiles SET telefono = '+51 987 777 888' WHERE id = 5;
UPDATE technician_profiles SET telefono = '+51 987 999 000' WHERE id = 6;

-- Normalizar el nombre de distrito al catalogo oficial de 19 distritos del frontend
-- ("Surco" -> "Santiago de Surco") para que los filtros de busqueda encuentren el seed.
UPDATE technician_zones SET distrito = 'Santiago de Surco' WHERE distrito = 'Surco';
UPDATE service_requests SET distrito = 'Santiago de Surco' WHERE distrito = 'Surco';
