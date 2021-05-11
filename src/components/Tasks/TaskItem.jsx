import {useState, useEffect} from 'react'
import TimerMachine from 'react-timer-machine'
import moment from "moment"
import momentDurationFormatSetup from "moment-duration-format"
import { Button, Form, Row, Col } from 'react-bootstrap'
import { BsPencil, BsTrash, BsFillPlusCircleFill } from "react-icons/bs"
import Creatable from 'react-select/creatable'
import { createFilter } from "react-select";
import { v4 as uuidv4 } from 'uuid';
import ModalTemplate from '../Common/ModalTemplate'
import { taskStatusesConst, taskStatusIdsConst, taskDurationConst } from '../../constants'
import './TaskItem.scss'

/**
 * Componente que muestra una tarea
 * @param {*} props 
 * @returns 
 */
export default function TaskItem(props) {
    let { taskItemIdx, taskData, onAddTask, onUpdateTask, onRemoveTask }= props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [titleTemp, setTitleTemp] = useState('');
    const [durationTemp, setDurationTemp] = useState('');
    const [chckFinalizedTemp, setChckFinalizedTemp] = useState(false);
    const [tickTemp, setTickTemp] = useState('');
    const [timerStarted, setTimerStarted] = useState(false);
    const [timerPaused, setTimerPaused] = useState(false);
    const [flagInit, setFlagInit] = useState(undefined);

    /**
     * Evento a ejecutar cuando den clic a boton de editar tarea
     */
    const handleShowEditModal = () => {
        setTitleTemp(taskData.title);
        let currentDuration = { value: taskData.estimatedTime, label: taskData.estimatedTime }
        setDurationTemp(currentDuration);
        setChckFinalizedTemp(false);
        setShowEditModal(true);
    }
    /**
     * Actualiza estado de bandera showEditModal a false
     * @returns 
     */
    const handleCloseModal = () => setShowEditModal(false);

    /**
     * Evento a ejecutar cuando cambien opcion de select de duración de la tarea
     * @param {*} value 
     */
    const handleDurationTempChange = (value) => {
        setDurationTemp(value);
    }

    /**
     * Valida formato HH:mm:ss
     * @param {*} inputValue 
     * @param {*} selectValue 
     * @param {*} selectOptions 
     * @returns
     */
    const handleIsValidNewOption = (inputValue, selectValue, selectOptions) => {
        if(!inputValue.match(/^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))/g)) return false;
        if (inputValue.length != 8) return false;
        let minutes = moment.duration(inputValue).asMinutes();
        if (minutes > 120) return false; //No puede ser mayor a 2 hrs
        return true;
    };

    /**
     * Actualiza estado de bandera chckFinalizedTemp
     */
    const handleChckFinalizedChange = () => {
        setChckFinalizedTemp(!chckFinalizedTemp);
    }

    /**
     * Retorna la diferencia entre dos hh:mm:ss
     * @param {'HH:mm:ss'} startTime 
     * @param {'HH:mm:ss'} endTime 
     * @returns 'HH:mm:ss'
     */
    const getTimeDiff = (startTime, endTime) => {
        // convierte hh:mm:ss a moment
        let startMoment = moment(startTime, 'HH:mm:ss');
        let endMoment = moment(endTime, 'HH:mm:ss');
        // obtiene la diferencia
        var secondsDiff = moment.duration(startMoment.diff(endMoment)).asSeconds();
        return moment("2021-01-01").startOf('day').seconds(secondsDiff).format('HH:mm:ss'); //retorna diferencia en formato 'HH:mm:ss'
    }

    /**
     * Evento a ejecutar cuando den clic sobro boton Ok de modal de edición de tarea
     */
    const handleBtnUpdateClick = () => {
        taskData.title = titleTemp;
        taskData.estimatedTime = `${durationTemp.value}`;
        if (chckFinalizedTemp) {
            taskData.isPaused = true;
            taskData.status = taskStatusesConst.completed;
            taskData.statusId = taskStatusIdsConst.completed;
            taskData.realTime = getTimeDiff(taskData.estimatedTime,tickTemp);
        }
        onUpdateTask(taskData);
        handleCloseModal();
    }

    /**
     * Evento a ejecutar cuando den clic sobre boton Agregar tarea
     */
    const handleShowAddModal = () => {
        setTitleTemp('');
        setDurationTemp('');
        setShowAddModal(true);
    }

    /**
     * Actualiza estado showAddModal a false
     * @returns 
     */
    const handleCloseAddModal = () => setShowAddModal(false);

    /**
     * Evento a ejecutar cuando den clic sobre boton ok de modal de registro de tarea
     */
    const handleBtnAddClick = () => {
        let newTask = {
            id: uuidv4(),
            title: titleTemp,
            estimatedTime: `${durationTemp.value}`,
            realTime: '00:00:00',
            isStarted: true,
            isPaused: false,
            status: taskStatusesConst.in_progress,
            statusId: taskStatusIdsConst.in_progress,
            startDate: new Date(),
        };
        onAddTask(newTask);
        handleCloseAddModal();
    }

    //Arma sección donde aparece boton de agregar cuando sea la primera tarea iterada
    let btnAddContent = <></>
    if (taskItemIdx == 0) {
        btnAddContent = <Row className="btn-add-container">
                            <Col>
                                <div className="text-center">
                                    <Button variant="primary" type="button" onClick={handleShowAddModal}>
                                        <BsFillPlusCircleFill/> Agregar
                                    </Button>
                                </div>
                            </Col>
                        </Row>
    }

    /**
     * Evento para reiniciar timer
     * @returns 
     */
    let handleOnTimerRestart = () => {
        setTimerPaused(false);
        setTimerStarted(false);
        const timer = setInterval(() => {
            setTimerStarted(true);
        }, 250);
        return () => clearInterval(timer);
    }

    /**
     * Contenido dinamico de controles de temporizador
     * Solor se muestran cuando esta en curso
     * @returns 
     */
    let timerControlsContent = () => {
        if (taskData.status != taskStatusesConst.in_progress) return <></>;
        return <div className="task-actions text-center">
                    {
                        timerPaused ? <span className="action" onClick={() => setTimerPaused(false)} >Continuar</span> : <span className="action" onClick={() => setTimerPaused(true)} >Pausar</span>
                    }
                    {
                        timerStarted ? <span className="action" onClick={() => setTimerStarted(false)} >Detener</span> : <span className="action" onClick={() => setTimerStarted(true)} >Iniciar</span>
                    }
                    <span className="action" onClick={() => handleOnTimerRestart()} >Reiniciar</span>
                </div>;
    }

    /**
     * Evento a ejecutar cuando el timer llega a cero
     */
    let handleOnTimerComplete = () => {
        taskData.isStarted = false;
        taskData.isPaused = false;
        taskData.status = taskStatusesConst.completed;
        taskData.statusId = taskStatusIdsConst.completed;
        taskData.realTime = taskData.estimatedTime;
        onUpdateTask(taskData);
    }

    /**
     * Contenido dinamico para mostrar tiempo tomado en terminar la tarea cuando esta en estatus Completado
     * En caso de que el estatus sea en curso, se muestra el timer
     * @returns 
     */
    let timerContent = () => {
        let milliseconds = moment.duration(taskData.estimatedTime).asMilliseconds(); //Convierte hh:mm:ss a milisegundos
        let realTimeContent = <></>;
        if (taskData.status == taskStatusesConst.completed) {
            realTimeContent = <p className="real-time">
                <span className="lbl-desc">Tiempo real: </span> {taskData.realTime}
            </p>
        }
        else if (taskData.status == taskStatusesConst.in_progress) {
            realTimeContent = <>
                                <p>
                                    <span className="lbl-desc">Tiempo restante: </span>
                                    <TimerMachine                                    
                                        timeStart={milliseconds}
                                        timeEnd={0}
                                        started={timerStarted}
                                        paused={timerPaused}
                                        countdown={true}
                                        interval={1000}
                                        formatTimer={(time, ms) => moment.duration(time, "milliseconds").format("hh:mm:ss")}
                                        onTick={time => {
                                            let m = `${time.m}`;
                                            let s = `${time.s}`;
                                            setTickTemp(`0${time.h}:${m.length > 1 ? m : ('0' + m)}:${s.length > 1 ? s : ('0' + s)}`);
                                        }}
                                        onComplete={handleOnTimerComplete}
                                    />
                                </p>
                            </>
        }
        return realTimeContent;
    }

    /**
     * Invoca setState de banderas de timer para mostrarlo correctamente
     */
     useEffect(() => {
        const timer = setInterval(() => {
            if (flagInit == undefined) {
                setTimerStarted(true);
                setTimerPaused(false);
                setFlagInit(true);
            }
        }, 1000);
        return () => clearInterval(timer);
    });
    
    /**
     * Retorna contenido
     */
    return (
        <>
            {btnAddContent}
            <div className='task-item'>
                <div className="task-actions text-right">
                    <span className="action edit" onClick={() => handleShowEditModal()}><BsPencil /></span>
                    <span className="action remove" onClick={() => onRemoveTask(taskData)}><BsTrash/></span>
                </div>
                <p className="title">{taskData.title}</p>
                <p className="status">
                    <span className="lbl-desc">Estatus:</span> {taskData.status}
                </p>
                {timerContent()}
                {timerControlsContent()}
            </div>
            <ModalTemplate 
                show={showEditModal}
                title="Editar tarea"
                onOk={handleBtnUpdateClick}
                onClose={handleCloseModal}
                isValid={titleTemp != null && titleTemp != '' && durationTemp != null && durationTemp != ''}
            >
                <Form.Group controlId="titleEdit">
                    <Form.Label>Título:</Form.Label>
                    <Form.Control type="text" value={titleTemp} placeholder="Título" maxLength={60} onChange={e => setTitleTemp(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="hhMmEdit">
                    <Form.Label>Duración:</Form.Label>
                    <Creatable 
                        options={taskDurationConst.default_values} 
                        value={durationTemp}
                        onChange={value => handleDurationTempChange(value)}
                        filterOption={createFilter({ ignoreCase: false })}
                        isValidNewOption={handleIsValidNewOption}
                        placeholder="HH:mm:ss"
                    />
                    <Form.Text className="text-muted">Ingrese duración en formato HH:MM:SS</Form.Text>
                </Form.Group>
                <Form.Group as={Row} controlId="finalizedEdit">
                    <Col>
                        <Form.Check label="Finalizada" checked={chckFinalizedTemp} onClick={handleChckFinalizedChange} />
                    </Col>
                </Form.Group>
            </ModalTemplate>
            
            <ModalTemplate 
                show={showAddModal}
                title="Registrar tarea"
                onOk={handleBtnAddClick}
                onClose={handleCloseAddModal}
                isValid={titleTemp != null && titleTemp != '' && durationTemp != null && durationTemp != ''}
            >
                <Form.Group controlId="titleEdit">
                    <Form.Label>Título:</Form.Label>
                    <Form.Control type="text" value={titleTemp} placeholder="Título" maxLength={60} onChange={e => setTitleTemp(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="hhMmEdit">
                    <Form.Label>Duración:</Form.Label>
                    <Creatable 
                        options={taskDurationConst.default_values} 
                        value={durationTemp}
                        onChange={value => handleDurationTempChange(value)}
                        filterOption={createFilter({ ignoreCase: false })}
                        isValidNewOption={handleIsValidNewOption}
                        placeholder="HH:mm:ss"
                    />
                    <Form.Text className="text-muted">Ingrese duración en formato HH:MM:SS</Form.Text>
                </Form.Group>
            </ModalTemplate>
        </>
    );
}