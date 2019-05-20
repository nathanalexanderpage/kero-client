import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from '../constants/server';
import { Button, Form, FormGroup, Label, Input, Fade, Col } from 'reactstrap';

class Signup extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      image:'',
      role:'',
      company:''
    };
  }

  handleFirstNameChange = (e) => { this.setState({ firstName: e.target.value }); }

  handleLastNameChange = (e) => { this.setState({ lastName: e.target.value }); }

  handleImageChange = (e) => { this.setState({ image: e.target.value }); }

  handleEmailChange = (e) => { this.setState({ email: e.target.value }); }

  handlePasswordChange = (e) => { this.setState({ password: e.target.value }); }

  handleRoleChange = (e) => { this.setState({ role: e.target.value }); }

  handleCompanyChange = (e) => { this.setState({ company: e.target.value }); }


  handleSubmit = (e) => {
    e.preventDefault();
    // TODO: SEND DATA TO SERVER
    console.log(this.state);
    axios.post(`${SERVER_URL}/auth/signup`, this.state)
    .then(response=> {
      console.log('Success');
      console.log(response);
      // set response.data.token to local storage
      localStorage.setItem('serverToken', response.data.token)
      // TODO: update user in parent component
      this.props.getUser()
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    })
  }

  render() {
    if(this.props.user && this.props.user.role !== 'admin'){
      return (<Redirect to="/profile" />);
    }else if(this.props.user && this.props.user.role === 'admin'){
      return (<Redirect to="/adminprofile" />);
    }


    return(
      <div>
        <h2>Sign up as a new user!</h2>
        <h6> If you already have an account, go log in!</h6>
        <Form onSubmit={this.handleSubmit}>
            <Col xs="9"></Col>
              <FormGroup row>
                <Label for="firstName">First Name</Label>
                <Input type="text"
                        name="firstName"
                        id="first-name"
                        placeholder="My first name is..."
                        value={this.state.firstName}
                        onChange={this.handleFirstNameChange} />
              </FormGroup>
              <FormGroup row>
                <Label for="lastName">Last Name</Label>
                <Input type="text"
                        name="lastName"
                        id="last-name"
                        placeholder="My last name is..."
                        value={this.state.lastName}
                        onChange={this.handleLastNameChange} />
              </FormGroup>
              <FormGroup row>
                <Label for="company">Company</Label>
                <Input type="text"
                        name="company"
                        id="company"
                        placeholder="I work at..."
                        value={this.state.company}
                        onChange={this.handleCompanyChange} />
              </FormGroup>
              <FormGroup row>
                <Label for="email">Email</Label>
                <Input type="email"
                        name="email"
                        id="email"
                        placeholder="example@email.com"
                        value={this.state.email}
                        onChange={this.handleEmailChange} />
              </FormGroup>
              <FormGroup row>
                <Label for="password">Password</Label>
                <Input type="password"
                        name="password"
                        id="password"
                        placeholder="shhhh"
                        onChange={this.handlePasswordChange} />
              </FormGroup>
              <FormGroup row>
                <Label for="passwordVerify">Verify Password</Label>
                <Input type="password"
                        name="passwordVerify"
                        id="verify-password"
                        placeholder="confirm shhhh"
                        onChange={this.handlePasswordChange} />
              </FormGroup>
              <FormGroup row>
                <Label for="Select Role">Select Role</Label>
                <Input type="select"
                        name="select-role"
                        id="select-role"
                        value={this.state.role}
                        onChange={this.handleRoleChange}>
                          <option defaultValue="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="stakeholder">Stake Holder</option>
                </Input>
              </FormGroup>
              <FormGroup row>
                <Label for="Image">Image</Label>
                <Input type="text"
                        name="image"
                        id="image"
                        placeholder="put image url here..."
                        value={this.state.image}
                        onChange={this.handleImageChange}/>
              </FormGroup>
            <div>
              <Button outline color="secondary" size="lg" onClick={this.handleSubmit}>Sign Up</Button>
              <Fade in={this.state.fadeIn} tag="h5" className="mt-3"></Fade>
            </div>
        </Form>
      </div>
    );
  }
}

export default Signup;
