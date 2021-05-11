/**
 * Constantes de opciones de duración de la tarea
 */
export const taskDurationConst = Object.freeze({
    short: '00:30:00',
    medium: '00:45:00',
    long: '00:60:00',
    default_values: [ //Contiene items para llenar select de duración de la tarea
        { value: '00:30:00', label: '30 min.' },
        { value: '00:45:00', label: '45 min.' },
        { value: '00:60:00', label: '1 hr' }
    ],
    filters: [ //Contiene items para llenar filtro de duración de la tarea
        { value: '00:30:00', label: 'Corto' },
        { value: '00:45:00', label: 'Medio' },
        { value: '00:60:00', label: 'Largo' }
    ],
});