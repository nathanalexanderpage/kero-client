import React, { Component } from 'react';
import { Container, Row, Card, Button, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form  } from 'reactstrap';
import '../App.css';
import axios from 'axios';
import SERVER_URL from '../constants/server';
import Swimlane from './SwimLane'


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprint: this.props.sprintId,
      modal: false,
      assignedTo: '',
      title: '',
      manHourBudget: 0,
      status: '',
      dateAssigned: '',
      dateCompleted: '',
      description: '',
      tasks: [],
      userList: []
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  handleAssignedToChange = (e) => { this.setState({ assignedTo: e.target.value }); }
  handleTitleChange = (e) => { this.setState({ title: e.target.value }); }
  handleManHourBudgetChange = (e) => { this.setState({ manHourBudget: e.target.value }); }
  handleStatusChange = (e) => { this.setState({ status: e.target.value }); }
  handleDateAssignedChange = (e) => { this.setState({ dateAssigned: e.target.value }); }
  handleDateCompletedChange = (e) => { this.setState({ dateCompleted: e.target.value }); }
  handlePrerequisiteTasksChange = (e) => { this.setState({ prerequisiteTasks: e.target.value }); }
  handleDescriptionChange = (e) => { this.setState({ description: e.target.value }); }


  componentDidMount = () => {
    this.loadSprintData()
  }

  loadSprintData = () => {
    let token = localStorage.getItem('serverToken');
    axios.get(`${SERVER_URL}/sprints/${this.state.sprint}/tasks`, {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(foundSprints => {
      console.log('Success getting Sprints');
      console.log(foundSprints.data);
      this.setState({ tasks: foundSprints.data })
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    });
    // grab list of users to populate assignedTo dropdown select in 'new task' modal
    axios.get(`${SERVER_URL}/users`, {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(foundUsers => {
      console.log('Success getting user list');
      console.log(foundUsers.data);
      this.setState({ userList: foundUsers.data })
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    });
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
    axios.post(`${SERVER_URL}/tasks/`, newState,
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
    if(!this.props.user){
      return (
        <div>
          <p>This page is for viewing information on a sprint. You must be <a href="/login">logged in</a> to see it.</p>
        </div>
      );
    }

    let toDo = []
    let doing = []
    let codeReview = []
    let complete = []




    this.state.tasks.forEach((task) => {
      if(task.status === 'todo') {
        toDo.push(task)
      } else if(task.status === 'done') {
        complete.push(task)
      } else if(task.status === 'inprogress') {
        doing.push(task)
      } else if(task.status === 'codereview') {
        codeReview.push(task)
      }
    })

    let userSelects = this.state.userList.map((user, i) => {
      return (
        <option
          value={user.id}
        >
          {`${user.firstName} ${user.lastName}`}
        </option>
      )
    })
    console.log(userSelects);


    return (
      <Container>
        <Row>
          <Col>
            <div>{this.props.sprint}</div>
            <h1>{this.props.title}</h1>
            <Form inline onSubmit={(e) => e.preventDefault()}>
              <Button color="secondary"
                onClick={this.toggle}
                id="new-task">New Task</Button>
            </Form>
            <Row id="mainboard">
              <Col>
                <Swimlane id="dr1" title="To-Do" tasks={toDo} users={this.state.userList} titleStatus="todo" rerender={this.props.rerender} />
              </Col>
              <Col>
                <Swimlane id="dr2" title="Doing" tasks={doing} users={this.state.userList} titleStatus="inprogress" rerender={this.props.rerender} />
              </Col>
              <Col>
                <Swimlane id="dr3" title="Code-Review" tasks={codeReview} users={this.state.userList} titleStatus="codereview" rerender={this.props.rerender} />
              </Col>
              <Col>
                <Swimlane id="dr4" title="Done" tasks={complete} users={this.state.userList} titleStatus="done" rerender={this.props.rerender} />
              </Col>
            </Row>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              className={this.props.className}
            >
              <Form onSubmit={this.handleSubmit}>
                <ModalHeader toggle={this.toggle}>Create a New Task</ModalHeader>
                <ModalBody>
                  <Label for="assignedTo">Assigned To</Label>
                  <Input
                    type="select"
                    name="assignedTo"
                    onChange={this.handleAssignedToChange}
                  >
                    <option>TBD</option>
                    {userSelects}
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
                    {/*/   <Label>Prerequisite Tasks</Label>
                  // <Input
                  //   type="text"
                  //   name="prerequisiteTasks"
                  //   placeholder="related tasks"
                  //   value={this.state.prerequisiteTasks}
                  //   onChange={this.handlePrerequisiteTasksChange}
                  //     >*/}
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
                  <Button color="secondary" type="submit" onClick={this.toggle}>Create</Button>{' '}
                  <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
              </Form>
            </Modal>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Board
