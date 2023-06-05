import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

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
    <div className="bg-animation">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>

      <div className="login-box">
      <h1 className="text-center">Sign In</h1>
        <form className="login" onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <div className="submit" /*req ? "submit" : "required"*/>
            <button className="loginBtn" hidden={!(email && password)} disabled={isLoading}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
