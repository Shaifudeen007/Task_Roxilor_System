import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { logout, getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const nav = useNavigate();

  const fetchDashboard = async () => {
    const d = await API.get('/admin/dashboard');
    setStats(d.data);
  };

  const fetchUsers = async () => {
    const res = await API.get('/admin/users');
    setUsers(res.data.rows || []);
  };

  const fetchStores = async () => {
    const res = await API.get('/admin/stores');
    setStores(res.data || []);
  };

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  }, []);

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <p>Total Users: {stats.userCount}</p>
        <p>Total Stores: {stats.storeCount}</p>
        <p>Total Ratings: {stats.ratingCount}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>

      <h3>Users</h3>
      <div>{users.map(u => <div key={u.id}>{u.name} - {u.email} - {u.role}</div>)}</div>

      <h3>Stores</h3>
      <div>{stores.map(s => <div key={s.id}>{s.name} - Avg: {Number(s.avgRating || 0).toFixed(2)}</div>)}</div>
    </div>
  );
}
