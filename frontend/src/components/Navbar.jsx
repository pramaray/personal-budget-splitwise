import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // Hide navbar if not logged in

  return (
    <nav className="bg-gray-800 text-gray-100 sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Name */}
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          💸 Expense Tracker
        </h1>

        {/* Links */}
        <div className="items-center">
          <Link to="/dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>
          <Link to="/profile" className="hover:text-blue-400">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   if (!user) return null; // Hide navbar if not logged in

//   return (
//     <nav className="bg-black text-gray-100 sticky top-0 z-50 shadow-lg">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//         {/* App Name */}
//         <h1
//           className="text-2xl font-extrabold tracking-tight cursor-pointer hover:text-gray-300 transition"
//           onClick={() => navigate("/dashboard")}
//         >
//           💸 Expense Tracker
//         </h1>

//         {/* Links */}
//         <div className="flex space-x-6 items-center text-lg">
//           <Link
//             to="/dashboard"
//             className="hover:text-gray-300 transition duration-150"
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/profile"
//             className="hover:text-gray-300 transition duration-150"
//           >
//             Profile
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="ml-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-md transition"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
