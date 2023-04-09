import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = (props) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();
  const currentSlug = location.pathname;
  const [activeLink, setActiveLink] = useState(currentSlug);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleClick = () => {
    logout();
  };

  return (
    <>
      {user && (
        <div
          className="sidebar"
          style={props.class ? { left: "0px" } : { left: "-250px" }}
        >
          <nav className="navigation flex-column">
            <Link className="sidebar-brand" to="/">
              <span className="align-middle">WMS</span>
            </Link>
            <div className="scrollbar" id="scroll-style">
              <div className="force-overflow">
                <ul className="nav flex-column flex-nowrap" id="ulmenu">
                  <li className="sidebar-header">Pages</li>
                  <li
                    onClick={() => handleLinkClick("/")}
                    className={
                      activeLink === "/" ? "nav-item active" : "nav-item"
                    }
                  >
                    <Link className="nav-link" to="/">
                      <span className="material-symbols-outlined mr-2">
                        dashboard
                      </span>
                      Dashboard
                    </Link>
                  </li>
                  <li
                    onClick={() => handleLinkClick("/profile")}
                    className={
                      activeLink === "/profile" ? "nav-item active" : "nav-item"
                    }
                  >
                    <Link className="nav-link" to="/profile">
                      <span className="material-symbols-outlined mr-2">
                        account_circle
                      </span>
                      Profile
                    </Link>
                  </li>
                  <li
                    onClick={() => handleLinkClick("/worklog")}
                    className={
                      activeLink === "/worklog" ? "nav-item active" : "nav-item"
                    }
                  >
                    <Link className="nav-link" to="/worklog">
                      <span className="material-symbols-outlined mr-2">
                        edit_note
                      </span>
                      Worklog
                    </Link>
                  </li>
                  {user.role === "Super-Admin" && (
                    <>
                      <li className="sidebar-header">Super Admin Tools</li>
                      <li
                        onClick={() => handleLinkClick("/reports")}
                        className={
                          activeLink === "/reports"
                            ? "nav-item active"
                            : "nav-item"
                        }
                      >
                        <Link className="nav-link" to="/reports">
                          <span className="material-symbols-outlined mr-2">
                            summarize
                          </span>
                          Reports
                        </Link>
                      </li>
                      <li
                        onClick={() => handleLinkClick("/role-management")}
                        className={
                          activeLink === "/role-management" ? "nav-item active" : "nav-item"
                        }
                      >
                        <Link className="nav-link" to="/role-management">
                          <span className="material-symbols-outlined mr-2">
                            settings_accessibility
                          </span>
                          Role Management
                        </Link>
                      </li>
                      <li
                        onClick={() => handleLinkClick("/system-settings")}
                        className={
                          activeLink === "/system-settings"
                            ? "nav-item active"
                            : "nav-item"
                        }
                      >
                        <Link className="nav-link" to="/system-settings">
                          <span className="material-symbols-outlined mr-2">
                            settings_suggest
                          </span>
                          System Settings
                        </Link>
                      </li>
                      <li
                        onClick={() => handleLinkClick("/users")}
                        className={
                          activeLink === "/users" ? "nav-item active" : "nav-item"
                        }
                      >
                        <Link className="nav-link" to="/users">
                          <span className="material-symbols-outlined mr-2">
                            manage_accounts
                          </span>
                          User Management
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <button
              className="nav-link mb-4 bg-transparent logoutBtn"
              onClick={handleClick}
            >
              <span className="material-symbols-outlined mr-2">logout</span>
              Logout
            </button>
          </nav>
        </div>
      )}
    </>

    // <header>
    //   <div classNameName="container">
    //     <Link to="/">
    //       <h1>Worklog</h1>
    //     </Link>
    //     <nav>
    //       {user && (
    //         <div>
    //           <span>{user.name}</span>
    //           <button onClick={handleClick}>Log out</button>
    //         </div>
    //       )}
    //       {!user && (
    //         <div>
    //           <Link to="/login">Login</Link>
    //           <Link to="/signup">Signup</Link>
    //         </div>
    //      )}
    //     </nav>
    //   </div>
    // </header>
  );
};

export default Navbar;
