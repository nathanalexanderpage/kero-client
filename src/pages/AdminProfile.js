import React, { Component } from 'react';
import { Container, Row, Col, Button,  Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup, Card, CardTitle, CardBody } from 'reactstrap';
import '../App.css';
import SERVER_URL from '../constants/server';
import axios from 'axios';
import {  Link } from 'react-router-dom';
import { Route, Redirect, withRouter } from 'react-router';
import { FaCity , FaEnvelopeSquare, FaSuitcase , FaTrash, FaWrench} from "react-icons/fa";

class AdminProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      startDate: '',
      finishDate: '',
      titlE: '',
      startDatE: '',
      finishDatE: '',
      modalCreate: false,
      modalEdit: false,
      redirect: false,
      newboard: '',
      editSprint: ''
    };

    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  handleTitleChange = (e) => { this.setState({ title: e.target.value }); }
  handleStartDateChange = (e) => { this.setState({ startDate: e.target.value }); }
  handleFinishDateChange = (e) => { this.setState({ finishDate: e.target.value }); }
  handleTitlEChange = (e) => { this.setState({ titlE: e.target.value }); }
  handleStartDatEChange = (e) => { this.setState({ startDatE: e.target.value }); }
  handleFinishDatEChange = (e) => { this.setState({ finishDatE: e.target.value }); }


  componentDidMount = () => {
    // GET USER INFO

  }
  toggleCreate() {
    this.setState(prevState => ({
      modalCreate: !prevState.modalCreate
    }));
  }

  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  handleSubmit = (e) => {

    e.preventDefault();
    let newState = {...this.state};
    delete newState.modalCreate;
    delete newState.modalEdit;
    delete newState.redirect;
    delete newState.newboard;
    delete newState.startDatE;
    delete newState.titlE;
    delete newState.finishDatE;
    delete newState.editSprint;

    let token = localStorage.getItem('serverToken');
    axios.post(`${SERVER_URL}/sprints/`, newState,
      {
        headers: {
         'Authorization' : `Bearer ${token}`
       }
     })
    .then(response=> {
      this.setState({
          title: '',
          startDate: '',
          finishDate: '',
          newboard:response.data._id,
          redirect: true
      })
      this.props.rerender()
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    })
  }

  handleDeleteSprint = (sprint) =>{
    let token = localStorage.getItem('serverToken');
    axios.delete(`${SERVER_URL}/sprints/${sprint}`,
      {
        headers: {
         'Authorization' : `Bearer ${token}`
       }
     })
    .then(response=> {
     console.log("deleted", response);
     this.props.rerender()
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    })

  }



   editSprint = (sprint) =>{
     this.setState({editSprint:sprint})
     let token = localStorage.getItem('serverToken');
     axios.get(`${SERVER_URL}/sprints/${sprint}`,
       {
         headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
     .then(response=> {
      this.setState({
          titlE: response.data.title,
          startDatE: response.data.startDate,
          finishDatE: response.data.finishDate
      })
      this.toggleEdit()
     })
     .catch(err => {
       console.log('error axios to server:');
       console.log(err);
     })

   }

   handleSubmitEdit = (e) => {

     e.preventDefault();
     let newState2 = {...this.state};
     delete newState2.modalCreate;
     delete newState2.modalEdit;
     delete newState2.redirect;
     delete newState2.newboard;
     delete newState2.startDate;
     delete newState2.title;
     delete newState2.finishDate;
     delete newState2.editSprint;
     let token = localStorage.getItem('serverToken');
     axios.put(`${SERVER_URL}/sprints/${this.state.editSprint}`, newState2,
       {
         headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
     .then(response=> {
       console.log("MODIFICADOS", response);
       this.setState({
           titlE: '',
           startDatE: '',
           finishDatE: '',
           editSprint:''
       })
       this.props.rerender()
     })
     .catch(err => {
       console.log('error axios to server:');
       console.log(err);
     })
   }


  render() {

    if (this.state.redirect === true) {
      return (
        <Redirect to={{
        pathname: '/board/'+ this.state.newboard
        }} />
      )
    }

    if (this.props.user) {
      if (this.props.user.role === 'user') {
        return (
          <Redirect to={{
          pathname: '/profile/'
          }} />
        )
      }
      let sprintsList = this.props.sprints.map((sprint, i) => {
        return (
          <div key={`sprint-${sprint._id}`}>
              <Card body className="text-center" id="card-body">
                <CardTitle>
                  <Link
                    onClick={ () => this.handleDeleteSprint(sprint._id)} >
                    <FaTrash id="deleteicon"/>
                  </Link>
                  <Link
                  onClick={ () => this.editSprint(sprint._id)} >
                    <FaWrench id="modifyicon"/>
                  </Link>
                </CardTitle>
                 <Link to={`/board/${sprint._id}`}>
                    <CardBody>Title: {sprint.title}</CardBody>
                 </Link>
              </Card>
          </div>
        );
      });

      return (
        <Container className="profile">
          <Row>
            <Col md="6">
              <Row>
                <Col>
                  <img  id="userprofile" src={this.props.user.image}  />
                </Col>
              </Row>
              <Row id="userabout">
                 <Col>
                   <h5 id="username">{this.props.user.firstName + ' ' + this.props.user.lastName}</h5>
                   <hr></hr>
                   <Col className="subinfo">
                     <h5><FaEnvelopeSquare/>: {this.props.user.email}</h5>
                     <h5><FaSuitcase/> : {this.props.user.role}</h5>
                     <h5><FaCity/>: {this.props.user.company}</h5>
                   </Col>
                 </Col>
              </Row>
            </Col>
            <Col md="6" >
            <Col>
              <div className="your-sprints">
                <h1>Your Sprints</h1>
              </div>
            </Col>
              <Col id="displayProjects">
                {sprintsList}
              </Col>
            </Col>
          </Row>
          {/* THIS IS THE MODAL TO CREATE A SPRINT*/}
          <Row>
            <Col>
              <Form
                inline
                onSubmit={(e) => e.preventDefault()}
              >
                <Button
                  color="secondary"
                  onClick={this.toggleCreate}
                >
                  New Sprint
                </Button>
              </Form>
              <Modal
                isOpen={this.state.modalCreate}
                toggleCreate={this.toggleCreate}
                className={this.props.className}
              >
                <Form onSubmit={this.handleSubmit}>
                <ModalHeader toggleCreate={this.toggleCreate}>Create a New Sprint</ModalHeader>
                <ModalBody>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="title placeholder"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                  />
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    placeholder="start date placeholder"
                    value={this.state.startDate}
                    onChange={this.handleStartDateChange}
                  />
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="finishDate"
                    placeholder="finish date placeholder"
                    value={this.state.finishDate}
                    onChange={this.handleFinishDateChange}
                  />
                  <Label > Author </Label>
                  <Input
                    name="author"
                    plaintext
                    value={this.props.user.firstName+ ' ' + this.props.user.lastName}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    type="submit" onClick={this.toggleCreate}
                  >
                    Create
                  </Button>{' '}
                    <Button color="secondary" onClick={this.toggleCreate}>Cancel</Button>
                </ModalFooter>
              </Form>
            </Modal>
          </Col>
        </Row>
        {/* THIS IS THE MODAL TO EDIT A SPRINT*/}
        <Row>
          <Col>

            <Modal
              isOpen={this.state.modalEdit}
              toggleCreate={this.toggleEdit}
              className={this.props.className}
            >
              <Form onSubmit={this.handleSubmitEdit}>
              <ModalHeader toggleCreate={this.toggleEdit}>Edit Sprint</ModalHeader>
              <ModalBody>
                <Label>Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="title placeholder"
                  value={this.state.titlE}
                  onChange={this.handleTitlEChange}
                />
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  placeholder="start date placeholder"
                  value={this.state.startDatE}
                  onChange={this.handleStartDatEChange}
                />
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="finishDate"
                  placeholder="finish date placeholder"
                  value={this.state.finishDatE}
                  onChange={this.handleFinishDatEChange}
                />

              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit" onClick={this.toggleEdit}
                >
                  Update
                </Button>{' '}
                  <Button color="secondary" onClick={this.toggleEdit}>Cancel</Button>
              </ModalFooter>
            </Form>
          </Modal>
        </Col>
      </Row>
    </Container>
    );
    }
    return (
      <div>
        <p>This is a profile page. You must be logged in to see it.</p>
        <p>Would you like to <a href="/login">Log In</a> or <a href="/signup">Sign up</a>?</p>
      </div>
    );
  }
}


export default AdminProfile;
