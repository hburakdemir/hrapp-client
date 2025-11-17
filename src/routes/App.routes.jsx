import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Contact from "../pages/contact/Contact";
import Unauthorized from "../pages/Unauthorized";
import Dashboard from "../pages/Home/Dashboard";
import Applicants from "../pages/Dashboard/Applicants";
import UsersPage from "../pages/Dashboard/Users";
import NewWorkflow from "../pages/Dashboard/NewWorkflow";
import Profile from "../pages/profile/Profile";

import ProtectedRoute from "./Protected.route";

const AppRoutes = () => {
  return (
    
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicants"
        element={
          <ProtectedRoute>
            <Applicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/yeni-sablon"
        element={
          <ProtectedRoute>
            <NewWorkflow />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
