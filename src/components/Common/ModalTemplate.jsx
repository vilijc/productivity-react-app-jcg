import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Modal } from 'react-bootstrap'

/**
 * Template para modal
 * Cuando prop.show viene en true se muestra en modal en un portal
 * @param {*} props 
 * @returns 
 */
export default function ModalTemplate(props) {
  const {show, title, onClose, onOk, children, isValid} = props;
  return (
    show ? ReactDOM.createPortal(
      <Modal show={show} onHide={onClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={onOk} disabled={!isValid}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    ,document.getElementById('modal-container')) : null
  );
}