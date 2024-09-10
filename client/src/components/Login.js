
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Login.css'; // External CSS for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      if (response.data.success) {
        setIsLoggedIn(true); // Set login status to true

        // Delay the navigation to show the links first
        setTimeout(() => {
          navigate('/dashboard');  // Redirect to the dashboard
        }, 2000);  // 2 seconds delay before redirecting
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred, try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}

        {/* Conditionally render the dashboard links only if logged in */}
        {isLoggedIn && (
          <div className="dashboard-links">
            <ul>
              <li><Link to="/user-dashboard">User Dashboard</Link></li>
              <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
