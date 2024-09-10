import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [availabilities, setAvailabilities] = useState([]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      const response = await axios.get('http://localhost:5000/availability');
      setAvailabilities(response.data);
    };
    fetchAvailabilities();
  }, []);

  // Delete availability
  const deleteAvailability = async (id) => {
    await axios.delete(`http://localhost:5000/availability/${id}`);
    setAvailabilities(availabilities.filter((availability) => availability._id !== id));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {availabilities.map((availability) => (
          <li key={availability._id}>
            User: {availability.user}, Available from: {new Date(availability.start).toLocaleString()} to {new Date(availability.end).toLocaleString()}
            <button onClick={() => deleteAvailability(availability._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
