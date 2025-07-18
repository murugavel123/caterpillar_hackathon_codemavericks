// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ id: "", password: "", role: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const { role, operator_id, instructor_id } = res.data;

      if (role === "Admin") navigate("/admin");
      else if (role === "Operator") navigate("/operator", { state: { operator_id } });
      else if (role === "Instructor") navigate("/instructor", { state: { instructor_id } });

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Login</h2>

        <input
          name="id"
          placeholder="ID"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Operator">Operator</option>
          <option value="Instructor">Instructor</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
