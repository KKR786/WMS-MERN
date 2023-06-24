import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = (props) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [secondNav, setSecondNav] = useState("hide");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (link) => {
    setActiveLink(link);
    link.includes("/worklog") ? setSecondNav("show") : setSecondNav("hide")
  };

  const isLinkActive = (link) => {
    if (link === "/") {
      return activeLink === link;
    } else if (link === "/worklog") {
      return activeLink.startsWith(link) && !activeLink.startsWith("/worklogs");
    } else {
      return activeLink.startsWith(link);
    }
  };

  return (
    <>
      {user && (
        <div
          className="sidebar"
          style={props.class ? { left: "0px" } : { left: "-250px" }}
        >
          <nav className="navigation flex-column">
            <Link className="sidebar-brand mb-5" to="/">
              <span className="align-middle">Herse WMS</span>
            </Link>
            <div className="scrollbar" id="scroll-style">
              <div className="force-overflow">
                <ul className="nav flex-column flex-nowrap" id="ulmenu">
                  {/* <li className="sidebar-header">Pages</li> */}
                  <li className={isLinkActive("/") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/" onClick={() => handleClick("/")}>
                      <span className="material-symbols-outlined mr-2">dashboard</span>
                      Dashboard
                    </Link>
                  </li>

                  <li className={isLinkActive("/worklogs") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/worklogs" onClick={() => handleClick("/worklogs")}>
                      <span className="material-symbols-outlined mr-2">work_history</span>
                      My Worklog
                    </Link>
                  </li>

                  <li className={isLinkActive("/leave-plan") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/leave-plan" onClick={() => handleClick("/leave-plan")}>
                      <span className="material-symbols-outlined mr-2">calendar_month</span>
                      Leave Plan
                    </Link>
                  </li>

                  {user.role === "Super-Admin" && (
                    <>
                      <li className="sidebar-header">Super Admin Tools</li>
                      <li className={isLinkActive("/reports") ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/reports" onClick={() => handleClick("/reports")}>
                          <span className="material-symbols-outlined mr-2">summarize</span>
                          Reports
                        </Link>
                      </li>
                      {/* <li className={isLinkActive("/role-management") ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/role-management" onClick={() => handleClick("/role-management")}>
                          <span className="material-symbols-outlined mr-2">settings_accessibility</span>
                          Role Management
                        </Link>
                      </li> */}
                      <li className={isLinkActive("/system-settings") ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/system-settings" onClick={() => handleClick("/system-settings")}>
                          <span className="material-symbols-outlined mr-2">settings_suggest</span>
                          System Settings
                        </Link>
                      </li>
                      <li className={isLinkActive("/users") ? "nav-item active" : "nav-item"}>
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
              className="nav-link mb-4 bg-transparent logoutBtn"
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
