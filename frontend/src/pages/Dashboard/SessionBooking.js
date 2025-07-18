import React, { useEffect, useState } from "react";

function SessionBooking({ operatorId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/session");
      const data = await res.json();
      if (Array.isArray(data)) {
        // ✅ Show sessions if:
        // - Not booked
        // - OR booked by this operator
        const visible = data.filter(
          (s) => (!s.booked && !s.completed) || (s.booked && s.operator_id === operatorId)
        );
        setSessions(visible);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleBooking = async (sessionId) => {
    const confirm = window.confirm("Do you want to book this session?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/session/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booked: true, operator_id: operatorId }),
      });

      if (res.ok) {
        fetchSessions(); // ✅ Refetch to reflect booking state
        alert("Session booked successfully!");
      }
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-blue-700">Available Sessions</h3>
      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">No available sessions right now.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isBookedByMe = session.booked && session.operator_id === operatorId;
            const isBookable = !session.booked && !session.completed;

            return (
              <div
                key={session._id}
                className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-yellow-50"
              >
                <div>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(session.start_time).toLocaleTimeString()} -{" "}
                    {new Date(session.end_time).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Instructor:</strong> {session.instructor_id}
                  </p>
                </div>

                {isBookable ? (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => handleBooking(session._id)}
                  >
                    Book
                  </button>
                ) : isBookedByMe ? (
                  <button
                    className="bg-gray-400 text-white font-semibold py-2 px-4 rounded cursor-not-allowed"
                    disabled
                  >
                    Booked
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SessionBooking;
