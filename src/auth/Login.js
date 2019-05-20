import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from '../constants/server';
import { Button, Col, Form, FormGroup, Label, Input, Fade } from 'reactstrap';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleEmailChange = (e) => { this.setState({ email: e.target.value }); }

  handlePasswordChange = (e) => { this.setState({ password: e.target.value }); }

  handleSubmit = (e) => {
    e.preventDefault();
    // send data to server
    axios.post(`${SERVER_URL}/auth/login`, this.state)
    .then(response=> {
      console.log(response);
      // take token from response and set it in local storage
      localStorage.setItem('serverToken', response.data.token)
      // update user state info (in App.js)
      this.props.getUser();
      this.props.loadUserData();
    })
    .catch(err => {
      console.log('TODO: make error messages for user to see');
      console.log(err);
    })
    console.log('after the flood')
  }

  render() {
    if(this.props.user && this.props.user.role !== 'admin'){
      return (<Redirect to="/profile" />);
    } else if(this.props.user && this.props.user.role === 'admin'){
      return (<Redirect to="/adminprofile" />);
    }
    return(
      <div className='sign-in'>
        <h2>Log in to Kero</h2>
        <Link to="/signup">or create an account</Link>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Label for="Email">Email</Label>
            <Input type="email"
                    name="email"
                    id="email"
                    placeholder="example@email.com"
                    value={this.state.email}
                    onChange={this.handleEmailChange} />
          </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <Label for="Password">Password</Label>
              <Input type="password"
                      name="password"
                      id="password"
                      placeholder="shhhh"
                      onChange={this.handlePasswordChange} />
            </Col>
          </FormGroup>
            <div>
              <Button color="link" size="lg" >Log In</Button>
              <Fade in={this.state.fadeIn} tag="h5" className="mt-3"></Fade>
            </div>
          </Form>
        </div>
      );
    }
  };

export default Login;
