import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar-wrapper">
      <nav id="sidebar">
        <ul className="list-unstyled components">
          <li>
            <Link to="/dashboard" style={{color:"black"}}>
              <i className="fa fa-tachometer" style={{color:"black"}}></i> Dashboard
            </Link>
          </li>

          <li>
            <a
              href="#serviceSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
              style={{color:"black"}}
            >
              <i className="fa fa-cogs"style={{color:"black"}}></i> Services
            </a>
            <ul className="collapse list-unstyled" id="serviceSubmenu">
              <li>
                <Link to="/admin/service" style={{color:"black"}}>
                  <i className="fa fa-clipboard" style={{color:"black"}}></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/service/new" style={{color:"black"}}>
                  <i className="fa fa-plus" style={{color:"black"}}></i> Create
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <a
              href="#serviceSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
              style={{color:"black"}}
            >
              <i className="fa fa-cogs" style={{color:"black"}}></i> Projects
            </a>
            <ul className="collapse list-unstyled" id="serviceSubmenu">
              <li>
                <Link to="/admin/portfolio" style={{color:"black"}}>
                  <i className="fa fa-clipboard" style={{color:"black"}}></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/portfolio/new" style={{color:"black"}}>
                  <i className="fa fa-plus" style={{color:"black"}}></i> Create
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/admin/users" style={{color:"black"}}>
              <i className="fa fa-user" style={{color:"black"}}></i> Users
            </Link>
          </li>

          <li>
            <Link to="/admin/orders"style={{color:"black"}}>
              <i className="fa fa-shopping-cart" style={{color:"black"}}></i> Orders
            </Link>
          </li>

          <li>
            <Link to="/admin/portfolio" style={{color:"black"}}>
              <i className="fa fa-product-hunt" style={{color:"black"}}></i> Portfolio
            </Link>
          </li>

          <li>
            <a
              href="#memberSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
              style={{color:"black"}}
            >
              <i className="fa fa-cogs" style={{color:"black"}}></i> Team
            </a>
            <ul className="collapse list-unstyled" id="memberSubmenu">
              <li>
                <Link to="/admin/MemberList" style={{color:"black"}}>
                  <i className="fa fa-clipboard" style={{color:"black"}}></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/NewMember" style={{color:"black"}}>
                  <i className="fa fa-plus" style={{color:"black"}}></i> Create
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
