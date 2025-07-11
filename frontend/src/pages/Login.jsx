// import { useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       alert("Login failed. Check credentials.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white">
//       <h2 className="text-xl font-bold mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input name="email" type="email" onChange={handleChange} placeholder="Email" className="border px-3 py-2 rounded" />
//         <input name="password" type="password" onChange={handleChange} placeholder="Password" className="border px-3 py-2 rounded" />
//         <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Login</button>
//       </form>
//     </div>
//   );
// }

// import { useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.post("/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Check credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Welcome Back</h2>
        
//         {error && (
//           <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email Address"
//             className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//             required
//           />
//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full text-white py-2 rounded-lg transition ${
//               loading
//                 ? "bg-green-300 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-gray-600">
//           Don’t have an account?{" "}
//           <a
//             href="/register"
//             className="text-green-600 hover:underline font-medium"
//           >
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Sign In
        </h2>

        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white tracking-wide transition-colors ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
