import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Protected.route";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Contact from "../pages/contact/Contact";
import Unauthorized from "../pages/Unauthorized";
import Profile from "../pages/profile/Profile";

//sidebar-applicationmngmnt
import Stats from "../pages/SideBar/Application-Management/Stats";
import Applicants from "../pages/SideBar/Application-Management/Applicants";
import NewWorkflow from "../pages/SideBar/Application-Management/NewWorkflow";

//sidebar-hrmngmnt
import MyForms from "../pages/SideBar/Hiring-Management/MyForms";
import AllForms from "../pages/SideBar/Hiring-Management/AllForms";
import Tasks from "../pages/SideBar/Hiring-Management/Tasks";
import WfDetail from "../pages/SideBar/Hiring-Management/WfDetail";

//sidebar-systmmngmnt
import Users from "../pages/SideBar/System-Management/Users";
import Permissions from "../pages/SideBar/System-Management/Permissions";

//candidate pages
import MyApplications from "../pages/SideBar/Candidate/MyApplications";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      {/* Application Management */}
      <Route
        path="/stats"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-form"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
            <NewWorkflow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicants"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
            <Applicants />
          </ProtectedRoute>
        }
      />

      {/* Hiring Management */}
      <Route
        path="/my-forms"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
            <MyForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-forms"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AllForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sablon-detay/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <WfDetail />
          </ProtectedRoute>
        }
      />

      {/* System Management */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/permissions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Permissions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;