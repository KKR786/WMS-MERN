import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/NewAccount";
import Navbar from "./components/Navbar";
import ViewWorklog from "./pages/ViewWorklog";
import TopBar from "./components/TopBar";
import Worklog from "./pages/Worklog";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";


function App() {
  const { user } = useAuthContext();
  console.log(user);

  return (
    <div className="App">
      <BrowserRouter>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 d-lg-block d-none">
            <Navbar />
          </div>
          <div className="col-lg-9 col-md-12">
          <TopBar />
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
              path="/worklog"
              element={user ? <Worklog /> : <Navigate to="/login" />}
            />
            <Route
              path="/reports"
              element={user ? (user.role === 'Super-Admin' ? <Reports /> : <Navigate to="/login" />) : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={ user ? <Signup /> : <Navigate to="/login" />}
            />
          </Routes>
          </div>
        </div>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
