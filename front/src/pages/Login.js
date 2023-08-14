import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import logo from "../assets/wms.svg";
import thumb from "../assets/dashboard-thumb.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [req, setReq] = useState(false)
  const { login, error, isLoading } = useLogin();
  console.log("email: ", email);

  /*useEffect(()=>{
		if(email && password) {
      setReq(!false);
    }
	}, [email, password])
  }*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <>
    <div className="login-block text-center">
      <div className="login-block-start d-flex align-items-center justify-content-center">
        <div>
          <div className="mb-5 login-logo">
            <img src={logo} alt="herse logo" />
          </div>
          <div className="mb-3 thumb">
            <img src={thumb} alt="herse thumb" />
          </div>
          <div className="caption">Welcome to WMS</div>
          <p>Efficient worklog management system <br/>for seamless task tracking and collaboration.</p>
        </div>
      </div>
      <div className="login-block-end d-flex align-items-center justify-content-center">
        <div className="login-box">
          <h1 className="text-center mb-3">Log in</h1>
          <form onSubmit={handleSubmit}>
            <div className="login-group">
              <label>Email:</label>
              <input
                type="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-group">
              <label>Password:</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="submit " /*req ? "submit" : "required"*/>
              <button className="btn btn-primary w-100" disabled={isLoading}>
                Log in
              </button>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
      <div className="copyright text-center">All copyrights reserved</div>
      </>
  );
};

export default Login;
