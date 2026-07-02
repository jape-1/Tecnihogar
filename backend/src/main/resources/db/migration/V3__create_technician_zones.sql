CREATE TABLE technician_zones (
    id BIGSERIAL PRIMARY KEY,
    tecnico_id BIGINT NOT NULL REFERENCES technician_profiles(id),
    distrito VARCHAR(100) NOT NULL
);
