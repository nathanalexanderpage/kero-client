import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Card, CardTitle, CardBody, Button, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form  } from 'reactstrap';
import {  Link } from 'react-router-dom';
import { FaTrash, FaWrench} from "react-icons/fa";
import axios from 'axios';
import SERVER_URL from '../constants/server';


class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      id: this.props.id,
      assignedTo: '',
      title: '',
      manHourBudget: 0,
      status: '',
      dateAssigned: '',
      dateCompleted: '',
      description: '',
      sprint: this.props.sprintId,
      userList: []
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  drag = (e) => {
    e.dataTransfer.setData('transfer', e.target.id);
  }

  noAllowDrop = (e) => {
    e.stopPropagation();
  }

  changeState = (e) => {
    console.log(e);
  }

  componentDidMount = () => {
    console.log(this.props.users);
    this.setState({
      assignedTo: this.props.task.assignedTo,
      title: this.props.task.title,
      manHourBudget: this.props.task.manHourBudget,
      status: this.props.task.status,
      description: this.props.task.desc,
      sprint: this.props.task.sprint,
      userList: this.props.users
    })
    if (this.props.task.dateAssigned) {
      this.setState({
        dateAssigned: this.props.task.dateAssigned.slice(0,10)
      })
    }
    if (this.props.task.dateCompleted) {
      dateCompleted: this.props.task.dateCompleted.slice(0,10)
    }
  }


  handleAssignedToChange = (e) => { this.setState({ assignedTo: e.target.value }); }
  handleTitleChange = (e) => { this.setState({ title: e.target.value }); }
  handleManHourBudgetChange = (e) => { this.setState({ manHourBudget: e.target.value }); }
  handleStatusChange = (e) => { this.setState({ status: e.target.value }); }
  handleDateAssignedChange = (e) => { this.setState({ dateAssigned: e.target.value }); }
  handleDateCompletedChange = (e) => { this.setState({ dateCompleted: e.target.value }); }
  handlePrerequisiteTasksChange = (e) => { this.setState({ prerequisiteTasks: e.target.value }); }
  handleDescriptionChange = (e) => { this.setState({ description: e.target.value }); }


  handleDeleteTask = () => {
    console.log(this.props.id);
    let token = localStorage.getItem('serverToken');
    axios.delete(`${SERVER_URL}/tasks/${this.props.id}`,
      {
        headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response=> {
    console.log("deleted", response);
    this.props.rerender();
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    })

  }


  getPicture = (user) => {
    let result = this.props.users.map(Wanteduser =>{
        if(Wanteduser.id == user){
          return  Wanteduser.image
        }
    });
    let finalResult = result.filter(options => options != undefined)
      return finalResult[0]
  }

  getName = (user) => {
    let result = this.props.users.map(Wanteduser =>{
        if(Wanteduser.id == user){
          return  Wanteduser.firstName
        }
    });
    let finalResult = result.filter(options => options != undefined)
      return finalResult[0]
  }


  handleSubmit = (e) => {
    e.preventDefault();
    let newState = {...this.state}
    delete newState.modal
    delete newState.t
    console.log('NEW STATE');
    if (newState.assignedTo === '') {
      newState.assignedTo = null;
    }
    console.log(newState);
    let token = localStorage.getItem('serverToken');
    axios.put(`${SERVER_URL}/tasks/${newState.id}`, newState,
      {
        headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response=> {
      console.log('Success');
      console.log(response);
      this.setState({
        // modal : {
          assignedTo:'',
          title:'',
          manHourBudget: 0,
          status:'',
          dateAssigned:'',
          dateCompleted:'',
          description:''
      })
      this.props.rerender()
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    })
  }

  render() {
    if(!this.props.task){
      return (
        <div>
          <p>This page is for viewing information on a task. You must be logged in to see it.</p>
          <p>Would you like to <a href="/login">Log In</a> or <a href="/signup">Sign up</a>?</p>
        </div>
      );
    }

    let list = () => {
      let userList = [];
      let throwaway = [];
      let prep = [];
      if (this.props.users[0]) {
        userList.push(<option>TBD</option>);
        throwaway = this.props.users.map((user, i) => {
          return (
            <option
            value={user.id}
            >
            {`${user.firstName} ${user.lastName}`}
            </option>
          )
        });
        while (throwaway.length !== 0) {
          userList.push(throwaway.shift())
        }
      } else {
        userList.push(<option>No users to choose from!</option>);
      }
      return userList;
    }
    let newList = [...list()];
    console.log(list());

    return (
      <div className="tasks" id={this.props.id} draggable="true" onDragStart={this.drag} onDragOver={this.noAllowDrop} onDrop={this.changeState}>
        <Card>
          <CardTitle className="tasktools">
            <div>
              <Link draggable="false" onClick={() => this.handleDeleteTask()} >
                <FaTrash  id="deleteicon"/>
              </Link>
              <Link draggable="false" onClick={() => this.toggle()} >
                <FaWrench  id="modifyicon"/>
              </Link>
            </div>
          </CardTitle>
          <CardBody>
            <div>
              <Row>
                <Col>
                  <img  draggable="false" id="usertask" src={ this.getPicture(this.props.task.assignedTo)}  />
                    {this.getName(this.props.task.assignedTo)}
                    {this.props.children}
                </Col>
                <Col>
                  {this.props.task.title}
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <Form onSubmit={this.handleSubmit}>
            <ModalHeader toggle={this.toggle}>Edit Task</ModalHeader>
            <ModalBody>
              <Label for="assignedTo">Assigned To</Label>
              <Input
                type="select"
                name="assignedTo"
                onChange={this.handleAssignedToChange}
              >
                {newList}
              </Input>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Give it a name"
                value={this.state.title}
                onChange={this.handleTitleChange}
              />
              <Label>Man hours</Label>
              <Input
                type="number"
                name="manHourBudget"
                placeholder="How many hours?"
                value={this.state.manHourBudget}
                onChange={this.handleManHourBudgetChange}
              />
              <Label for="Select Role">Status</Label>
              <Input
                type="select"
                name="status"
                value={this.state.status}
                onChange={this.handleStatusChange}
              >
                <option defaultValue="todo">To Do</option>
                <option value="inprogress">In progress</option>
                <option value="codereview">Code review</option>
                <option value="done">Done</option>
              </Input>
              <Label>Assigned Date</Label>
              <Input
                type="date"
                name="dateAssigned"
                placeholder="date placeholder"
                value={this.state.dateAssigned}
                onChange={this.handleDateAssignedChange}
              />
              <Label>Completed Date</Label>
              <Input
                type="date"
                name="dateCompleted"
                placeholder="date placeholder"
                value={this.state.dateCompleted}
                onChange={this.handleDateCompletedChange}
              />
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                placeholder="Write something"
                rows={5}
                value={this.state.description}
                onChange={this.handleDescriptionChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" onClick={this.toggle}>Save Changes</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>




    );
  }
};

export default Task;


Task.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
}
