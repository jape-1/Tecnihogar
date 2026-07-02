CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    mensaje VARCHAR(300) NOT NULL,
    leida BOOLEAN DEFAULT false,
    tipo VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
