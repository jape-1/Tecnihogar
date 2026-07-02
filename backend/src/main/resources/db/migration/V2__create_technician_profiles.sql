CREATE TABLE technician_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id),
    especialidad VARCHAR(50) NOT NULL,
    experiencia_anios INTEGER DEFAULT 0,
    bio TEXT,
    tarifa_desde DECIMAL(8,2),
    tiempo_respuesta VARCHAR(50),
    garantia_dias INTEGER,
    disponible BOOLEAN DEFAULT true,
    verificado BOOLEAN DEFAULT false,
    rating_promedio DECIMAL(3,2) DEFAULT 0.0,
    total_resenas INTEGER DEFAULT 0,
    foto_url VARCHAR(500),
    perfil_completitud INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
