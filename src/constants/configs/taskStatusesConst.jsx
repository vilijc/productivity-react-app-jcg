/**
 * Estatus de la tarea
 */
export const taskStatusesConst = Object.freeze({
    in_progress: 'En curso',
    completed: 'Completada',
});

/**
 * Ids de estatus
 */
export const taskStatusIdsConst = Object.freeze({
    in_progress: 1,
    completed: 2,
});

/**
 * Contiene opciones para llenar filtro de estatus de la tarea
 */
export const taskStatusFiltersConst = Object.freeze({
    options: [
        { value: taskStatusIdsConst.in_progress, label: taskStatusesConst.in_progress },
        { value: taskStatusIdsConst.completed, label: taskStatusesConst.completed },
    ],
});
