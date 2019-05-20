import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from './constants/server';
import './App.css';
import Footer from './layout/Footer';
import Home from './Home';
import Login from './auth/Login';
import Navigation from './layout/Navigation';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import Signup from './auth/Signup';
import Board from './pages/Board';
import Task from './pages/Task';
import Swimlane from './pages/SwimLane';

let async = require("async");

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      projects: [],
      sprints: [],
      tasks: [],
      redirects : {
        project:false,
        sprint:false,
        task:false
      },
      project: null,
      sprint: null,
      task: null,
      userProfInfo: null
    }
  }

  componentDidMount = () => {
    // GET USER INFO
    this.getUser();
    this.loadUserData();

  }

  convertDateEpochUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()).getTime()/1000 - 25200;
  }
  convertEpochToLocal(utcSeconds) {
    let d = new Date(0);
    d.setUTCSeconds(utcSeconds);
    return d;
  }

  loadUserData = () => {
    console.log("INSIDE componentDidMount");
    function sprintList(sprintRet) {
      console.log(`GET ${SERVER_URL}/sprints/admin`);
      let token = localStorage.getItem('serverToken');
      axios.get(`${SERVER_URL}/sprints/admin`, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then(foundSprints => {
        console.log('Success getting Sprints');
        console.log(foundSprints.data);
        sprintRet(null, foundSprints.data);
      })
      .catch(err => {
        console.log('error axios to server:');
        console.log(err);
      });
    }

    function tasksList(taskRet) {
      console.log(`GET ${SERVER_URL}/tasks/mytasks`);
      let token = localStorage.getItem('serverToken');
      axios.get(`${SERVER_URL}/tasks/mytasks`, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then(foundTasks=> {
        console.log('Success getting Tasks');
        console.log(foundTasks.data);
        taskRet(null, foundTasks.data);
      })
      .catch(err => {
        console.log('error axios to server:');
        console.log(err);
      });
    }

    async.parallel([
      sprintList,
      tasksList
    ], (error, dataLists) => {
      console.log('USER IS ROLE:');
      console.log(this.state.user.role);
      console.log("ready to setState");
      console.log(dataLists);
      if (this.state.user.role === 'admin') {
        this.setState({
          sprints: dataLists[0],
          tasks: dataLists[1]
        });
      } else if (this.state.user.role === 'user') {
        let token = localStorage.getItem('serverToken');
        axios.get(`${SERVER_URL}/users/${this.state.user.id}/sprints`, {
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        })
        .then(foundSprints => {
          console.log('Success getting REG USER Sprints');
          console.log(foundSprints.data);
          this.setState({
            sprints: foundSprints.data,
            tasks: dataLists[1]
          });
        })
        .catch(err => {
          console.log('error axios to server:');
          console.log(err);
        });
      }
    });
  }

  // methods for altering existing data for this user
  // at the end of each will setState so front-end page reflects database changes

  addSprint = () => {
    let updatedSprints;
    this.setState({sprints: updatedSprints});
  }
  removeSprint = () => {
    let updatedSprints;
    this.setState({sprints: updatedSprints});
  }
  editSprint = () => {
    let updatedSprints;
    this.setState({sprints: updatedSprints});
  }
  addTask = () => {
    let updatedTasks;
    this.setState({tasks: updatedTasks});
  }
  removeTask = () => {
    let updatedTasks;
    this.setState({tasks: updatedTasks});
  }
  editTask = () => {
    let updatedTasks;
    this.setState({tasks: updatedTasks});
  }
  getTask = (taskId) => {

    this.setState({})
  }

  resetUser = () => {
    this.setState({
      user: null,
      sprints: [],
      tasks: [],
      redirects : {
        sprint:false,
        task:false
      },
      sprint: null,
      task: null,
      userProfInfo: null
    });
  }

  getUser = () => {
    // TO do: SEE IF THERE'S A TOKEN
    console.log(localStorage.getItem('serverToken'));
    let token = localStorage.getItem('serverToken');
    if (token) {
      axios.get(`${SERVER_URL}/auth/current/user`, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then(response=> {
        console.log("this is what you are passing",);
        console.log(response);
        this.setState({user: response.data.user})
      })
      .catch(err=> {
        this.resetUser();
        console.log('error getting user by token:');
        console.log(err);
      })
    } else {
      this.resetUser();
      console.log('no user token found');
    }
  }

  getUserProfInfo = (userProfId) => {
    console.log('inside getUserProfInfo');
    console.log(userProfId);
    let token = localStorage.getItem('serverToken');
    axios.post(`${SERVER_URL}/users/get/${userProfId}`, {}, {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(foundUser=> {
      console.log('Success getting userProfInfo');
      console.log(foundUser);
      this.setState({
        userProfInfo: foundUser
      })
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Navigation user={this.state.user} resetUser={this.resetUser} />

          <div className="container">
            <Route exact path="/" component={Home} />
            <Route path="/login" component={
              () => (
                <Login
                  user={this.state.user}
                  getUser={this.getUser}
                  loadUserData={this.loadUserData}
                />
              )
            } />
            <Route path="/signup" component={
              () => (
                <Signup user={this.state.user} getUser={this.getUser} />
              )
            } />
            <Route path="/profile" component={
              () => (
                <Profile
                  user={this.state.user}
                  sprints={this.state.sprints}
                />
              )
            } />
            <Route path="/adminprofile" component={
              () => (
                <AdminProfile
                  user={this.state.user}
                  sprints={this.state.sprints}
                  addProject={this.state.addProject}
                  removeProject={this.state.removeProject}
                  editProject={this.state.editProject}
                  getProject={this.state.getProject}
                  redirects={this.state.redirects}
                  rerender={this.loadUserData}
                />
              )
            } />
          <Route path="/board/:id" component={
              ({match}) => (
                <Board
                  user={this.state.user}
                  sprintId={match.params.id}
                  rerender={this.loadUserData}
                  />
              )
            } />

            <Route path="/swimlane" component={
              () => (
                <Swimlane
                  user={this.state.user}
                  tasks={this.state.tasks}
                  addTask={this.state.addTask}
                  removeTask={this.state.removeTask}
                  editTask={this.state.editTask}
                  />
              )
            } />

            <Route path="/task" component={
              () => (
                <Task user={this.state.user} getUserProfInfo={this.state.getUserProfInfo} />
              )
            } />
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
