import {Tabs, Tab} from 'react-bootstrap'
import TaskList from '../../components/Tasks/TaskList'
import Graphic from '../../components/Graphics/Graphic'
import './TaskByUser.scss'

/**
 * Componente contenedor de listado de tareas y grafica
 * @returns 
 */
 export default function TaskByUser() {
    return (
        <>
            <Tabs defaultActiveKey="tasks">
                <Tab eventKey="tasks" title="Tareas">
                    <TaskList/>
                </Tab>
                <Tab eventKey="statistics" title="Gráfica">
                    <Graphic/>
                </Tab>
            </Tabs>
        </>
    );
}
