import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <>
    {user && (
    <div className="sidebar">
      <nav className="navigation d-flex flex-column">
        <Link className="sidebar-brand" to="/">
          <span className="align-middle">WMS</span>
        </Link>
        <ul className="nav flex-column flex-nowrap" id="ulmenu">
          <li className="sidebar-header">
              Pages
					</li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
            <span className="material-symbols-outlined mr-2">
              dashboard
              </span>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile">
            <span className="material-symbols-outlined mr-2">
              account_circle
              </span>
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/worklog">
            <span className="material-symbols-outlined mr-2">
              edit_note
              </span>
              Worklog
            </Link>
          </li>
          {user.role === "Super-Admin" && 
            <>
              <li className="sidebar-header">
                Super Admin Tools
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                <span className="material-symbols-outlined mr-2">
                  person_add
                  </span>
                  Create Account
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reports">
                  <span className="material-symbols-outlined mr-2">
                    summarize
                  </span>
                  Reports
                </Link>
              </li>
            </>
          }         
        </ul>
        <button className="nav-link mb-4 bg-transparent logoutBtn" onClick={handleClick}>
            <span className="material-symbols-outlined mr-2">
              logout
              </span>
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
