import React, { Component } from 'react';
import {Container, Button} from 'reactstrap'
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    return(
      <Container className="home-page">
        <div className="home-info">
          <h1>Kero, task management for Software Engineers!</h1>
          <h6>Kero is more than a to-do list. It tracks tasks from beginning to end, helps admins delegate and sets deadlines to make sure projects get done on time.</h6>
          <h6>
          Task management software, like Kero, empowers software engineers to work more productively and efficiently together.
          </h6>
          <Link to="/signup"><Button color="secondary" size="lg" active>Sign up for free!</Button>{' '}</Link>
        </div>
        <div className="coding-img">
          <img src="https://cdn-images-1.medium.com/max/853/1*zJkojKNpFD9HFGPJLCs15Q.jpeg"  />
        </div>
      </Container>

      );
  }
}

export default Home;
