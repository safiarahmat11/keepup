import React, { Component } from 'react';
import { Col, Grid } from 'react-bootstrap';
import './header.css';
import logo from '../img/logo4.jpeg'
import TopNavbar from '../Views/TopNavbar';

class Header extends Component {
  render() {
    return (
      <header className="header-image">
        <Grid>

          <Col xs={3} md={3}>
          	<img  className="logo" alt="logo" src={logo} />
          </Col>
          <Col xs={9} md={9}>
          
          	<h4>Aaron's Summary</h4>
          </Col>
        </Grid>
      </header>
    );
  }
}

export default Header;
