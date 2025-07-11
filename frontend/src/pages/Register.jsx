// import { useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/auth/register", form);
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       alert("Registration failed. Try again.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white">
//       <h2 className="text-xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input name="name" type="text" onChange={handleChange} placeholder="Name" className="border px-3 py-2 rounded" />
//         <input name="email" type="email" onChange={handleChange} placeholder="Email" className="border px-3 py-2 rounded" />
//         <input name="password" type="password" onChange={handleChange} placeholder="Password" className="border px-3 py-2 rounded" />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
//       </form>
//     </div>
//   );
// }

// import { useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
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
//       const res = await api.post("/auth/register", form);
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>
        
//         {error && (
//           <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="name"
//             type="text"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             required
//           />
//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email Address"
//             className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             required
//           />
//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full text-white py-2 rounded-lg transition ${
//               loading
//                 ? "bg-blue-300 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-gray-600">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
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
//       const res = await api.post("/auth/register", form);
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
//       <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
//         <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
//           Create Account
//         </h2>

//         {error && (
//           <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             name="name"
//             type="text"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email Address"
//             className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg font-semibold text-white tracking-wide transition-colors ${
//               loading
//                 ? "bg-indigo-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700"
//             }`}
//           >
//             {loading ? "Creating account..." : "Register"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-400">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="text-indigo-400 hover:text-indigo-300 transition-colors"
//           >
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="w-full max-w-lg p-10 rounded-2xl bg-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-300">Full Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-300">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-300">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white tracking-wide transition-colors ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

