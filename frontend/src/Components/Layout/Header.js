// Header.js
import React, { Fragment, useEffect, useState } from 'react'
import '../../App.css'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = ({cartItems}) => {
  const [user, setUser] = useState('')
  const navigate = useNavigate()
  const logoutUser = async () => {

      try {
          await axios.get(`http://localhost:4001/api/v1/logout`)

          setUser('')

          logout(() => navigate('/'))
          
      } catch (error) {
          toast.error(error.response.data.message)

      }
  }
  const logoutHandler = () => {
      logoutUser();
      toast.success('log out', {
          position: toast.POSITION.BOTTOM_RIGHT
      });
  }
  useEffect(() => {
      setUser(getUser())
  }, [])
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
        <Link to="/about" id="cart"className="ml-3" style={{ color: 'yellow' }}>About Us</Link>
            <span id="cart" className="ml-3"  style={{ color: 'yellow' }}>Cart</span>
            <span className="ml-1" id="cart_count">{cartItems.length}</span>  
            {user ? (<div className="ml-4 dropdown d-inline">
                        <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <figure className="avatar avatar-nav">
                                <img
                                    src={user.avatar && user.avatar.url}
                                    alt={user && user.name}
                                    className="rounded-circle"
                                />
                            </figure>
                            <span>{user && user.name}</span>
                        </Link>

                        <div className="dropdown-menu"  style={{backgroundColor: 'grey', width:'100%'}}aria-labelledby="dropDownMenuButton">
                            {user && user.role === 'admin' && (
                                <Link className="dropdown-item" style={{color: 'yellow'}} to="/dashboard">Dashboard</Link>
                            )}
                            <Link className="dropdown-item" style={{color: 'yellow'}} to="/orders/me">Orders</Link>
                            <Link className="dropdown-item" style={{color: 'yellow'}} to="/me">Profile</Link>

                            <Link
                                className="dropdown-item text-danger" style={{color: 'yellow'}} to="/" onClick={logoutHandler}
                            >
                                Logout
                            </Link>
                        </div>
                    </div>) : <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>}

      
        </div>
      </nav>
    </Fragment>
  );
}

export default Header;
