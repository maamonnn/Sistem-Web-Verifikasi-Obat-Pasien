// LoginForm.js
import React, { useState } from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import Nav from './NavBar';
import './App.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('Login sukses');
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate(`/dashboard/${data.id}`);

    } else {
      setMsg((data.error));
    }
  };

  return (
    <>
        <div className="login-box">
        <h2>Silahkan Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                
                {msg && <div className="err-msg">{msg}</div>}

                <button type="submit" className="login-button">Login</button>
            </form>
        </div>

    </>
  );
}

export default LoginForm;
