-- Mensajeria dentro de una solicitud (chat cliente <-> tecnico)
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL REFERENCES service_requests(id),
    sender_id BIGINT NOT NULL REFERENCES users(id),
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_request ON messages(request_id, created_at);
