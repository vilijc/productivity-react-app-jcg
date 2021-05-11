import { Container, Row, Col, Navbar } from 'react-bootstrap';
import './Layout.scss';

/**
 * Layout del proyecto
 * @param {*} param0 
 * @returns 
 */
function App({children}) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          Prueba técnica Javier CG
        </Navbar.Brand>
      </Navbar>
      <Container>
        <Row>
          <Col className="main-content">
            {children}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
