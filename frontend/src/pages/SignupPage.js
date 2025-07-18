// src/pages/SignupPage.jsx
import React, { useState } from "react";
import axios from "axios";

export default function SignupPage() {
  const [form, setForm] = useState({
    id: "", email: "", password: "", role: "", field_of_expertise: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-700">Signup</h2>

        <input
          name="id"
          placeholder="ID"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Operator">Operator</option>
          <option value="Instructor">Instructor</option>
        </select>

        {form.role === "Instructor" && (
          <input
            name="field_of_expertise"
            placeholder="Field of Expertise"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
