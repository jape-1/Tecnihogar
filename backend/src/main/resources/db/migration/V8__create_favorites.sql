CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES users(id),
    tecnico_id BIGINT NOT NULL REFERENCES technician_profiles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cliente_id, tecnico_id)
);
