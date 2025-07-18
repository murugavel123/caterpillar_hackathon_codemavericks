import React, { useEffect, useState } from "react";

const OperatingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/operator-tasks");
        if (!response.ok) {
          setError(response.status === 404 ? "✅ All tasks are completed." : "❌ Server error.");
        } else {
          const data = await response.json();
          setTasks(data);
        }
      } catch {
        setError("⚠️ Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h3 className="text-xl font-semibold text-blue-800">Operator Task Tracker</h3>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.task_id} className="border p-4 rounded shadow-sm">
              <p><strong>Operator ID:</strong> {task.operator_id}</p>
              <p><strong>Task Name:</strong> {task.task_name}</p>
              <p><strong>Location:</strong> {task.task_location}</p>
              <p><strong>Start:</strong> {new Date(task.scheduled_start_time).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(task.scheduled_end_time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperatingTasks;
