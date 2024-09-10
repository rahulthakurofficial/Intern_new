
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const UserDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interval, setInterval] = useState(30);
  const [availabilities, setAvailabilities] = useState([]);
  const [editingAvailabilityId, setEditingAvailabilityId] = useState(null);

  // Fetch all availabilities for this user
  useEffect(() => {
    const fetchAvailabilities = async () => {
      const response = await axios.get('http://localhost:5000/availability');
      setAvailabilities(response.data);
    };
    fetchAvailabilities();
  }, []);

  // Submit or update availability
  const submitAvailability = async () => {
    const availabilityData = {
      user: 'user@gmail.com',
      start: new Date(
        selectedDate?.setHours(
          parseInt(startTime.split(':')[0]),
          parseInt(startTime.split(':')[1])
        )
      ),
      end: new Date(
        selectedDate?.setHours(
          parseInt(endTime.split(':')[0]),
          parseInt(endTime.split(':')[1])
        )
      ),
      duration: interval,
    };

    if (editingAvailabilityId) {
      // Update existing availability
      await axios.put(`http://localhost:5000/availability/${editingAvailabilityId}`, availabilityData);
      alert('Availability updated successfully!');
      setEditingAvailabilityId(null);
    } else {
      // Create new availability
      await axios.post('http://localhost:5000/availability', availabilityData);
      alert('Availability submitted successfully!');
    }

    // Refresh availabilities after submitting
    const response = await axios.get('http://localhost:5000/availability');
    setAvailabilities(response.data);
  };

  // Edit availability
  const editAvailability = (availability) => {
    setSelectedDate(new Date(availability.start));
    setStartTime(new Date(availability.start).toLocaleTimeString('en-US', { hour12: false }));
    setEndTime(new Date(availability.end).toLocaleTimeString('en-US', { hour12: false }));
    setInterval(availability.duration);
    setEditingAvailabilityId(availability._id);
  };

  // Delete availability
  const deleteAvailability = async (id) => {
    await axios.delete(`http://localhost:5000/availability/${id}`);
    alert('Availability deleted successfully!');
    setAvailabilities(availabilities.filter((availability) => availability._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">User Dashboard</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 w-11/12 max-w-lg">
        {/* Calendar */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select a Date</h2>
          <Calendar
            onClickDay={setSelectedDate}
            className="mx-auto border rounded-lg shadow"
          />
        </div>

        {/* Time Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full text-gray-600"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full text-gray-600"
          />
        </div>

        {/* Interval Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Interval (minutes):</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            min="15"
            step="15"
            className="border rounded-lg px-4 py-2 w-full text-gray-600"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submitAvailability}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 w-full"
        >
          {editingAvailabilityId ? 'Update Availability' : 'Submit Availability'}
        </button>

        {/* List of availabilities */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Availabilities</h2>
          <ul>
            {availabilities.map((availability) => (
              <li key={availability._id} className="mb-4">
                {new Date(availability.start).toLocaleString()} - {new Date(availability.end).toLocaleString()} ({availability.duration} mins)
                <button
                  onClick={() => editAvailability(availability)}
                  className="bg-yellow-500 text-white font-bold px-4 py-2 ml-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAvailability(availability._id)}
                  className="bg-red-500 text-white font-bold px-4 py-2 ml-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
