import { useState } from "react";
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
      <div className="container py-3">
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
            <a href="#home">Home</a>
            <a href="#about">About</a>
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
