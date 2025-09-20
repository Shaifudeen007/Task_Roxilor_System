import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const nav = useNavigate();

  const fetch = async () => {
    try {
      const res = await API.get('/ratings/owner/ratings');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{ fetch(); }, []);

  return (
    <div>
      <h2>Owner Dashboard</h2>
      <button onClick={()=>{ logout(); nav('/login'); }}>Logout</button>
      <h3>Ratings on your stores</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
