import React, { useReducer } from 'react';
import TaskContext from '../context/TaskContext';
import { taskStatusesConst, taskStatusIdsConst } from '../../constants'

/**
 * Provider de cintexto de tareas
 * @param {*} props 
 * @returns 
 */
export const TaskContextProvider = props => {

    /**
     * Estado inicial
     */
    const initialState = {
        taskList: [
            {
                id: 'ee65a44d-7213-491a-b9c6-e0792b8447e2', //Id
                title: 'Crear proyecto react', //Titulo de la tarea
                estimatedTime: '00:10:00', //Tiempo estimado hh:mm:ss
                realTime: '00:10:00', //Tiempo real en finalizar la tarea hh:mm:ss
                isStarted: false, //Bandera que indica si el temporizador esta iniciado
                isPaused: false, //Bandera que indica si el temporizador esta pausado
                status: taskStatusesConst.completed, //Estatus de la tarea
                statusId: taskStatusIdsConst.completed, //Id de estatus
                startDate: new Date('2021-05-04T12:00:00'), //Fecha de inicio de la tarea
                endDate: new Date('2021-05-04T12:10:00'), //Fecha de finalización de la tarea
            },
            {
                id: '5641b5ce-d757-4a5d-959c-9d17f379f1d6',
                title: 'Crear layout',
                estimatedTime: '00:01:00',
                realTime: '00:00:30',
                isStarted: true,
                isPaused: false,
                status: taskStatusesConst.in_progress,
                statusId: taskStatusIdsConst.in_progress,
                startDate: new Date('2021-05-04T12:30:00'),
                endDate: new Date('2021-05-04T13:00:00'),
            },
        ].sort((a, b) => a.statusId > b.statusId ? 1 : -1)
    }

    /**
     * Acciones a realizar cuando se invoquen los dispatch
     * @param {*} state 
     * @param {*} action 
     * @returns 
     */
    const reducer = (state, action) => {
        switch (action.type) {
          case "ADD_TASK":
            return {
                taskList: [...state.taskList, action.payload]
            };
          case "UPDATE_TASK":
            const newList = state.taskList.map((item) => {
                if (item.id === action.payload.id) {
                  return action.payload;
                }
                return item;
            });
            return {
                taskList: newList
            };
          case "REMOVE_TASK":
            return {
                taskList: state.taskList.filter(s => s.id !== action.payload)
            };
          default:
            throw new Error();
        }
      };
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <TaskContext.Provider value={[state, dispatch]}>
            {props.children}
        </TaskContext.Provider>
    );
}
