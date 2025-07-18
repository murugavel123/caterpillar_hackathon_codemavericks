import React, { useState } from "react";
import TaskAssignment from "./TaskAssignment";
import OperatingTasks from "./OperatorTracking";
import CompletedTasks from "./CompletedTasks"; 


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Assign");

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h2>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mb-8">
        {["Assign", "Track", "Completed"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "Assign" ? "Assign Task" : tab === "Track" ? "Track Tasks" : "Completed Tasks"}
          </button>
        ))}
        <button
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => window.open("https://gemini.google.com/share/47faf31e117d", "_blank")}
        >
          ChatBot
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "Assign" && <TaskAssignment />}
      {activeTab === "Track" && <OperatingTasks />}
      {activeTab === "Completed" && <CompletedTasks />}
    </div>
  );
}
