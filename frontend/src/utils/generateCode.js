// El codigo real lo genera el backend (TH-XXXXX). Este helper solo formatea para vista previa.
export function formatReference(id) {
  if (id == null) return 'TH-?????'
  return 'TH-' + String(id).padStart(5, '0')
}
