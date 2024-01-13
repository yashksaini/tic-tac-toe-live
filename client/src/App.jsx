/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeAuthentication } from "./redux/userAuthentication";

import Dashboard from "./admin/Dashboard";
import Profile from "./admin/Profile";
import AdminNav from "./components/AdminNav";
import Signup from "./pages/Signup";
// import { io as socketIO } from "socket.io-client";

export const BASE_URL = "http://localhost:3000";
// const socket = socketIO(BASE_URL);
function App() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.userAuth);

  axios.defaults.withCredentials = true;
  const getAuth = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth`);
      dispatch(changeAuthentication(response.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAuth();
  }, [isAuth]);

  return (
    <>
      <BrowserRouter>
        {isAuth && <AdminNav />}
        <Routes>
          {/* For Unauthenticated Users */}
          {!isAuth && (
            <>
              <Route element={<Login />} path="/" />
              <Route element={<Signup />} path="/signup" />
            </>
          )}

          {/* If user is admin */}
          {isAuth && (
            <>
              <Route element={<Dashboard />} path="/dashboard" />
              <Route element={<Profile />} path="/profile/:userId" />
            </>
          )}

          {/* Redirect unauthenticated users to Login for undefined routes */}
          {!isAuth && <Route element={<Navigate to="/" />} />}
          {isAuth && <Route element={<Navigate to="/dashboard" />} />}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
