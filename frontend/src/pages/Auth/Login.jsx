import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";

export default function Login() {
  const api = useApi();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", form, "Login successful!");
    if (res?.token) {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

