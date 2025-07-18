import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function InstructorDashboard() {
  const location = useLocation();
  const instructorId = location.state?.instructor_id;
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });
  const [message, setMessage] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "booked") {
      setLoading(true);
      fetch("http://localhost:5000/session?instructor_id=" + instructorId)
        .then(res => res.json())
        .then(async data => {
          const filtered = data.filter(s => s.booked && !s.completed);
          const response = await fetch("http://localhost:5000/api/auth/operators");
          const operatorList = await response.json();
          const operatorMap = Object.fromEntries(operatorList.map(op => [op.operator_id, op.email]));
          const enriched = filtered.map(s => ({
            ...s,
            operator_email: operatorMap[s.operator_id] || "N/A"
          }));
          setSessions(enriched);
        })
        .catch(err => console.error("Error fetching sessions:", err))
        .finally(() => setLoading(false));
    }
  }, [activeTab, instructorId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        date: new Date(formData.date),
        start_time: new Date(`${formData.date}T${formData.start_time}`),
        end_time: new Date(`${formData.date}T${formData.end_time}`),
        instructor_id: instructorId,
        booked: false,
        completed: false,
      };
      const res = await fetch("http://localhost:5000/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Session created!");
        setFormData({ date: "", start_time: "", end_time: "" });
      } else {
        setMessage("❌ " + (result.error || "Failed"));
      }
    } catch (err) {
      setMessage("❌ Server Error");
    }
  };

  const handleComplete = async (id) => {
    const confirm = window.confirm("Mark this session as completed?");
    if (!confirm) return;
    try {
      await fetch(`http://localhost:5000/session/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert("❌ Failed to update");
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === "create"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create Session
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === "booked"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("booked")}
          >
            Booked Sessions
          </button>
        </div>

        {/* Create Session Form */}
        {activeTab === "create" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {["date", "start_time", "end_time"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium mb-1 capitalize">
                  {field.replace("_", " ")}:
                </label>
                <input
                  type={field.includes("time") ? "time" : "date"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Submit
            </button>
            {message && (
              <div className="mt-2 font-medium text-center text-green-600">{message}</div>
            )}
          </form>
        )}

        {/* Booked Sessions */}
        {activeTab === "booked" && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-blue-700">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="text-gray-600">No sessions booked yet.</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-blue-100 border border-blue-300 p-5 rounded-lg shadow-md transition hover:shadow-lg"
                >
                  <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date(session.start_time).toLocaleTimeString()} - {new Date(session.end_time).toLocaleTimeString()}</p>
                  <p><strong>Operator Email:</strong> {session.operator_email}</p>
                  <button
                    onClick={() => handleComplete(session._id)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition"
                  >
                    Mark Completed
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;
