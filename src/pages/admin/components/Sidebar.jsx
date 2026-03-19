// src/components/Sidebar.js
import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import * as FeatherIcons from 'react-feather';
import { Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SidebarSkeleton from "../../../components/Skeleton/SidebarSkeleton";
import iconNames from "../../../utils/reactFeatherIcons.json";


const closeSidebarOnMobile = () => {
  const width = window.innerWidth;
  if (width < 1025) {
    document.body.classList.remove("vertical-sidebar-enable");
    document.documentElement.setAttribute("data-sidebar-size", "lg");
  }
};

const iconNameSet = new Set(iconNames);

// Icon Renderer using Factory Pattern
const renderIcon = (iconName) => {
  const safeName = iconNameSet.has(iconName) ? iconName : "Grid";
  const IconComponent = FeatherIcons[safeName] || FeatherIcons.Grid;
  return <IconComponent size={20} className="icon-dual" />;
};

// Simple Menu Item Component (SRP: Handles simple menu rendering)
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

// Collapsible Menu Item Component (SRP: Handles collapsible menu rendering)
const CollapsibleMenuItem = ({ mod, openMenu, setOpenMenu, location }) => (
  <li className="nav-item">
    <Link
      to="#"
      className={`nav-link menu-link d-flex align-items-center ${openMenu === mod.id ? "" : "collapsed"}`}
      data-bs-toggle="collapse"
      onClick={(e) => {
        e.preventDefault();
        setOpenMenu(openMenu === mod.id ? null : mod.id);
      }}
      role="button"
      aria-controls={`submenu-${mod.id}`}
      aria-expanded={openMenu === mod.id ? "true" : "false"}
    >
      {renderIcon(mod.icon)}
      <span className="ms-2">{mod.name}</span>
    </Link>

    <div
      id={`submenu-${mod.id}`}
      className={`menu-dropdown collapse ${openMenu === mod.id ? "show" : ""}`}
    >
      <Nav className="nav-sm flex-column">
        {mod.children.map((child) => (
          <Nav.Item key={child.id}>
            <Nav.Link
              as={Link}
              onClick={closeSidebarOnMobile}
              to={child.url}
              className={location.pathname === child.url ? "active" : ""}
            >
              {child.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  </li>
);

// Main Sidebar Component (SRP: Orchestrates the sidebar layout and state)
const Sidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const { list, loading } = useSelector((state) => state.modules);

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
            {loading ? (
              <SidebarSkeleton count={list?.length || 7} />
            ) : (
              <ul className="navbar-nav" id="navbar-nav">
                {list.map((mod) => {
                  // Strategy Pattern: Choose rendering strategy based on menu type
                  if (!mod.children || mod.children.length === 0) {
                    return <SimpleMenuItem key={mod.id} mod={mod} location={location} />;
                  } else {
                    return (
                      <CollapsibleMenuItem
                        key={mod.id}
                        mod={mod}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        location={location}
                      />
                    );
                  }
                })}
              </ul>
            )}
          </Container>
        </SimpleBar>

        <div className="sidebar-background"></div>
      </div>
      <div className="vertical-overlay"></div>
    </>
  );
};

export default Sidebar;
