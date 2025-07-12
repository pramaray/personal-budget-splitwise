import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";

export default function Register() {
  const api = useApi();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/register", form, "Registration successful!");
    if (res?.token) {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
            required
          />
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
            className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
