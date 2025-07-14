import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const api = useApi();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const res = await api.get(`/groups/user/${user._id}`);
        setGroups(res || []);
      } catch (err) {
        console.error("Failed to fetch user groups:", err);
      }
    };
    fetchUserGroups();
  }, [api, user._id]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link
          to="/dashboard"
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Back to Dashboard
        </Link>
      </header>

      {/* 👤 User Info */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Details</h2>
        <p><span className="font-bold">Name:</span> {user.name}</p>
        <p><span className="font-bold">Email:</span> {user.email}</p>
        {/* <p><span className="font-bold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p> */}
      </div>

      {/* 👥 User's Groups */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
        {groups.length ? (
          <ul className="space-y-3">
            {groups.map((g) => (
              <li
                key={g._id}
                className="p-4 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
              >
                <Link to={`/groups/${g._id}`} className="block">
                  <h3 className="text-lg font-bold">{g.name}</h3>
                  <p className="text-sm text-gray-400">
                    Members: {g.members.map((m) => m.name).join(", ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You are not part of any groups yet.</p>
        )}
      </div>
    </div>
  );
}
