
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    fetch("http://localhost:5000/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.log(err));
  }, []);

  const income = transactions
    .filter(item => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expense = transactions
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - expense;

  const addTransaction = async () => {
    if (!title || !amount || Number(amount) <= 0) {
      alert("Enter valid details");
      return;
    }

    const newTransaction = {
      title,
      amount: Number(amount),
      type,
      category
    };

    try {
      const response = await fetch(
        "http://localhost:5000/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newTransaction)
        }
      );

      const savedTransaction = await response.json();

      setTransactions([...transactions, savedTransaction]);
      setTitle("");
      setAmount("");
    } catch (error) {
      alert("Unable to add transaction");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`http://localhost:5000/transactions/${id}`, {
        method: "DELETE"
      });

      setTransactions(
        transactions.filter(item => item.id !== id)
      );
    } catch (error) {
      alert("Unable to delete transaction");
    }
  };

  return (
    <div className="container">
      <h1>Personal Expense Tracker</h1>
      <p>Manage Your Money Smartly!</p>

      <div className="summary">
        <div className="card">
          <h3>Balance</h3>
          <h2>₹{balance.toFixed(2)}</h2>
        </div>

        <div className="card">
          <h3>Income</h3>
          <h2>₹{income.toFixed(2)}</h2>
        </div>

        <div className="card">
          <h3>Expenses</h3>
          <h2>₹{expense.toFixed(2)}</h2>
        </div>
      </div>

      <div className="form">
        <h2>Add Transaction</h2>

        <input
          placeholder="Enter title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Salary</option>
          <option>Other</option>
        </select>

        <button onClick={addTransaction}>
          Add Transaction
        </button>
      </div>

      <div className="history">
        <h2>Transaction History</h2>

        {transactions.map(item => (
          <div className="transaction" key={item.id}>
            <span>
              {item.title} - ₹{Number(item.amount).toFixed(2)}
              {" "}({item.type})
            </span>

            <button onClick={() => deleteTransaction(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
