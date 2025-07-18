import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MachineDetailsTab from './MachineDetailsTab'; // adjust the path as needed
import NotificationTab from './NotificationTab'; 
import UploadProofForm from './UploadProofForm';
import SessionBooking from './SessionBooking';

export default function OperatorDashboard() {
  const location = useLocation();
  const operator_id = location.state?.operator_id;
  const [tasks, setTasks] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Assigned Tasks');
  const [notificationCount, setNotificationCount] = useState(0); // 👈 Notification badge
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    if (!operator_id) return;
    axios.get(`http://localhost:5000/api/tasks?operator_id=${operator_id}`)
      .then(res => setTasks(res.data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, [operator_id]);


  useEffect(() => {
    const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/notifications");

      setNotifications(res.data);

      // Show red dot only if there are unseen ones
      const unseen = res.data.filter(n => !n.seen);
      setNotificationCount(unseen.length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };


    


    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (selectedTab === 'Notifications') {
        axios.post("http://localhost:5000/api/tasks/notifications/mark-seen")
          .then(() => setNotificationCount(0)) // clear badge after marking seen
          .catch(err => console.error("Failed to mark notifications as seen:", err));
      }
    }, [selectedTab]);


  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Operator Dashboard</h2>

      <div className="flex space-x-4 mb-8">
        {['Assigned Tasks', 'Machine Details', 'Notifications', 'E-learning'].map((tab, index) => (
          <button
            key={index}
            className={`relative px-4 py-2 rounded ${selectedTab === tab ? 'bg-blue-700' : 'bg-blue-500'} text-white hover:bg-blue-600`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
            {tab === 'Notifications' && notificationCount > 0 && selectedTab !== 'Notifications' && (
              <span className="absolute -top-2 -right-2 bg-red-600 w-3 h-3 rounded-full"></span>
            )}

          </button>
        ))}
      </div>



        {selectedTab === 'Assigned Tasks' && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Assigned Tasks</h3>
              {tasks.length === 0 ? (
                <p className="text-gray-600">No tasks assigned yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.map((task) => (
                    <div
                      key={task.task_id}
                      className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-200 space-y-3"
                    >
                      <h4 className="text-xl font-semibold text-blue-800">{task.task_name}</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><strong>Task ID:</strong> {task.task_id}</p>
                        <p><strong>Machine ID:</strong> {task.machine_id}</p>
                        <p><strong>Location:</strong> {task.task_location}</p>
                        <p><strong>Start:</strong> {new Date(task.scheduled_start_time).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(task.scheduled_end_time).toLocaleString()}</p>
                        <p className={`font-semibold ${task.task_status ? 'text-green-600' : 'text-yellow-600'}`}>
                          Status: {task.task_status ? 'Completed' : 'Pending'}
                        </p>
                      </div>

                      {/* Upload Proof Form */}
                      {!task.task_status && (
                        <UploadProofForm taskId={task.task_id} />
                      )}

                      {task.proof && (
                        <div className="mt-2 text-sm text-gray-500">
                          ✅ Proof Uploaded
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}



      {selectedTab === 'Machine Details' && <MachineDetailsTab />}
      {selectedTab === 'Notifications' && <NotificationTab notifications={notifications} />}
      {selectedTab === 'E-learning' && (
          <SessionBooking operatorId={operator_id} />
        )}
    </div>

  );
}
