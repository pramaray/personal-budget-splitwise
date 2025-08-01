import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Edit, Trash, Plus } from "lucide-react";

export default function GroupPage() {
  const { id } = useParams();
  const api = useApi();
  const { user, loading } = useAuth();

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

  const fetchData = async () => {
    const groupRes = await api.get(`/groups/${id}`);
    const expensesRes = await api.get(`/expenses/group/${id}`);
    const balancesRes = await api.get(`/balances/group/${id}`);
    setGroup(groupRes);
    setExpenses(expensesRes);
    setBalances(balancesRes);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [id, user]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700">
        <p className="text-white text-xl">Please log in to view this page.</p>
      </div>
    </div>
  );

  const handleExpenseChange = (e) =>
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });

  const handleParticipantsChange = (e) =>
    setExpenseForm({
      ...expenseForm,
      splitBetween: [...e.target.selectedOptions].map((o) => o.value),
    });

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

  const deleteExpense = async (expenseId) => {
    await api.del(`/expenses/${expenseId}`);
    fetchData();
  };

  const youOwe = balances
    .filter((b) => b.user._id === user._id && b.balance < 0)
    .reduce((acc, b) => acc + Math.abs(b.balance), 0);

  const youAreOwed = balances
    .filter((b) => b.user._id === user._id && b.balance > 0)
    .reduce((acc, b) => acc + b.balance, 0);

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setEditingExpense(null);
    setExpenseForm({ description: "", amount: "", paidBy: "", splitBetween: [] });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white opacity-2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white opacity-1 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      {/* <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
        <div className="mb-4 md:mb-0 flex items-center gap-4">
          
          <div >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              {group?.name || "Loading Group..."}
            </h1>
            <p className="text-gray-400">{group?.members?.length || 0} members</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-xl border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header> */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
        {/* Left: Group name and members */}
        <div className="mb-4 md:mb-0 flex items-center gap-4">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              {group?.name || "Loading Group..."}
            </h1>
            <p className="text-gray-400">{group?.members?.length || 0} members</p>
          </div>
        </div>

        {/* Right: Back button */}
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-xl border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 font-medium flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>


      {/* Balance Summary */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
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
      </div>

      {/* Expenses Section */}
      <div className="relative z-10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Expenses</h2>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-4 py-2 text-sm border border-gray-600 rounded-xl hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        {expenses?.length ? (
          <ul className="space-y-4">
            {expenses.map((exp) => (
              <li
                key={exp._id}
                className="bg-black/30 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 flex justify-between items-center hover:border-gray-600 hover:bg-black/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    ₹
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{exp.description}</h3>
                    <p className="text-sm text-gray-400">
                      ₹{exp.amount} • Paid by{" "}
                      <span className="font-medium">{exp.paidBy?.name || "Unknown"}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    className="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded-lg hover:bg-yellow-400/10 transition-all flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpense(exp._id)}
                    className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-all flex items-center gap-1"
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl opacity-50">₹</span>
            </div>
            <p className="text-gray-400 text-lg mb-2">No expenses added yet</p>
            <p className="text-gray-500 text-sm">Start by adding your first group expense</p>
          </div>
        )}
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <Modal
          title={editingExpense ? "Edit Expense" : "Add Expense"}
          onClose={closeExpenseModal}
        >
          <form onSubmit={saveExpense} className="space-y-4">
            <Input
              name="description"
              value={expenseForm.description}
              onChange={handleExpenseChange}
              placeholder="Description"
            />
            <Input
              name="amount"
              type="number"
              value={expenseForm.amount}
              onChange={handleExpenseChange}
              placeholder="Amount"
            />
            <Select
              name="paidBy"
              value={expenseForm.paidBy}
              onChange={handleExpenseChange}
              options={[
                { value: "", label: "Paid By" },
                ...(group?.members?.map((m) => ({
                  value: m._id,
                  label: `${m.name} (${m.email})`,
                })) || []),
              ]}
            />
            <MultiSelect
              name="splitBetween"
              value={expenseForm.splitBetween}
              onChange={handleParticipantsChange}
              options={group?.members?.map((m) => ({
                value: m._id,
                label: `${m.name} (${m.email})`,
              })) || []}
              placeholder="Split Between"
            />
            <SubmitButton label={editingExpense ? "Update Expense" : "Add Expense"} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// --- Reusable components (matching dashboard style) ---
const Card = ({ title, value, color, icon, bgGradient, borderColor }) => (
  <div className={`bg-gradient-to-br ${bgGradient} backdrop-blur-sm p-8 rounded-3xl border ${borderColor} hover:scale-105 transition-all duration-300`}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-medium text-gray-300">{title}</h2>
      <span className="text-2xl opacity-50">{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
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

const Select = ({ name, value, onChange, options }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full px-4 py-4 bg-black/50 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
    required
  >
    {options.map((option) => (
      <option key={option.value} value={option.value} className="bg-black text-white">
        {option.label}
      </option>
    ))}
  </select>
);

const MultiSelect = ({ name, value, onChange, options, placeholder }) => (
  <div className="space-y-2">
    <select
      multiple
      value={value}
      onChange={onChange}
      className="w-full px-4 py-4 bg-black/50 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 min-h-[120px]"
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="p-2 bg-black text-white">
          {option.label}
        </option>
      ))}
    </select>
    <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple members</p>
  </div>
);

const SubmitButton = ({ label }) => (
  <button
    type="submit"
    className="w-full py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 font-semibold"
  >
    {label}
  </button>
);
