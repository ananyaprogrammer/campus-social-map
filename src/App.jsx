import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import FloatingCreateButton from "./components/FloatingCreateButton";
import About from "./pages/About";
import "./App.css";

const isAuthenticated = () => {
  return !!localStorage.getItem("csm_token");
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <div className="app-root">
      <Navbar />

      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                <PostDetails />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
  path="/about"
  element={
    <PrivateRoute>
      <About />
    </PrivateRoute>
  }
/>

        </Routes>
      </div>

      {/* Floating create post button */}
      <FloatingCreateButton />
    </div>
  );
}
