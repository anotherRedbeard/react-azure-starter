import React, {useState} from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, 
  Button } from 'reactstrap';
import config from '../utils/config';
import '@fortawesome/fontawesome-free/css/all.css';

const UserAvatar = (props) => {
  // If a user avatar is available, return an img tag with the pic
  if (props.user.avatar) {
    return <img
            src={props.user.avatar} alt="user"
            className="rounded-circle align-self-center mr-2"
            style={props.style}></img>;
  }

  // No avatar available, return a default icon
  return <i
          className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
          style={props.style}></i>;
}

const AuthNavItem = (props) => {
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (props.isAuthenticated) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar user={props.user} style={{width: '32px'}}/>
        </DropdownToggle>
        <DropdownMenu>
          <div className='text-center'>
            <UserAvatar user={props.user} style={{width: '80px', marginTop: '10px'}}/>
            <h5 className="dropdown-item-text mb-0" style={{marginTop: '25px'}}>{props.user.displayName}</h5>
            <p className="dropdown-item-text text-muted mb-0">{props.user.email}</p>
          </div>
          <DropdownItem divider />
          <div className='text-center'>
            <Button onClick={props.authButtonMethod} outline color="secondary">Sign Out</Button>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  // Not authenticated, return a sign in link
  return (
    <NavItem>
      <NavLink onClick={props.authButtonMethod}>Sign In</NavLink>
    </NavItem>
  );
}

const NavBar = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen({isOpen: !isOpen});
  }

  // Only following nav item if logged in
  let calendarLink = null;
  let postsLink = null;
  let reactTableLink = null;
  if (props.isAuthenticated) {
    calendarLink = (
      <NavItem>
        <RouterNavLink to="/calendar" className="nav-link" exact>Calendar</RouterNavLink>
      </NavItem>
    );
    postsLink = (
      <NavItem>
        <RouterNavLink to="/posts" className="nav-link" exact>Posts</RouterNavLink>
      </NavItem>
    );
    reactTableLink = (
      <NavItem>
        <RouterNavLink to="/reacttableexample" className="nav-link" exact>React Table</RouterNavLink>
      </NavItem>
    );
  }

  return (
    <div>
      <Navbar color={config.env === 'Production' ? 'custom-background' : 'sandbox'} light expand="md" fixed="top">
        <NavbarBrand href="/">
          <img src="/logo192.png" width="30" height="30" className="d-inline-block align-top" alt="React logo"/>
        </NavbarBrand>
        <NavbarBrand href="/">React Azure Starter{config.env !== 'Production' ? ' - ' + config.env:''}</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <RouterNavLink to="/" className="nav-link" exact>Home</RouterNavLink>
            </NavItem>
            {calendarLink}
            {postsLink}
            {reactTableLink}
          </Nav>
          <Nav className="justify-content-end" navbar>
            <AuthNavItem
              isAuthenticated={props.isAuthenticated}
              authButtonMethod={props.authButtonMethod}
              user={props.user} />
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;