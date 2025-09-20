import React, { useState } from 'react';
import API from '../api/api';
import { saveAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [address,setAddress] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/signup', { name, email, address, password });
      saveAuth(data.token, data.user);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input placeholder="Name (20-60 chars)" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
