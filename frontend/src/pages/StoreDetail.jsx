import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';
import { getUser } from '../utils/auth';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [avg, setAvg] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [myRating, setMyRating] = useState('');
  const user = getUser();

  const fetch = async () => {
    try {
      const res = await API.get(`/stores/${id}`);
      setStore(res.data.store);
      setAvg(res.data.avgRating);
      setUserRating(res.data.userRating);
      setMyRating(res.data.userRating || '');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{ fetch(); }, [id]);

  const submitRating = async () => {
    if (!user) return alert('Please login to rate');
    try {
      await API.post(`/ratings/${id}`, { rating: Number(myRating) });
      alert('Rating submitted');
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  if (!store) return <div>Loading...</div>;
  return (
    <div>
      <h2>{store.name}</h2>
      <p>{store.address}</p>
      <p>Avg Rating: {Number(avg).toFixed(2)}</p>
      <div>
        <label>Your rating (1-5): </label>
        <input value={myRating} onChange={e=>setMyRating(e.target.value)} type="number" min="1" max="5"/>
        <button onClick={submitRating}>Submit/Update</button>
      </div>
    </div>
  );
}
