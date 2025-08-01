import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Users } from "lucide-react";

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
    <div className="min-h-screen bg-black text-white p-6 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white opacity-2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white opacity-1 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
        <div className="mb-4 md:mb-0">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-gray-400">Manage your account details</p>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-xl border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 font-medium flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </header>

      <div className="relative z-10 space-y-8">
        {/* User Info */}
        <section className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Your Details</h2>
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Name</p>
                <p className="text-white font-semibold text-lg">{user.name}</p>
              </div>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white font-semibold text-lg">{user.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* User's Groups */}
        <section className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Your Groups</h2>
          {groups.length > 0 ? (
            <ul className="space-y-4">
              {groups.map((g) => (
                <li key={g._id}>
                  <Link
                    to={`/groups/${g._id}`}
                    className="bg-black/30 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 flex items-center gap-4 hover:border-gray-600 hover:bg-black/50 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {g.members.length}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">{g.name}</h3>
                      <p className="text-sm text-gray-400">
                        Members: {g.members.map((m) => m.name).join(", ")}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-gray-400 group-hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No groups found</p>
              <p className="text-gray-500 text-sm">You are not part of any groups yet</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}