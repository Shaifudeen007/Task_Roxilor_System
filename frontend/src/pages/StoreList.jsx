import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [qName, setQName] = useState('');
  const [qAddress, setQAddress] = useState('');

  const fetch = async () => {
    const res = await API.get('/stores', { params: { qName, qAddress } });
    setStores(res.data);
  };

  useEffect(()=>{ fetch(); }, []);

  return (
    <div>
      <h2>Stores</h2>
      <div>
        <input placeholder="Search by name" value={qName} onChange={e=>setQName(e.target.value)} />
        <input placeholder="Search by address" value={qAddress} onChange={e=>setQAddress(e.target.value)} />
        <button onClick={fetch}>Search</button>
      </div>
      <div>
        {stores.map(s => (
          <div key={s.id} style={{border:'1px solid #ccc', margin:'8px', padding:'8px'}}>
            <h3>{s.name}</h3>
            <p>{s.address}</p>
            <p>Avg Rating: {Number(s.avgRating).toFixed(2)}</p>
            <Link to={`/store/${s.id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
