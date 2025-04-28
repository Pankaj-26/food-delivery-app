import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    let newUrl = url;

 if (currentState === "Login") {
  newUrl += "/api/user/login";
} else {
  newUrl += "/api/user/register";
}
console.log(newUrl)

try {
  const response = await axios.post(newUrl, data, {
    headers: {
      "Content-Type": "application/json", // Ensure the server expects JSON
    },
  });
  if (response.data.success) {
    setToken(response.data.token);
    localStorage.setItem("token", response.data.token);
    setShowLogin(false);
  } else {
    alert(response.data.message);
  }
} catch (error) {
  console.error("Error response:", error.response ? error.response.data : error.message);

  alert("Something went wrong! Please try again.");
}

  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="your name"
              required
            />
          )}

          <input
            type="text"
            placeholder="email"
            onChange={onChangeHandler}
            name="email"
            value={data.email}
            required
          />
          <input
            type="text"
            name="password"
            placeholder="password"
            value={data.password}
            onChange={onChangeHandler}
            required
          />
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms and conditions</p>
        </div>
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>{" "}
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>{" "}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
