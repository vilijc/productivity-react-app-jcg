import { useContext } from 'react'
import { VictoryPie } from "victory";
import { Row, Col } from 'react-bootstrap'
import TaskContext from '../../stateManagement/context/TaskContext'
import DateTimeUtils from '../../utils/DateTimeUtils'
import {taskStatusesConst, taskStatusIdsConst} from '../../constants'
import './Graphic.scss'

/**
 * Componente para mostrar grafica de historial de tareas de la semana anterior
 * @returns 
 */
export default function Graphic() {
    const [state, dispatch] = useContext(TaskContext);
    let lastWeek = DateTimeUtils.getLastWeekRange();
    let tasksFromLastWeek = [].concat(state.taskList).filter(x => x.startDate >= lastWeek.start && x.endDate <= lastWeek.end);
    let tasksInProgress = tasksFromLastWeek.filter(x => x.statusId == taskStatusIdsConst.in_progress);
    let tasksCompleted = tasksFromLastWeek.filter(x => x.statusId == taskStatusIdsConst.completed);
    const data = [
        {x: taskStatusesConst.in_progress, y: tasksInProgress.length},
        {x: taskStatusesConst.completed, y: tasksCompleted.length},
    ];
    return (
        <>
            <p>Gráfica de historial de tareas de la semana anterior</p>
            <ul className="colors-preview-container">
                <li>
                    <span className="color-preview cyan"></span><p>{taskStatusesConst.in_progress}: {tasksInProgress.length}</p>
                </li>
                <li>
                <span className="color-preview green"></span><p>{taskStatusesConst.completed}: {tasksCompleted.length}</p>
                </li>
            </ul>
            <Row className="justify-content-md-center">
                <Col md={6} xs={8}>
                    <VictoryPie 
                        data={data}
                        style={{ labels: { fontSize: 8, fill: "black", padding: 12}}}
                        animate={{duration: 2000}}
                        colorScale={["cyan", "green", "orange", "red"]}
                    />
                </Col>
            </Row>
        </>
    );
}