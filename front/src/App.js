import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import React from "react"

// pages & components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/NewAccount";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Worklog from "./pages/Worklog";
import LeavePlan from "./pages/LeavePlan";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import UsersProfile from "./pages/usersProfile";
import ManageUsers from "./pages/ManageUsers";
import SystemSettings from "./pages/SystemSettings";
import MyWorklog from "./pages/MyWorklog";


function App() {
  const { user } = useAuthContext();
  const [navClass, setNavClass] = React.useState(true)
  console.log(user);

  return (
    <div className="App">
      <BrowserRouter>
          <Navbar class={navClass}/>
          <div className="content" style={(navClass ? {marginLeft: '300px'} : {marginLeft: '0px'})}>
            {user &&
            <TopBar class={setNavClass}/>
            }
            <Routes>
            <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={user ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/user/profile/:userId"
                element={user ? <UsersProfile /> : <Navigate to="/login" />}
              />
              <Route
                path="/worklog"
                element={user ? <Worklog /> : <Navigate to="/login" />}
              />
              <Route
                path="/worklogs"
                element={user ? <MyWorklog /> : <Navigate to="/login" />}
              />
              <Route
                path="/leave-plan"
                element={user ? <LeavePlan /> : <Navigate to="/login" />}
              />
              <Route
                path="/reports"
                element={user ? (user.role === 'Super-Admin' ? <Reports /> : <Navigate to="/login" />) : <Navigate to="/login" />}
              />
              <Route
                path="/system-settings"
                element={user ? (user.role === 'Super-Admin' ? <SystemSettings /> : <Navigate to="/login" />) : <Navigate to="/login" />}
              />
              <Route
                path="/users"
                element={user ? (user.role === 'Super-Admin' ? <ManageUsers /> : <Navigate to="/login" />) : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={ user ? (user.role === 'Super-Admin' ? <Signup /> : <Navigate to="/login" />) : <Navigate to="/login" />}
              />
            </Routes>
          </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
