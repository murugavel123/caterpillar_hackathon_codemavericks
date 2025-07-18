import React from "react";

const NotificationTab = ({ notifications }) => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4 text-blue-700">Safety Alerts</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications.</p>
      ) : (
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {notifications.map((item, index) => (
            <div
              key={item._id || index}
              className="bg-white border border-red-300 rounded-xl p-4 shadow-md"
            >
              <div className="text-sm text-gray-800">
                <p><strong>Time:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                <p><strong>Machine ID:</strong> {item.machine_id}</p>
                <p><strong>Operator ID:</strong> {item.operator_id}</p>
                <p><strong>Reason:</strong> {Array.isArray(item.description) ? item.description.join(', ') : item.description}</p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationTab;
