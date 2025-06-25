import React from 'react';
import { useNavigate } from 'react-router-dom';

function DefaultPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Silakan pilih</h2>
      <button onClick={() => navigate('/login')} style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
      <h2>atau</h2>
      <button onClick={() => navigate('/register')} style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
    </div>
  );
}

export default DefaultPage;
