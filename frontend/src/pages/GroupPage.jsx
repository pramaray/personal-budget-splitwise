
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function GroupPage() {
  const { id } = useParams(); // Group ID from URL
  const api = useApi();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    paidBy: "",
    splitBetween: [],
  });

  // 📥 Fetch group details, expenses, and balances
  const fetchData = async () => {
    const groupRes = await api.get(`/groups/${id}`);
    const expensesRes = await api.get(`/expenses/group/${id}`);
    const balancesRes = await api.get(`/balances/group/${id}`);
    setGroup(groupRes);
    setExpenses(expensesRes);
    setBalances(balancesRes);
  };
  const { user, loading } = useAuth();

if (loading) {
  return <p className="text-center mt-10">Loading...</p>;
}

if (!user) {
  return <p className="text-center mt-10">Please log in to view this page.</p>;
}

  useEffect(() => {
    if (user) fetchData();
  }, [id,user]);

  // 📝 Handle expense form changes
  const handleExpenseChange = (e) =>
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });

  const handleParticipantsChange = (e) =>
    setExpenseForm({
      ...expenseForm,
      splitBetween: [...e.target.selectedOptions].map((o) => o.value),
    });

  // ✅ Save (Create or Update) expense
  const saveExpense = async (e) => {
    e.preventDefault();
    if (editingExpense) {
      await api.put(`/expenses/${editingExpense._id}`, expenseForm);
    } else {
      await api.post("/expenses", { ...expenseForm, group: id });
    }
    setShowExpenseModal(false);
    setEditingExpense(null);
    setExpenseForm({ description: "", amount: "", paidBy: "", splitBetween: [] });
    fetchData();
  };

  // ❌ Delete expense
  const deleteExpense = async (expenseId) => {
    await api.del(`/expenses/${expenseId}`);
    fetchData();
  };
  
    // const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    // const currentUserId = currentUser._id;
    // console.log("Current User ID:", currentUserId);
    // console.log("Balances API Response:", balances);
    //   const youOwe = 0;
    //   const youAreOwed =  0;

const youOwe = balances
  .filter((b) => b.user._id !== user._id && b.balance < 0)
  .reduce((acc, b) => acc + Math.abs(b.balance), 0);

const youAreOwed = balances
  .filter((b) => b.user._id !== user._id && b.balance > 0)
  .reduce((acc, b) => acc + b.balance, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{group?.name || "Loading Group..."}</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Back
        </button>
      </header>

      {/* 💰 Balance Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-semibold">You Owe</h2>
          <p className="text-2xl text-red-400">₹{youAreOwed.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-semibold">You Are Owed</h2>
          <p className="text-2xl text-green-400">₹{youOwe.toFixed(2)}</p>
        </div>
      </div>

      {/* 📜 Expenses */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Expenses</h2>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            + Add Expense
          </button>
        </div>
        <ul className="space-y-2">
          {expenses?.length ? (
            expenses.map((exp) => (
              <li
                key={exp._id}
                className="p-3 bg-gray-700 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{exp.description}</h3>
                  <p className="text-sm text-gray-400">
                    ₹{exp.amount} - Paid by {exp.paidBy?.name || "Unknown"}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingExpense(exp);
                      setExpenseForm({
                        description: exp.description,
                        amount: exp.amount,
                        paidBy: exp.paidBy?._id || "",
                        splitBetween: exp.splitBetween?.map((p) => p._id) || [],
                      });
                      setShowExpenseModal(true);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpense(exp._id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No expenses yet.</p>
          )}
        </ul>
      </div>

      {/* 🖋️ Expense Modal */}
      {showExpenseModal && (
        <Modal
          title={editingExpense ? "Edit Expense" : "Add Expense"}
          onClose={() => {
            setShowExpenseModal(false);
            setEditingExpense(null);
            setExpenseForm({ description: "", amount: "", paidBy: "", splitBetween: [] });
          }}
        >
          <form onSubmit={saveExpense} className="space-y-4">
            <input
              name="description"
              placeholder="Description"
              value={expenseForm.description}
              onChange={handleExpenseChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={expenseForm.amount}
              onChange={handleExpenseChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <select
              name="paidBy"
              value={expenseForm.paidBy}
              onChange={handleExpenseChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            >
              <option value="">Paid By</option>
              {group?.members?.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
            <select
              multiple
              value={expenseForm.splitBetween}
              onChange={handleParticipantsChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            >
              {group?.members?.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded"
            >
              {editingExpense ? "Update" : "Create"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
