import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt ,FaEdit, FaRegIdCard, FaFrog} from 'react-icons/fa';
import { IoMdWalk } from "react-icons/io";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';



export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleLogout = (e) => {
    e.preventDefault();
    // TODO: REMOVE LS TOKEN; UPDATE PARENT STATE
    localStorage.removeItem('serverToken');
    this.props.resetUser();
  }

  render() {
  let links = '';

    if(this.props.user){

      if(this.props.user && this.props.user.role === 'user'){
        links = (
            <span>
              <a onClick={this.handleLogout}><IoMdWalk/> Logout</a>
              <Link to="/profile"><FaRegIdCard/> Profile</Link>
            </span>
          );
      }else if (this.props.user && this.props.user.role === 'admin') {
        links = (
            <span>
              <a onClick={this.handleLogout}> <IoMdWalk/> Logout</a>
              <Link to="/adminprofile"><FaRegIdCard/> Profile</Link>
            </span>
          );

      }
    }
      else {
        links = (
            <span>
              <Link to="/signup"><FaEdit/> Sign Up</Link>
              <Link to="/login"><FaUserAlt/> Log In</Link>
            </span>
          );
      }


      return(

      <div>
       <Navbar color="light" light expand="md">
         <NavbarBrand href="/"><FaFrog/> KERO</NavbarBrand>
         <NavbarToggler onClick={this.toggle} />
         <Collapse isOpen={this.state.isOpen} navbar>
           <Nav className="ml-auto" navbar>
           <NavItem>
             {links}
          </NavItem>
           </Nav>
         </Collapse>
       </Navbar>
     </div>

    );
  }
}
