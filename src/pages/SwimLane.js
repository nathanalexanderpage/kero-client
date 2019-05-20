import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SERVER_URL from '../constants/server';
import axios from 'axios';
import {Card, Col, Container, Row, CardTitle, CardBody } from 'reactstrap'
import { FaCity , FaEnvelopeSquare, FaSuitcase , FaTrash, FaWrench} from "react-icons/fa";
import {  Link } from 'react-router-dom';
import Task from './Task';

class SwimLane extends Component {
  // You will have props!

    drop = (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('transfer');
      e.target.appendChild(document.getElementById(data));
      let newState = {status:this.props.titleStatus}
      let token = localStorage.getItem('serverToken');
      console.log(newState);
      console.log("the data",data);
      axios.put(`${SERVER_URL}/tasks/${data}`, newState,
        {
          headers: {
           'Authorization' : `Bearer ${token}`
         }
      })
      .then(response=> {
        console.log("response from update status",response);

      })
      .catch(err => {
        console.log('error axios to server:');
        console.log(err);
      })
    }

    allowDrop = (e) => {
      e.preventDefault();
    }

  render() {
    // map through this.props.tasks, call your variable below
    console.log(this.props.users);
    if(this.props.tasks){
      let taskCards = this.props.tasks.map((task,index)=> {
        console.log(task);
        return (
             <Task id={task._id} task={task} users={this.props.users} rerender={this.props.rerender} />
        )
      })

    return (
      <div id ={this.props.id}  onDrop={this.drop} onDragOver={this.allowDrop}>
        <Container>
          <Row>
            <Col>
              <div>{this.props.project}</div>
              <div>{this.props.sprint}</div>
              <Row id="mainboard">
                <Col>
                  <div className= 'board-columns'>
                    <h6 className= 'column-name'>{this.props.title}</h6>
                    <hr></hr>
                    {taskCards}
                    {this.props.children}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
      </div>
      )
  }
  return (
    <Container>
      <Row >
        <Col>
        <div>{this.props.project}</div>
          <div>{this.props.sprint}</div>
          <Row id="mainboard">
            <Col>
              <div className= 'board-columns'>
                <h6 className= 'column-name'>{this.props.title}</h6>
                <hr></hr>
              </ div>
            </Col>
          </Row>
          </Col>
      </Row>
    </Container>
    )
  }
}

export default SwimLane


SwimLane.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
}
