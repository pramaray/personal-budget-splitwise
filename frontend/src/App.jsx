import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from './components/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App() {
  return (
    
      <><Navbar />
      <Routes>

      <Route path="/" element={<div><h1 className="text-3xl text-center mt-10">Home Page</h1> <div className="bg-red-500 text-white p-4">Tailwind is Working!</div></div>} />
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
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} /></>
  );
}


