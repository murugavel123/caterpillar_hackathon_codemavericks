import React, { useEffect, useState } from "react";
import axios from "axios";

const MachineDetailsTab = () => {
  const [allData, setAllData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/api/tasks/machine-details");
      setAllData(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (allData.length === 0) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index >= allData.length) return clearInterval(interval);
      const newItem = {
        ...allData[index],
        timestamp: new Date().toLocaleTimeString(), // ⏰ Add current time
      };
      setDisplayedData(prev => [...prev, newItem]);
      index++;
    }, 1000); // 2 seconds

    return () => clearInterval(interval);
  }, [allData]);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4 text-blue-700">Machine Details Live Feed</h3>
      {displayedData.length === 0 ? (
        <p className="text-gray-600">Loading machine data...</p>
      ) : (
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {displayedData.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-800">
                <p><strong>Timestamp:</strong> {item.timestamp}</p>
                <p><strong>Machine ID:</strong> {item.machine_id}</p>
                <p><strong>Operator ID:</strong> {item.operator_id}</p>
                <p><strong>Engine Hours:</strong> {item.engine_hours}</p>
                <p><strong>Fuel Used:</strong> {item.fuels_used}</p>
                <p><strong>Load Cycles:</strong> {item.load_cycles}</p>
                <p><strong>Idling Time:</strong> {item.idling_time}</p>
                <p>
                  <strong>Seatbelt:</strong>{" "}
                  <span className={item.seatbelt_status ? "text-green-600" : "text-red-600"}>
                    {item.seatbelt_status ? "On" : "Off"}
                  </span>
                </p>

                <p><strong>Proximity:</strong> {item.proximity}</p>
                <p><strong>Object:</strong> {item.object}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MachineDetailsTab;
