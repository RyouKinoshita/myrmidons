import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar-wrapper">
      <nav id="sidebar">
        <ul className="list-unstyled components">
          <li>
            <Link to="/dashboard">
              <i className="fa fa-tachometer"></i> Dashboard
            </Link>
          </li>

          <li>
            <a
              href="#serviceSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-cogs"></i> Services
            </a>
            <ul className="collapse list-unstyled" id="serviceSubmenu">
              <li>
                <Link to="/admin/service">
                  <i className="fa fa-clipboard"></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/service/new">
                  <i className="fa fa-plus"></i> Create
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <a
              href="#projectSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-tasks"></i> Projects
            </a>
            <ul className="collapse list-unstyled" id="projectSubmenu">
              <li>
                <Link to="/admin/portfolio">
                  <i className="fa fa-clipboard"></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/portfolio/new">
                  <i className="fa fa-plus"></i> Create
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/admin/users">
              <i className="fa fa-user"></i> Users
            </Link>
          </li>

          <li>
            <Link to="/admin/orders">
              <i className="fa fa-shopping-cart"></i> Orders
            </Link>
          </li>

          <li>
            <Link to="/admin/portfolio">
              <i className="fa fa-product-hunt"></i> Portfolio
            </Link>
          </li>

          <li>
            <a
              href="#memberSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-users"></i> Team
            </a>
            <ul className="collapse list-unstyled" id="memberSubmenu">
              <li>
                <Link to="/admin/MemberList">
                  <i className="fa fa-clipboard"></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/NewMember">
                  <i className="fa fa-plus"></i> Create
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
