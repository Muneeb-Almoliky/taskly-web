import React, { useEffect } from "react";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import TaskList from "./pages/TaskList/TaskList";
import ErrorPage from './pages/ErrorPage/ErrorPage'
import Sidebar from "./components/Sidebar/Sidebar";
import useAuth from "./hooks/useAuth";
import useRefreshToken from "./hooks/useRefreshToken";
import ListHeader from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useTasks from "./hooks/useTasks";

const App = () => {
  const { auth, setAuth } = useAuth();
  const refresh = useRefreshToken();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const { getTasks } = useTasks();

  const verifyToken = async () => {
    try {
      await refresh();
    } catch (error) {
      console.log("Token refresh failed", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (!auth?.accessToken) {
      verifyToken();
    } else {
      setIsAuthenticating(false);
    }
  }, [auth, refresh]);

  useEffect(() => {
    if (auth?.accessToken) {
      getTasks();
    }
  }, [auth]);

  if (isAuthenticating) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <BeatLoader color="#6366F1" size={10} />
      </div>
    );
  }

  return (
    <div className="app">
      <ToastContainer />
      {auth?.accessToken && <Sidebar isAuthenticating={isAuthenticating} />}
      {auth?.accessToken && <ListHeader />}

      <div
        className="content"
        style={{ marginInline: auth?.accessToken ? "" : "0px" }}
      >
        <Routes>
          <Route
            path="/"
            element={
              auth?.accessToken ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              auth?.accessToken ? <Navigate to="/dashboard" /> : <Auth />
            }
          />
          <Route
            path="/signup"
            element={
              auth?.accessToken ? <Navigate to="/dashboard" /> : <Auth />
            }
          />
          <Route
            path="/dashboard"
            element={
              auth?.accessToken ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          {/* <Route path="/profile" element={auth?.accessToken ? <Profile /> : <Navigate to="/login" />} /> */}
          <Route
            path="/tasks/:status"
            element={
              auth?.accessToken ? <TaskList /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={ <ErrorPage /> }/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
