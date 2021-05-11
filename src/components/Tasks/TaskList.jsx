import React, { useContext } from 'react'
import { Draggable } from "react-drag-reorder";
import {useState} from 'react'
import Select from 'react-select'
import { Row, Col } from 'react-bootstrap'
import moment from "moment"
import { taskDurationConst, taskStatusIdsConst, taskStatusFiltersConst } from '../../constants'
import TaskContext from '../../stateManagement/context/TaskContext'
import TaskItem from './TaskItem'

/**
 * Componente que se encarga de controlar los filtros e itera el conjunto de tareas
 * @returns 
 */
export default function TaskList() {
    const [state, dispatch] = useContext(TaskContext);
    const [durationFilter, setDurationFilter] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [taskList, setTaskList] = useState(state.taskList);
    const [taskListDurationFiltered, setTaskListDurationFiltered] = useState(null);
    const [taskListStatusFiltered, setTaskListStatusFiltered] = useState(null);

    /**
     * Evento a ejecutar cuando se cambia opción de filtro de duración de la tarea
     * @param {*} value 
     */
    const handleDurationFilterChange = (value) => {
        setDurationFilter(value);
        let rTaskList = filterByDuration(value);
        setTaskList(rTaskList);
    }

    /**
     * Evento a ejecutar cuando se cambia opción de filtro de estatus de la tarea
     * @param {*} value 
     */
    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        let rTaskList = filterByStatus(value);
        setTaskList(rTaskList);
    }

    /**
     * Realiza el filtrado por duración
     * @param {*} value 
     * @returns 
     */
    const filterByDuration = (value) => {
        setIsFiltering(true);
        let result = [];
        let filteredList = taskListStatusFiltered ?? state.taskList;
        let mShort = moment.duration(taskDurationConst.short).asMilliseconds();
        let mLong = moment.duration(taskDurationConst.long).asMilliseconds();
        let valueSelected = value != null ? value.value : null;
        switch(valueSelected) {
            case taskDurationConst.short:
                result = filteredList.filter(x => moment.duration(x.realTime).asMilliseconds() <= mShort);
                break;
            case taskDurationConst.medium:
                result = filteredList.filter(x => moment.duration(x.realTime).asMilliseconds() > mShort 
                    && moment.duration(x.realTime).asMilliseconds() <= mLong);
                break;
            case taskDurationConst.long:
                result = filteredList.filter(x => moment.duration(x.realTime).asMilliseconds() > mLong);
                break;
            default:
                result = filteredList;
                setTaskListDurationFiltered(null);
                setIsFiltering(false);
                return result;
        }
        setTaskListDurationFiltered(result);
        return result;
    }

    /**
     * Realiza el filtrado por estatus
     * @param {*} value 
     * @returns 
     */
    const filterByStatus = (value) => {
        setIsFiltering(true);
        let result = [];
        let filteredList = taskListDurationFiltered ?? state.taskList;
        let valueSelected = value != null ? value.value : null;
        switch(valueSelected) {
            case taskStatusIdsConst.in_progress:
            case taskStatusIdsConst.completed:
                result = filteredList.filter(x => x.statusId === valueSelected);
                break;
            default:
                result = filteredList;
                setTaskListStatusFiltered(null);
                setIsFiltering(false);
                return result;
        }
        setTaskListStatusFiltered(result);
        return result;
    }
    
    /**
     * Invoca dispatch para registrar tarea
     * @param {*} item 
     */
    let handleAddTask = (item) => {
        dispatch({
            type: "ADD_TASK",
            payload: item
        });
    }

    /**
     * Invoca dispatch para actualizar tarea
     * @param {*} item 
     */
    let handleUpdateTask = (item) => {
        dispatch({
            type: "UPDATE_TASK",
            payload: item
        });   
    }

    /**
     * Invoca dispatch para eliminar tarea
     * @param {*} item 
     */
    let handleRemoveTask = (item) => {
        dispatch({
            type: "REMOVE_TASK",
            payload: item.id
        });
    }

    /**
     * Retorna contenido
     */
    return (
        <>
            <Row>
                <Col>Filtros</Col>
            </Row>
            <Row>
                <Col lg="2" xs>Duración:</Col>
                <Col lg="2" xs>Estatus:</Col>
            </Row>
            <Row>
                <Col lg="2" xs>
                    <Select 
                        options={taskDurationConst.filters} 
                        placeholder="Duración"
                        value={durationFilter}
                        onChange={value => handleDurationFilterChange(value)}
                        isClearable={true}
                        />
                </Col>
                <Col lg="3" xs>
                    <Select 
                        options={taskStatusFiltersConst.options} 
                        placeholder="Estatus"
                        value={statusFilter}
                        onChange={value => handleStatusFilterChange(value)}
                        isClearable={true}
                        />
                </Col>
            </Row>
                {
                    (isFiltering ? taskList : state.taskList).map((item, index) => {
                        let rItem = <TaskItem 
                            key={index}
                            taskItemIdx={index}
                            taskData={item}
                            onAddTask={handleAddTask}
                            onUpdateTask={handleUpdateTask}
                            onRemoveTask={handleRemoveTask}
                        />
                        return rItem;
                    })
                }
        </>
    );
}
