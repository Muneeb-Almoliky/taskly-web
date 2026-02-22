import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { useCookies } from "react-cookie";
import styles from "./Auth.module.css";

const Auth = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [cookie, setCookie] = useCookies();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { auth, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsLogIn(status);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/~`|-]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();

    // Validate on both login and signup
    if (!email || !email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (!password || !password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (!isLogIn) {
      if (!isValidPassword(password)) {
        setError(
          "Password must be at least 8 characters with one number and one uppercase letter"
        );
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `/auth/${endpoint}`,
        {
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.accessToken) {
        setAuth((prev) => ({
          ...prev,
          accessToken: response.data.accessToken,
        }));
        setCookie("email", email, { path: "/", maxAge: 60 * 60 * 24 * 1000 });
      }
    } catch (err) {
      if (!err?.response) {
        setError("No server response");
      } else if (err.response?.status === 400) {
        setError("Missing email or password");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 409) {
        setError("An account with this email already exists");
      } else if (err.response?.status === 404) {
        setError("Account not found");
      } else {
        setError(`${isLogIn ? "Login" : "Signup"} failed. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError("");
  }, [email, password]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authContainerBox}>
        <form>
          <h2>{isLogIn ? "Log in" : "Create account"}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogIn && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input
            type="submit"
            value={isLoading ? "Please wait..." : isLogIn ? "Log in" : "Sign up"}
            disabled={isLoading}
            onClick={(e) => handleSubmit(e, isLogIn ? "login" : "signup")}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
        <div className={styles.authOptions}>
          <button
            onClick={() => viewLogin(false)}
            className={!isLogIn ? styles.active : ""}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            className={isLogIn ? styles.active : ""}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
