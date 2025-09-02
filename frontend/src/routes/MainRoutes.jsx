import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./ProtectedRoutes";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Home = lazy(() => import("../pages/Home"));

const MainRoutes = () => {
  const user = useSelector((state) => state.user?.user);
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" replace /> : <Register />
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default MainRoutes;
