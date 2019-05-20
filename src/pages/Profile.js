import React, { Component } from 'react';
import { Container, Row, Col, Button,  Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup, Card, CardTitle, CardBody } from 'reactstrap';
import '../App.css';
import { FaCity , FaEnvelopeSquare, FaSuitcase} from "react-icons/fa";
import { Route, Redirect, withRouter } from 'react-router';
import {  Link } from 'react-router-dom';

class Profile extends Component {
  state = {

  }


  render() {
    if(this.props.user){
      if (this.props.user.role === 'admin') {
        return (
          <Redirect to={{
          pathname: '/adminprofile/'
          }} />
        )
      }
      let sprintsList = this.props.sprints.map((sprint, i) => {
        return (
          <div key={`sprint-${sprint._id}`}>
            <Card body className="text-center" id="card-body">
               <Link to={`/board/${sprint._id}`}>
                  <CardBody>Title: {sprint.title}</CardBody>
               </Link>
            </Card>
          </div>
        )
      });

      return (
      <Container className="profile">
        <Row>
          <Col md="6">
            <Row>
              <Col>
                <img id="userprofile" src={this.props.user.image} />
              </Col>
            </Row>
            <Row id="userabout">
              <Col>
                <h5 id="username">{this.props.user.firstName + ' ' + this.props.user.lastName}</h5>
              <Col className="subinfo">
                <h5><FaEnvelopeSquare />: {this.props.user.email}</h5>
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
            <Col id="displayProjects">{sprintsList}</Col>
          </Col>
        </Row>
      </Container>
    );
  };
    return(
      <div>
      <p>This is a profile page. You must be logged in to see it.</p>
      <p>Would you like to <a href="/login">Log In</a> or <a href="/signup">Sign up</a>?</p>
      </div>
    );
  }
}

export default Profile;
