CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL REFERENCES service_requests(id),
    cliente_id BIGINT NOT NULL REFERENCES users(id),
    tipo_incidente VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
