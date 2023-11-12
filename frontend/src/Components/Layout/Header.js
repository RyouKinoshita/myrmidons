// Header.js
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css'

const Header = () => {

  return (
    <Fragment>
      <nav className="navbar row">
          <div className="col-12 col-md-3">
            <div className="navbar-brand">
              <img src="./images/MYR.png" alt="Logo" style={{ width: '100px', height: 'auto' }}/>
              <span id="cart" className="ml-3" ><a href="/" style={{ color: 'yellow' }}>Home</a></span>
            </div>
          </div>
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {/* <Search /> */}
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <span id="cart" className="ml-3"  style={{ color: 'yellow' }}>|About Us|</span>
        <span id="cart" className="ml-3"  style={{ color: 'yellow' }}>|Team|</span>
        <span id="cart" className="ml-3"  style={{ color: 'yellow' }}>|Portfolio|</span>
        <span id="cart" className="ml-3"  style={{ color: 'yellow' }}>|Contact Us|</span>
            <span id="cart" className="ml-3"  style={{ color: 'yellow' }}>Cart</span>
            <span className="ml-1" id="cart_count">1</span>        
        </div>
      </nav>
    </Fragment>
  );
}

export default Header;
