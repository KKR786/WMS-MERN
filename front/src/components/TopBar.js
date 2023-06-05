import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function TopBar(props) {
  const [state, setState] = useState(true)
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  function hamburgerOnClick() {
    setState(!state)
  }
  props.class(state);

  const handleClick = () => {
    logout();
  };
  return (
    <nav className="navbar navbar-expand bg-white topBar">
      <div className="w-100 py-3">
        <div className="d-flex justify-content-between align-items-center w-100">
          <span className="material-symbols-outlined hamburger" onClick={hamburgerOnClick}>
            menu
          </span>
        {user &&
        <div className="dropdown">
          <div className="d-flex align-items-center drop" onClick={toggleDropdown}>
            <span>{user.name}</span>
            <span className="material-symbols-outlined">
              arrow_drop_down
            </span>
          </div>
          <div className={`dropdown-content ${isOpen ? "show" : ""}`}>
            <Link className="nav-link" to="/worklogs">
              <span className="material-symbols-outlined mr-2">
                work_history
              </span>
              My Worklog
            </Link>
            <Link className="nav-link" to="/profile">
              <span className="material-symbols-outlined mr-2">
                account_circle
              </span>
              My Profile
            </Link>
            <button
              className="dropbtn d-flex align-items-center"
              onClick={handleClick}
            >
              <span className="material-symbols-outlined mr-2">logout</span>
              Logout
            </button>
          </div>
        </div>
        }
        </div>
      </div>
    </nav>
  );
}

export default TopBar;
