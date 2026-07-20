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

// Catalogo oficial de 19 distritos de Lima (PRD)
export const DISTRITOS_LIMA = [
  'Barranco', 'Breña', 'Chorrillos', 'Jesús María', 'La Molina', 'La Victoria',
  'Lince', 'Los Olivos', 'Magdalena del Mar', 'Miraflores', 'Pueblo Libre', 'Rímac',
  'San Borja', 'San Isidro', 'San Miguel', 'Santiago de Surco', 'Surquillo',
  'Villa El Salvador', 'Villa María del Triunfo',
]

// Tipos de servicio agrupados por especialidad (para filtrar en la solicitud)
export const TIPOS_SERVICIO_POR_ESP = {
  GASFITERIA: ['Gasfiteria - Fuga', 'Gasfiteria - Instalacion', 'Gasfiteria - Desague'],
  ELECTRICIDAD: ['Electricidad - Tablero', 'Electricidad - Instalacion', 'Electricidad - Reparacion'],
  MANTENIMIENTO: ['Mantenimiento - Pintura', 'Mantenimiento - Carpinteria', 'Mantenimiento - General'],
  OTROS: ['Otros'],
}

export const TIPOS_SERVICIO = Object.values(TIPOS_SERVICIO_POR_ESP).flat()

export const ESTADOS = ['PENDIENTE', 'ACEPTADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA']

export const TIPOS_INCIDENTE = [
  'El tecnico no se presento',
  'Trabajo incompleto o defectuoso',
  'Cobro diferente al acordado',
  'Comportamiento inadecuado',
  'Otro',
]
