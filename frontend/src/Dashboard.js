import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VerificationModal from './Verification';
import Webcam from 'react-webcam';


function Dashboard() {
  const { id } = useParams();
  console.log('📦 ID dari URL:', id);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/dashboard/${id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setError('Gagal memuat data. Silakan login ulang.'));
  }, [id]);

  return (
    <>
      <div className='main'>
        {error ? (
          <p>{error}</p>
        ) : (
          <h2 style={{padding: '10px', marginBottom: '50px'}}>Selamat datang, {user?.username}!</h2>
        )}

          <Table/>
          <button onClick={() => setShowVerification(true)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Buka Kamera Verifikasi
          </button>
          <VerificationModal visible={showVerification} onClose={() => setShowVerification(false)} />
      </div>
    </>
  );
}

function Table() {
  const [rows, setRows] = useState([
    { id: 1, obat: 'Cetirizine', jadwal: '07.00' },
    { id: 2, obat: 'Cetirizine', jadwal: '12.00' },
    { id: 3, obat: 'Cetirizine', jadwal: '18.00' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ obat: '', jadwal: '' });

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setFormData({ obat: '', jadwal: '' });
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const nextId = rows.length + 1;
    setRows([...rows, { id: nextId, ...formData }]);
    handleCloseForm();
  };

  // Styles
  const containerStyle = {
    position: 'relative',
    width: 'fit-content',
    margin: '40px auto',
    textAlign: 'center'
  };

  const tableStyle = {
    border: '1px solid black',
    width: '500px',
    textAlign: 'center',
    borderCollapse: 'collapse',
    marginBottom: '20px'
  };

  const cellStyle = {
    border: '1px solid black',
    padding: '10px'
  };

  const buttonTopStyle = {
    position: 'absolute',
    top: '-40px',
    right: '0',
    padding: '8px 12px',
    backgroundColor: '#2d89ef',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const buttonBottomStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const cancelButtonStyle ={
    padding: '10px 20px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px'
  };

  const modalOverlay = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  const modalContent = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'left'
  };

  return (
    <div style={containerStyle}>
      <button style={buttonTopStyle} onClick={handleOpenForm}>+ Tambah Jadwal</button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>No.</th>
            <th style={cellStyle}>Jenis Obat</th>
            <th style={cellStyle}>Jadwal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={cellStyle}>{row.id}</td>
              <td style={cellStyle}>{row.obat}</td>
              <td style={cellStyle}>{row.jadwal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <div style={modalOverlay}>
          <form style={modalContent} onSubmit={handleFormSubmit}>
            <h3>Tambah Jadwal</h3>
            <label>Jenis Obat:</label><br />
            <input
              type="text"
              name="obat"
              value={formData.obat}
              onChange={handleFormChange}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            /><br />
            <label>Jam Konsumsi:</label><br />
            <input
              type="time"
              name="jadwal"
              value={formData.jadwal}
              onChange={handleFormChange}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            /><br />
            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={handleCloseForm} style={cancelButtonStyle}>
                Batal
              </button>
              <button type="submit" style={buttonBottomStyle}>Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


export default Dashboard;
