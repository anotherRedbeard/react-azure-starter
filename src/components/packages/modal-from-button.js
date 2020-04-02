import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'

const ModalFromButton = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
      setModal(!modal);
  }

    const closeBtn = <button className="close" onClick={toggle}>&times;</button>

    const label = props.buttonLabel

    let button = ''
    let title = ''

    if(label === 'Edit'){
        button = <Button size="sm" color="primary" onClick={toggle} disabled={!props.user.isAdmin}>{label}</Button>
        title = 'Edit Item'
    } else {
        button = <Button color="success" onClick={toggle} disabled={!props.user.isAdmin} >{label} </Button>
        title = 'Add New Item'
    }
    
    return (
        <div>
        {button}
        <Modal isOpen={modal} toggle={toggle} className={props.className}>
            <ModalHeader toggle={toggle} close={closeBtn}>{title}</ModalHeader>
            <ModalBody>
                {props.render(modal, toggle)}
            </ModalBody>
        </Modal>
        </div>
    )
}

export default ModalFromButton;