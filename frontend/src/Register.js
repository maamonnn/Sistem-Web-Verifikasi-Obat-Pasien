// src/Register.js
import React, { useState } from 'react';
import Nav from './NavBar';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('Pendaftaran berhasil');
    } else {
      setMsg((data.error || 'Gagal daftar'));
    }
  };

  return (
    <>
        <div className='login-box'>
        <h2>Register</h2>
        <form className='login-form' onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className='login-button'>Register</button>
        </form>
        {msg && ( <div className='err-msg'>{msg}</div>)}
        </div>
    </>
  );
}

export default Register;
