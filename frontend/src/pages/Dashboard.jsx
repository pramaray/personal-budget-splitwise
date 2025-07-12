import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import Modal from "../components/Modal";

export default function Dashboard() {
  const api = useApi();
  const [budgets, setBudgets] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form, setForm] = useState({ name: "", amount: "", category: "" });
  const [groupForm, setGroupForm] = useState({ name: "", members: "" });

  // Fetch budgets & groups
  const fetchData = async () => {
    const [budgetsRes, groupsRes] = await Promise.all([
      api.get("/budgets"),
      api.get("/groups"),
    ]);
    setBudgets(budgetsRes || []);
    setGroups(groupsRes || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
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
      const user = await api.get(`/auth/user-by-email?email=${email}`);
      if (user?._id) resolvedMembers.push(user._id);
    }

    editingGroup
      ? await api.put(`/groups/${editingGroup._id}`, {
          name: groupForm.name,
          members: resolvedMembers,
        }, "Group updated!")
      : await api.post("/groups", {
          name: groupForm.name,
          members: resolvedMembers,
        }, "Group created!");

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => localStorage.clear() || window.location.reload()}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    ${b.amount} - {b.category}
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
                className="p-3 bg-gray-700 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{g.name}</h3>
                  <p className="text-sm text-gray-400">
                    Members: {g.members.map((m) => m.name).join(", ")}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
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
                    onClick={() => deleteGroup(g._id)}
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
