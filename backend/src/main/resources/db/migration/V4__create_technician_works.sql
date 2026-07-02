CREATE TABLE technician_works (
    id BIGSERIAL PRIMARY KEY,
    tecnico_id BIGINT NOT NULL REFERENCES technician_profiles(id),
    imagen_url VARCHAR(500) NOT NULL,
    descripcion VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);
