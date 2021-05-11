import { Container, Row, Col, Navbar } from 'react-bootstrap'
import Layout from './components/Layout/Layout'
import TaskByUser from './containers/Tasks/TasksByUser'
import { TaskContextProvider } from './stateManagement/provider/TaskContextProvider'

function App() {
  return (
    <>
      <Layout>
        <TaskContextProvider>
          <TaskByUser/>
        </TaskContextProvider>
      </Layout>
    </>
  );
}

export default App;
