import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'

export default class ModalForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      toggleModal: this.toggle
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  render() {
      const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>

      const label = this.props.buttonLabel

      let button = ''
      let title = ''

      if(label === 'Edit'){
        button = <Button size="sm" color="primary" onClick={this.toggle} disabled={!this.props.user.isAdmin}>{label}</Button>
        title = 'Edit Item'
      } else {
        button = <Button color="success" onClick={this.toggle} disabled={!this.props.user.isAdmin} >{label} </Button>
        title = 'Add New Item'
      }
      
      return (
      <div>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
          <ModalBody>
              {this.props.render(this.state)}
          </ModalBody>
        </Modal>
      </div>
    )
  }
}