export const ESPECIALIDADES = [
  { value: 'GASFITERIA', label: 'Gasfiteria' },
  { value: 'ELECTRICIDAD', label: 'Electricidad' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'OTROS', label: 'Otros' },
]

export const CATEGORIAS = [
  { value: 'GASFITERIA', label: 'Gasfiteria', icon: 'drop', desc: 'Fugas, instalaciones y desagues' },
  { value: 'ELECTRICIDAD', label: 'Electricidad', icon: 'bolt', desc: 'Tableros, puntos y luminarias' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento', icon: 'wrench', desc: 'Reparaciones del hogar' },
  { value: 'OTROS', label: 'Otros', icon: 'grid', desc: 'Otros servicios del hogar' },
]

export const DISTRITOS_LIMA = [
  'Miraflores', 'San Isidro', 'Surco', 'Barranco', 'La Molina', 'San Borja',
  'Chorrillos', 'San Miguel', 'Lince', 'Jesus Maria', 'Magdalena', 'Pueblo Libre',
  'San Juan de Lurigancho', 'Los Olivos', 'San Martin de Porres', 'Ate',
]

export const TIPOS_SERVICIO = [
  'Gasfiteria - Fuga',
  'Gasfiteria - Instalacion',
  'Gasfiteria - Desague',
  'Electricidad - Tablero',
  'Electricidad - Instalacion',
  'Electricidad - Reparacion',
  'Mantenimiento - Pintura',
  'Mantenimiento - Carpinteria',
  'Mantenimiento - General',
  'Otros',
]

export const ESTADOS = ['PENDIENTE', 'ACEPTADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA']

export const TIPOS_INCIDENTE = [
  'El tecnico no se presento',
  'Trabajo incompleto o defectuoso',
  'Cobro diferente al acordado',
  'Comportamiento inadecuado',
  'Otro',
]
