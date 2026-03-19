// src/components/Sidebar.js
import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import {
  Home,
  Grid,
  Users,
  Book,
  FileText,
  User,
  Monitor,
  Target,
  List,
} from "react-feather";
import { Collapse, Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

/* ===============================
   Static Sidebar Data (JSON)
================================ */
const MENU_LIST = [
  {
    id: 1,
    name: "Dashboard",
    url: "/client/dashboard",
    icon: "Home",
    children: [],
  },
  {
    id: 2,
    name: "Invoices",
    url: "/client/invoice",
    icon: "FileText",
    children: [],
  },

];

/* ===============================
   Helpers
================================ */
const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1025) {
    document.body.classList.remove("vertical-sidebar-enable");
    document.documentElement.setAttribute("data-sidebar-size", "lg");
  }
};

/* ===============================
   Icon Factory
================================ */
const iconMap = {
  Home,
  Users,
  User,
  Book,
  Grid,
  FileText,
  Monitor,
  Target,
  List,
};

const renderIcon = (iconName) => {
  const IconComponent = iconMap[iconName] || Grid;
  return <IconComponent size={20} className="icon-dual" />;
};

/* ===============================
   Menu Components
================================ */
const SimpleMenuItem = ({ mod, location }) => (
  <li className="nav-item">
    <Link
      to={mod.url}
      onClick={closeSidebarOnMobile}
      className={`nav-link menu-link d-flex align-items-center 
        ${location.pathname.includes(mod.url) ? "active" : ""}`}
    >
      {renderIcon(mod.icon)}
      <span className="ms-1">{mod.name}</span>
    </Link>
  </li>
);

const CollapsibleMenuItem = ({ mod, openMenu, setOpenMenu, location }) => (
  <li className="nav-item">
    <Link
      to="#"
      className="nav-link menu-link d-flex align-items-center collapsed"
      onClick={(e) => {
        e.preventDefault();
        setOpenMenu(openMenu === mod.id ? null : mod.id);
      }}
      aria-expanded={openMenu === mod.id}
    >
      {renderIcon(mod.icon)}
      <span className="ms-2">{mod.name}</span>
    </Link>

    <Collapse in={openMenu === mod.id}>
      <div className="menu-dropdown">
        <Nav className="nav-sm flex-column">
          {mod.children.map((child) => (
            <Nav.Item key={child.id}>
              <Nav.Link
                as={Link}
                to={child.url}
                onClick={closeSidebarOnMobile}
                className={location.pathname === child.url ? "active" : ""}
              >
                {child.name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </Collapse>
  </li>
);

/* ===============================
   Main Sidebar
================================ */
const Sidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo">
            <span className="logo-sm">
              <img src="/assets/images/logo-sm.png" alt="" height={40} />
            </span>
            <span className="logo-lg">
              <img src="/assets/images/logo-light.png" alt="" height={40} />
            </span>
          </Link>
        </div>

        <SimpleBar id="scrollbar" className="h-100">
          <Container fluid>
            <ul className="navbar-nav" id="navbar-nav">
              {MENU_LIST.map((mod) =>
                !mod.children?.length ? (
                  <SimpleMenuItem
                    key={mod.id}
                    mod={mod}
                    location={location}
                  />
                ) : (
                  <CollapsibleMenuItem
                    key={mod.id}
                    mod={mod}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    location={location}
                  />
                )
              )}
            </ul>
          </Container>
        </SimpleBar>

        <div className="sidebar-background"></div>
      </div>
      <div className="vertical-overlay"></div>
    </>
  );
};

export default Sidebar;
