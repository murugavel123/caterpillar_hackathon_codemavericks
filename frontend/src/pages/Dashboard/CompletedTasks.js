import React, { useEffect, useState } from "react";
import axios from "axios";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/completed-tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error("Error fetching completed tasks:", err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-xl font-semibold text-blue-800">Completed Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks completed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.task_id} className="border rounded p-4 shadow-md">
              <p><strong>Task ID:</strong> {task.task_id}</p>
              <p><strong>Operator ID:</strong> {task.operator_id}</p>
              <p><strong>Machine ID:</strong> {task.machine_id}</p>
              <p><strong>Start Time:</strong> {new Date(task.actual_start_time).toLocaleString()}</p>
              <p><strong>End Time:</strong> {new Date(task.actual_end_time).toLocaleString()}</p>
              {task.proof && (
                <img
                  src={`http://localhost:5000/uploads/${task.proof}`}
                  alt="Proof"
                  className="w-full h-48 object-cover mt-2 rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
