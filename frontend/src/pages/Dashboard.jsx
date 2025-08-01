import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import Modal from "../components/Modal";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const api = useApi();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [budgets, setBudgets] = useState([]);
  const [groups, setGroups] = useState([]);
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form, setForm] = useState({ name: "", amount: "", category: "" });
  const [groupForm, setGroupForm] = useState({ name: "", members: "" });

  const fetchData = async () => {
    const [budgetsRes, groupsRes] = await Promise.all([
      api.get("/budgets"),
      api.get(`/groups/user/${user._id}`),
    ]);
    setBudgets(budgetsRes || []);
    setGroups(groupsRes || []);

    // Fetch balances for all groups
    let totalOwe = 0;
    let totalOwed = 0;
    for (const group of groupsRes || []) {
      const balances = await api.get(`/balances/group/${group._id}`);
      console.log(balances);
      balances.forEach((b) => {
        if (b.user._id !== user._id) return; // skip yourself
        if (b.balance < 0) totalOwe += Math.abs(b.balance);
        if (b.balance > 0) totalOwed += b.balance;
      });
    }
    setYouOwe(totalOwe);
    setYouAreOwed(totalOwed);
  };
  const totalBalance= (youAreOwed-youOwe);
  useEffect(() => {
    fetchData();
  }, []);

  const handleBudgetChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGroupChange = (e) =>
    setGroupForm({ ...groupForm, [e.target.name]: e.target.value });

  const saveBudget = async (e) => {
    e.preventDefault();
    editingBudget
      ? await api.put(`/budgets/${editingBudget._id}`, form, "Budget updated!")
      : await api.post("/budgets", form, "Budget created!");
    closeBudgetModal();
    fetchData();
  };

  const deleteBudget = async (id) => {
    await api.del(`/budgets/${id}`, "Budget deleted!");
    fetchData();
  };

  const saveGroup = async (e) => {
    e.preventDefault();
    const emails = groupForm.members.split(",").map((m) => m.trim());
    const resolvedMembers = [];
    for (const email of emails) {
      const userRes = await api.get(`/auth/user-by-email?email=${email}`);
      if (userRes?._id) resolvedMembers.push(userRes._id);
    }

    editingGroup
      ? await api.put(
          `/groups/${editingGroup._id}`,
          { name: groupForm.name, members: resolvedMembers },
          "Group updated!"
        )
      : await api.post(
          "/groups",
          { name: groupForm.name, members: resolvedMembers },
          "Group created!"
        );

    closeGroupModal();
    fetchData();
  };

  const deleteGroup = async (id) => {
    await api.del(`/groups/${id}`, "Group deleted!");
    fetchData();
  };

  const closeBudgetModal = () => {
    setShowBudgetModal(false);
    setEditingBudget(null);
    setForm({ name: "", amount: "", category: "" });
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
    setEditingGroup(null);
    setGroupForm({ name: "", members: "" });
  };
  // 🔥 Pie chart data (category-wise totals)
  const categoryTotals = budgets.reduce((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + parseFloat(b.amount);
    return acc;
  }, {});

  const totalAmount = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  );
  // 📊 Pie Chart Data
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#60A5FA", // blue
          "#F472B6", // pink
          "#34D399", // green
          "#FBBF24", // yellow
          "#F87171", // red
          "#A78BFA", // purple
        ],
        hoverOffset: 10,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const amount = context.raw;
            const percent = ((amount / totalAmount) * 100).toFixed(1);
            return `${context.label}: ₹${amount} (${percent}%)`;
          },
        },
      },
      legend: {
        position: "right",
        labels: {
          color: "#ffffff",
        },
      },
    },
  };

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
            Dashboard
          </h1>
          <p className="text-gray-400">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/profile"
            className="px-6 py-3 rounded-xl border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 font-medium"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats and Chart Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Chart */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 flex justify-center items-center">
          <div className="w-full max-w-xs">
            <h3 className="text-xl font-semibold mb-6 text-center">Budget Distribution</h3>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-6">
          <Card 
            title="You Owe" 
            value={`₹${youOwe.toFixed(2)}`} 
            color="text-red-400"
            icon="↗"
            bgGradient="from-red-900/20 to-red-800/20"
            borderColor="border-red-700/50"
          />
          <Card 
            title="You Are Owed" 
            value={`₹${youAreOwed.toFixed(2)}`} 
            color="text-green-400"
            icon="↙"
            bgGradient="from-green-900/20 to-green-800/20"
            borderColor="border-green-700/50"
          />
          <Card 
            title="Outstanding Balance" 
            value={`₹${totalBalance.toFixed(2)}`} 
            color="text-blue-400"
            icon="⚖"
            bgGradient="from-blue-900/20 to-blue-800/20"
            borderColor="border-blue-700/50"
          />
        </div>
      </div>

      {/* Budgets and Groups Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section
          title="Budgets"
          items={budgets}
          onAdd={() => setShowBudgetModal(true)}
          onEdit={(b) => {
            setEditingBudget(b);
            setForm(b);
            setShowBudgetModal(true);
          }}
          onDelete={(id) => deleteBudget(id)}
          renderItem={(b) => (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  ₹
                </div>
                <div>
                  <h3 className="font-semibold text-white">{b.name}</h3>
                  <p className="text-sm text-gray-400">
                    ₹{b.amount} — {b.category}
                  </p>
                </div>
              </div>
            </>
          )}
        />

        <Section
          title="Groups"
          items={groups}
          onAdd={() => setShowGroupModal(true)}
          onEdit={(g) => {
            setEditingGroup(g);
            setGroupForm({
              name: g.name,
              members: g.members.map((m) => m.email).join(", "),
            });
            setShowGroupModal(true);
          }}
          onDelete={(id) => deleteGroup(id)}
          onItemClick={(g) => navigate(`/groups/${g._id}`)}
          renderItem={(g) => (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {g.members.length}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{g.name}</h3>
                  <p className="text-sm text-gray-400">
                    Members: {g.members.map((m) => m.name).join(", ")}
                  </p>
                </div>
              </div>
            </>
          )}
        />
      </div>

      {showBudgetModal && (
        <Modal title={editingBudget ? "Edit Budget" : "Add Budget"} onClose={closeBudgetModal}>
          <form onSubmit={saveBudget} className="space-y-4">
            <Input name="name" value={form.name} onChange={handleBudgetChange} placeholder="Name" />
            <Input name="amount" type="number" value={form.amount} onChange={handleBudgetChange} placeholder="Amount" />
            <Input name="category" value={form.category} onChange={handleBudgetChange} placeholder="Category" />
            <SubmitButton label={editingBudget ? "Update" : "Create"} />
          </form>
        </Modal>
      )}

      {showGroupModal && (
        <Modal title={editingGroup ? "Edit Group" : "Add Group"} onClose={closeGroupModal}>
          <form onSubmit={saveGroup} className="space-y-4">
            <Input name="name" value={groupForm.name} onChange={handleGroupChange} placeholder="Group Name" />
            <Input name="members" value={groupForm.members} onChange={handleGroupChange} placeholder="Member Emails (comma-separated)" />
            <SubmitButton label={editingGroup ? "Update" : "Create"} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// --- Reusable components ---
const Card = ({ title, value, color, icon, bgGradient, borderColor }) => (
  <div className={`bg-gradient-to-br ${bgGradient} backdrop-blur-sm p-8 rounded-3xl border ${borderColor} hover:scale-105 transition-all duration-300`}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-medium text-gray-300">{title}</h2>
      <span className="text-2xl opacity-50">{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const Section = ({ title, items, onAdd, onEdit, onDelete, renderItem, onItemClick }) => (
  <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <button
        onClick={onAdd}
        className="px-4 py-2 text-sm border border-gray-600 rounded-xl hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 font-medium"
      >
        + Add
      </button>
    </div>
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          key={item._id}
          className="bg-black/30 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 flex justify-between items-center hover:border-gray-600 hover:bg-black/50 transition-all duration-300 cursor-pointer group"
          onClick={() => onItemClick?.(item)}
        >
          {renderItem(item)}
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded-lg hover:bg-yellow-400/10 transition-all"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item._id);
              }}
              className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-all"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const Input = ({ name, type = "text", value, onChange, placeholder }) => (
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-4 py-4 bg-black/50 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 placeholder-gray-500"
    required
  />
);

const SubmitButton = ({ label }) => (
  <button
    type="submit"
    className="w-full py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 font-semibold"
  >
    {label}
  </button>
);