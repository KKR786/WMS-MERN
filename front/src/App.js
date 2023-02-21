import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/NewAccount'
import Navbar from './components/Navbar'
import VeiwWorklog from './pages/VeiwWorklog'
import Employee from './components/employee/Employee'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
          <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route 
              path="/veiw" 
              element={<VeiwWorklog />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
