
export interface SocioFilter {
   column: 'nombre' | 'edad' | 'equipo' | 'estadoCivil' | 'nivelEstudios',
   operator: 'equal' | 'like' | 'greater' | 'less' | 'greaterOrEqual' | 'lessOrEqual',
   value: string | number,
}