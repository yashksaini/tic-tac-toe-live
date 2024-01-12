/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeAuthentication } from "./redux/userAuthentication";

import AddUser from "./admin/AddUser";
import ChangePassword from "./admin/ChangePassword";
import Dashboard from "./admin/Dashboard";
import Profile from "./admin/Profile";
import Teachers from "./admin/Teachers";
import AdminNav from "./components/AdminNav";

export const BASE_URL = "http://localhost:3000";
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
  }, []);

  return (
    <>
      <BrowserRouter>
        {isAuth && <AdminNav />}
        <Routes>
          {/* For Unauthenticated Users */}
          {!isAuth && <Route element={<Login />} path="/" />}

          {/* If user is admin */}
          {isAuth && (
            <>
              <Route element={<Dashboard />} path="/dashboard" />
              <Route element={<AddUser />} path="/addTeacher" />
              <Route element={<ChangePassword />} path="/changePassword" />
              <Route element={<Teachers />} path="/teachers" />
              <Route element={<Profile />} path="/profile" />
            </>
          )}

          {/* Redirect unauthenticated users to Login for undefined routes */}
          {!isAuth && <Route element={<Navigate to="/" />} />}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
