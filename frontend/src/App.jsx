import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import GroupPage from "./pages/GroupPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from './components/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App() {
  return (
    
      <><Navbar />
      <Routes>

      <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
       <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute> } />
        <Route path="/groups/:id" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} /></>
  );
}


