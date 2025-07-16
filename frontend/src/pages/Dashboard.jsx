

import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import Modal from "../components/Modal";
import { Link,useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <div className="flex ">
          <Link to="/profile" className="hover:text-blue-400 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
            Profile
          </Link>
          <div className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"><button
            onClick={handleLogout}
            className="ml-4 hover:bg-red-700 "
          >
            Logout
          </button></div>
          </div>
      </header>

      {/* 💰 Summary + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Summary Cards */}
        {/* Pie Chart */}
        <div className="bg-gray-800 rounded p-4 flex justify-center items-center">
          <div style={{ width: "300px", height: "300px" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="text-lg font-semibold">You Owe</h2>
            <p className="text-2xl text-red-400">₹{youOwe.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="text-lg font-semibold">You Are Owed</h2>
            <p className="text-2xl text-green-400">₹{youAreOwed.toFixed(2)}</p>
          </div>
        </div>

        
      </div>

      {/* Budgets and Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {/* Budgets */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Budgets</h2>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              + Add
            </button>
          </div>
          <ul className="space-y-2">
            {budgets.map((b) => (
              <li
                key={b._id}
                className="p-3 bg-gray-700 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{b.name}</h3>
                  <p className="text-sm text-gray-400">
                    ₹{b.amount} - {b.category}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingBudget(b);
                      setForm(b);
                      setShowBudgetModal(true);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBudget(b._id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Groups */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Groups</h2>
            <button
              onClick={() => setShowGroupModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              + Add
            </button>
          </div>
          <ul className="space-y-2">
            {groups.map((g) => (
              <li
                key={g._id}
                className="p-3 bg-gray-700 rounded flex justify-between items-center cursor-pointer hover:bg-gray-600"
                onClick={() => navigate(`/groups/${g._id}`)}
              >
                <div>
                  <h3 className="font-semibold">{g.name}</h3>
                  <p className="text-sm text-gray-400">
                    Members: {g.members.map((m) => m.name).join(", ")}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGroup(g);
                      setGroupForm({
                        name: g.name,
                        members: g.members.map((m) => m.email).join(", "),
                      });
                      setShowGroupModal(true);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(g._id);
                    }}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modals */}
      {showBudgetModal && (
        <Modal title={editingBudget ? "Edit Budget" : "Add Budget"} onClose={closeBudgetModal}>
          <form onSubmit={saveBudget} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleBudgetChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleBudgetChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleBudgetChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded"
            >
              {editingBudget ? "Update" : "Create"}
            </button>
          </form>
        </Modal>
      )}

      {showGroupModal && (
        <Modal title={editingGroup ? "Edit Group" : "Add Group"} onClose={closeGroupModal}>
          <form onSubmit={saveGroup} className="space-y-4">
            <input
              name="name"
              placeholder="Group Name"
              value={groupForm.name}
              onChange={handleGroupChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              name="members"
              placeholder="Member Emails (comma-separated)"
              value={groupForm.members}
              onChange={handleGroupChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded"
            >
              {editingGroup ? "Update" : "Create"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useApi } from "../hooks/useApi";
// import Modal from "../components/Modal";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function Dashboard() {
//   const api = useApi();
//   const navigate = useNavigate();
//   const { logout, user } = useAuth();

//   const [budgets, setBudgets] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [youOwe, setYouOwe] = useState(0);
//   const [youAreOwed, setYouAreOwed] = useState(0);

//   const [showBudgetModal, setShowBudgetModal] = useState(false);
//   const [showGroupModal, setShowGroupModal] = useState(false);
//   const [editingBudget, setEditingBudget] = useState(null);
//   const [editingGroup, setEditingGroup] = useState(null);
//   const [form, setForm] = useState({ name: "", amount: "", category: "" });
//   const [groupForm, setGroupForm] = useState({ name: "", members: "" });

//   const fetchData = async () => {
//     const [budgetsRes, groupsRes] = await Promise.all([
//       api.get("/budgets"),
//       api.get("/groups"),
//     ]);
//     setBudgets(budgetsRes || []);
//     setGroups(groupsRes || []);

//     let totalOwe = 0;
//     let totalOwed = 0;
//     for (const group of groupsRes || []) {
//       const balances = await api.get(`/balances/group/${group._id}`);
//       balances.forEach((b) => {
//         if (b.user._id === user._id) return;
//         if (b.balance < 0) totalOwe += Math.abs(b.balance);
//         if (b.balance > 0) totalOwed += b.balance;
//       });
//     }
//     setYouOwe(totalOwe);
//     setYouAreOwed(totalOwed);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleBudgetChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleGroupChange = (e) =>
//     setGroupForm({ ...groupForm, [e.target.name]: e.target.value });

//   const saveBudget = async (e) => {
//     e.preventDefault();
//     editingBudget
//       ? await api.put(`/budgets/${editingBudget._id}`, form, "Budget updated!")
//       : await api.post("/budgets", form, "Budget created!");
//     closeBudgetModal();
//     fetchData();
//   };

//   const deleteBudget = async (id) => {
//     await api.del(`/budgets/${id}`, "Budget deleted!");
//     fetchData();
//   };

//   const saveGroup = async (e) => {
//     e.preventDefault();
//     const emails = groupForm.members.split(",").map((m) => m.trim());
//     const resolvedMembers = [];
//     for (const email of emails) {
//       const userRes = await api.get(`/auth/user-by-email?email=${email}`);
//       if (userRes?._id) resolvedMembers.push(userRes._id);
//     }

//     editingGroup
//       ? await api.put(
//           `/groups/${editingGroup._id}`,
//           { name: groupForm.name, members: resolvedMembers },
//           "Group updated!"
//         )
//       : await api.post(
//           "/groups",
//           { name: groupForm.name, members: resolvedMembers },
//           "Group created!"
//         );

//     closeGroupModal();
//     fetchData();
//   };

//   const deleteGroup = async (id) => {
//     await api.del(`/groups/${id}`, "Group deleted!");
//     fetchData();
//   };

//   const closeBudgetModal = () => {
//     setShowBudgetModal(false);
//     setEditingBudget(null);
//     setForm({ name: "", amount: "", category: "" });
//   };

//   const closeGroupModal = () => {
//     setShowGroupModal(false);
//     setEditingGroup(null);
//     setGroupForm({ name: "", members: "" });
//   };

//   const categoryTotals = budgets.reduce((acc, b) => {
//     acc[b.category] = (acc[b.category] || 0) + parseFloat(b.amount);
//     return acc;
//   }, {});
//   const totalAmount = Object.values(categoryTotals).reduce(
//     (sum, val) => sum + val,
//     0
//   );

//   const pieData = {
//     labels: Object.keys(categoryTotals),
//     datasets: [
//       {
//         data: Object.values(categoryTotals),
//         backgroundColor: [
//           "#F9FAFB", "#D1D5DB", "#9CA3AF", "#6B7280", "#4B5563", "#374151"
//         ],
//         hoverOffset: 8,
//       },
//     ],
//   };

//   const pieOptions = {
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             const amount = context.raw;
//             const percent = ((amount / totalAmount) * 100).toFixed(1);
//             return `${context.label}: ₹${amount} (${percent}%)`;
//           },
//         },
//       },
//       legend: {
//         position: "right",
//         labels: {
//           color: "#E5E7EB",
//           font: { size: 14 }
//         },
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <header className="flex justify-between items-center mb-8">
//         <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
//       </header>

//       {/* Summary & Pie Chart */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//         <div className="bg-gray-800 rounded-xl p-6 flex justify-center items-center shadow-lg">
//           <div className="w-72 h-72">
//             <Pie data={pieData} options={pieOptions} />
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div className="p-5 bg-gray-800 rounded-xl shadow hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold">You Owe</h2>
//             <p className="text-3xl text-red-400 mt-2">₹{youAreOwed.toFixed(2)}</p>
//           </div>
//           <div className="p-5 bg-gray-800 rounded-xl shadow hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold">You Are Owed</h2>
//             <p className="text-3xl text-green-400 mt-2">₹{youOwe.toFixed(2)}</p>
//           </div>
//         </div>
//       </div>

//       {/* Budgets & Groups */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Budgets */}
//         <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Budgets</h2>
//             <button
//               onClick={() => setShowBudgetModal(true)}
//               className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
//             >
//               + Add
//             </button>
//           </div>
//           <ul className="space-y-4">
//             {budgets.map((b) => (
//               <li
//                 key={b._id}
//                 className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
//               >
//                 <div>
//                   <h3 className="text-lg font-medium">{b.name}</h3>
//                   <p className="text-sm text-gray-300">
//                     ₹{b.amount} – {b.category}
//                   </p>
//                 </div>
//                 <div className="space-x-2">
//                   <button
//                     onClick={() => {
//                       setEditingBudget(b);
//                       setForm(b);
//                       setShowBudgetModal(true);
//                     }}
//                     className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteBudget(b._id)}
//                     className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Groups */}
//         <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Groups</h2>
//             <button
//               onClick={() => setShowGroupModal(true)}
//               className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
//             >
//               + Add
//             </button>
//           </div>
//           <ul className="space-y-4">
//             {groups.map((g) => (
//               <li
//                 key={g._id}
//                 className="p-4 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600"
//                 onClick={() => navigate(`/groups/${g._id}`)}
//               >
//                 <div>
//                   <h3 className="text-lg font-medium">{g.name}</h3>
//                   <p className="text-sm text-gray-300">
//                     Members: {g.members.map((m) => m.name).join(", ")}
//                   </p>
//                 </div>
//                 <div className="space-x-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setEditingGroup(g);
//                       setGroupForm({
//                         name: g.name,
//                         members: g.members.map((m) => m.email).join(", "),
//                       });
//                       setShowGroupModal(true);
//                     }}
//                     className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteGroup(g._id);
//                     }}
//                     className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Modals */}
//       {showBudgetModal && (
//         <Modal
//           title={editingBudget ? "Edit Budget" : "Add Budget"}
//           onClose={closeBudgetModal}
//         >
//           <form onSubmit={saveBudget} className="space-y-4">
//             <input
//               name="name"
//               placeholder="Name"
//               value={form.name}
//               onChange={handleBudgetChange}
//               className="w-full p-3 rounded bg-gray-700 border border-gray-600"
//               required
//             />
//             <input
//               name="amount"
//               type="number"
//               placeholder="Amount"
//               value={form.amount}
//               onChange={handleBudgetChange}
//               className="w-full p-3 rounded bg-gray-700 border border-gray-600"
//               required
//             />
//             <input
//               name="category"
//               placeholder="Category"
//               value={form.category}
//               onChange={handleBudgetChange}
//               className="w-full p-3 rounded bg-gray-700 border border-gray-600"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-gray-600 hover:bg-gray-500 w-full py-2 rounded text-sm"
//             >
//               {editingBudget ? "Update" : "Create"}
//             </button>
//           </form>
//         </Modal>
//       )}

//       {showGroupModal && (
//         <Modal
//           title={editingGroup ? "Edit Group" : "Add Group"}
//           onClose={closeGroupModal}
//         >
//           <form onSubmit={saveGroup} className="space-y-4">
//             <input
//               name="name"
//               placeholder="Group Name"
//               value={groupForm.name}
//               onChange={handleGroupChange}
//               className="w-full p-3 rounded bg-gray-700 border border-gray-600"
//               required
//             />
//             <input
//               name="members"
//               placeholder="Member Emails (comma-separated)"
//               value={groupForm.members}
//               onChange={handleGroupChange}
//               className="w-full p-3 rounded bg-gray-700 border border-gray-600"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-gray-600 hover:bg-gray-500 w-full py-2 rounded text-sm"
//             >
//               {editingGroup ? "Update" : "Create"}
//             </button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }
