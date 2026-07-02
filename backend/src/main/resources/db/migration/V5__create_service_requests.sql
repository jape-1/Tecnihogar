CREATE TABLE service_requests (
    id BIGSERIAL PRIMARY KEY,
    codigo_referencia VARCHAR(20) UNIQUE NOT NULL,
    cliente_id BIGINT NOT NULL REFERENCES users(id),
    tecnico_id BIGINT NOT NULL REFERENCES technician_profiles(id),
    tipo_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    distrito VARCHAR(100) NOT NULL,
    fecha_preferida DATE NOT NULL,
    hora_preferida TIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE'
        CHECK (estado IN ('PENDIENTE','ACEPTADA','EN_CURSO','FINALIZADA','CANCELADA')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
