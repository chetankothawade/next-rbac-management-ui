// src/components/Header.jsx
import React, { useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuthHandlers } from "../../../redux/authHelpers";
import { useAuthContext } from "../../../redux/hooks/useAuthContext";

import http from "../../../utils/http";
import { formatString } from "../../../utils/helpers";
import LightDark from "./LightDark";

const Header = ({ onChangeLayoutMode, layoutMode, headerClass }) => {
  const dispatch = useDispatch();
  const { handleLogout } = useAuthHandlers();

  /** 🔐 Auth Context */
  const {
    authUser,
    authType,
    authUuid,
    authUserName,
    authUserRole,
  } = useAuthContext();

  const userAvatar = "/assets/images/users/avatar.jpg";

  const clientUuid = authUser?.client?.uuid || null;

  /**
   * Handle logout (admin / client aware)
   */
  const onLogout = useCallback(async () => {
    try {
      const response = await http.post("logout", { role: authType });
      handleLogout(dispatch, response, authType);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [dispatch, handleLogout, authType]);

  /**
   * Toggle sidebar
   */
  const toggleMenu = useCallback(() => {
    const width = document.documentElement.clientWidth;
    const layout = document.documentElement.getAttribute("data-layout");
    const sidebarSize = document.documentElement.getAttribute("data-sidebar-size");

    // Toggle hamburger icon animation
    if (width > 767) {
      document.querySelector(".hamburger-icon")?.classList.toggle("open");
    }

    // Only apply on vertical / semibox layouts
    if (layout === "vertical" || layout === "semibox") {
      if (width > 767 && width < 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.setAttribute(
          "data-sidebar-size",
          sidebarSize === "sm" ? "" : "sm"
        );
      } else if (width >= 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.setAttribute(
          "data-sidebar-size",
          sidebarSize === "lg" ? "sm" : "lg"
        );
      } else {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }
  }, []);

  return (
    <header id="page-topbar" className={headerClass}>
      <div className="layout-width">
        <div className="navbar-header">

          {/* Sidebar Toggle */}
          <div className="d-flex">
            <button
              onClick={toggleMenu}
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
              id="topnav-hamburger-icon"
            >
              <span className="hamburger-icon">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          <div className="d-flex align-items-center">
            {/* Theme Toggle */}
            <LightDark
              layoutMode={layoutMode}
              onChangeLayoutMode={onChangeLayoutMode}
            />

            {/* User Dropdown */}
            <div className="dropdown ms-sm-3 header-item topbar-user" id="page-header-user-dropdown">
              <Dropdown align="end">
                <Dropdown.Toggle as="div" className="btn">
                  <span className="d-flex align-items-center">
                    <img
                      src={userAvatar}
                      alt="avatar"
                      className="rounded-circle header-profile-user"
                      width="38"
                      height="38"
                    />
                    <span className="text-start ms-xl-2">
                      <span className="d-xl-inline-block ms-1 fw-medium user-name-text">
                        {authUserName}
                      </span>
                      <span className="d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                        {formatString(authUserRole)}
                      </span>
                    </span>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <h6 className="dropdown-header">
                    Welcome {authUserName}!
                  </h6>

                  {/* Profile */}
                  <Dropdown.Item as={Link} to={`/user/profile/${authUuid}`}>
                    <i className="mdi mdi-account-circle text-muted fs-16 me-1" />
                    Profile
                  </Dropdown.Item>

                  {/* Super Admin only */}
                  {authUserRole === "super_admin" && (
                    <Dropdown.Item as={Link} to="/module/permission">
                      <i className="mdi mdi-shield-key text-muted fs-16 me-1" />
                      Module Access Permissions
                    </Dropdown.Item>
                  )}

                   {/* Super Admin only */}
                  {authUserRole === "super_admin" && (
                    <Dropdown.Item as={Link} to="/module/permission/role">
                      <i className="mdi mdi-shield-lock text-muted fs-16 me-1" />
                      Role Module Access
                    </Dropdown.Item>
                  )}

                  <Dropdown.Divider />

                  {/* Logout */}
                  <Dropdown.Item as="button" onClick={onLogout}>
                    <i className="mdi mdi-logout text-muted fs-16 me-1" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
