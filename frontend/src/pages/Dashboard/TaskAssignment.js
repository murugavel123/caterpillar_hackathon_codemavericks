import React, { useState } from "react";

const TaskAssignment = () => {
  const [formData, setFormData] = useState({
    operator_id: "",
    admin_id: "",
    task_name: "",
    machine_id: "",
    task_location: "",
    scheduled_start_time: "",
    scheduled_end_time: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAssign = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: `TASK_${Date.now()}`, ...formData }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Task assigned successfully!");
        setFormData({
          operator_id: "",
          admin_id: "",
          task_name: "",
          machine_id: "",
          task_location: "",
          scheduled_start_time: "",
          scheduled_end_time: "",
        });
      } else {
        alert("❌ Failed: " + result.error);
      }
    } catch (error) {
      alert("⚠️ Error while assigning task.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-blue-800 border-b pb-2">Assign Task</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "admin_id", label: "Admin ID" },
          { name: "operator_id", label: "Operator ID" },
          { name: "machine_id", label: "Machine ID" },
          { name: "task_name", label: "Task Name" },
          { name: "task_location", label: "Task Location" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Scheduled Start Time</label>
          <input
            type="datetime-local"
            name="scheduled_start_time"
            value={formData.scheduled_start_time}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Scheduled End Time</label>
          <input
            type="datetime-local"
            name="scheduled_end_time"
            value={formData.scheduled_end_time}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleAssign}
          className="bg-blue-700 hover:bg-blue-800 transition-colors text-white font-semibold px-6 py-2 rounded-lg shadow-md"
        >
          Assign Task
        </button>
      </div>
    </div>
  );
};

export default TaskAssignment;
