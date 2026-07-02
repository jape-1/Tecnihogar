CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT UNIQUE NOT NULL REFERENCES service_requests(id),
    cliente_id BIGINT NOT NULL REFERENCES users(id),
    tecnico_id BIGINT NOT NULL REFERENCES technician_profiles(id),
    estrellas INTEGER NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
