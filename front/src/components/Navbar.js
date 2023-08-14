import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import logo from "../assets/wms-white.svg";

const Navbar = (props) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <>
      {user && (
        <div
          className="sidebar"
          style={props.class ? { left: "0px" } : { left: "-300px" }}
        >
          <nav className="navigation flex-column">
            <Link className="sidebar-brand mb-5" to="/">
              <img className="logo" src={logo} alt="herse logo" />
            </Link>
            <div className="scrollbar" id="scroll-style">
              <div className="force-overflow">
                <ul className="nav flex-column flex-nowrap" id="ulmenu">
                  {/* <li className="sidebar-header">Pages</li> */}
                  <li className={ activeLink === "/" ? "nav-item active" : "nav-item" }>
                    <Link className="nav-link" to="/" onClick={() => handleClick("/")}>
                      <span className="material-symbols-outlined mr-2">dashboard</span>
                      Dashboard
                    </Link>
                  </li>

                  <li className={ activeLink === "/worklogs" ? "nav-item active" : "nav-item" }>
                    <Link className="nav-link" to="/worklogs" onClick={() => handleClick("/worklogs")}>
                      <span className="material-symbols-outlined mr-2">work_history</span>
                      My Worklog
                    </Link>
                  </li>

                  <li className={ activeLink === "/leave-plan" ? "nav-item active" : "nav-item" }>
                    <Link className="nav-link" to="/leave-plan" onClick={() => handleClick("/leave-plan")}>
                      <span className="material-symbols-outlined mr-2">calendar_month</span>
                      Leave Plan
                    </Link>
                  </li>

                  {user.role === "Super-Admin" && (
                    <>
                      <li className="sidebar-header">Super Admin Tools</li>
                      <li className={ activeLink === "/reports" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/reports" onClick={() => handleClick("/reports")}>
                          <span className="material-symbols-outlined mr-2">summarize</span>
                          Reports
                        </Link>
                      </li>
                      <li className={ activeLink === "/system-settings" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/system-settings" onClick={() => handleClick("/system-settings")}>
                          <span className="material-symbols-outlined mr-2">settings_suggest</span>
                          System Settings
                        </Link>
                      </li>
                      <li className={ activeLink === "/users" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/users" onClick={() => handleClick("/users")}>
                          <span className="material-symbols-outlined mr-2">manage_accounts</span>
                          User Management
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <button
              className="nav-link mb-4 logoutBtn"
              onClick={logout}
            >
              <span className="material-symbols-outlined mr-2">logout</span>
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
