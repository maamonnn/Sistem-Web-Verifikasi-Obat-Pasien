// src/Verification.js
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

function VerificationModal({ visible, onClose }) {
  const webcamRef = useRef();
  const [imageURL, setImageURL] = useState(null);
  const [resultMsg, setResultMsg] = useState('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageURL(imageSrc);
    setResultMsg('');
  }, []);

  const handleSubmit = async (mode) => {
    if (!imageURL) {
      alert('📸 Ambil gambar dulu sebelum submit');
      return;
    }

    const blob = await fetch(imageURL).then(res => res.blob());
    const formData = new FormData();
    formData.append('image', blob, 'face.jpg');

    const endpoint = mode === 'register'
      ? 'http://localhost:3000/api/register-face'
      : 'http://localhost:3000/api/verify-face';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      const result = await res.json();

      if (res.ok) {
        setResultMsg(`${result.message}`);
      } else {
        setResultMsg(`${result.message}`);
      }
    } catch (err) {
      setResultMsg('⚠️ Gagal mengirim gambar ke server.');
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Verifikasi atau Registrasi Wajah</h3>

        {!imageURL ? (
          <>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={300} />
            <br />
            <button onClick={capture} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Ambil Gambar
            </button>
          </>
        ) : (
          <>
            <img src={imageURL} alt="Captured" width={300} /><br /><br />
            <button onClick={() => handleSubmit('register')} style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Registrasi
            </button>
            <button onClick={() => handleSubmit('verify')} style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Verifikasi
            </button>
          </>
        )}

        {resultMsg && (
          <p style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '16px' }}>{resultMsg}</p>
        )}

        <br />
        <button onClick={() => {
          setImageURL(null);
          setResultMsg('');
          onClose();
        }} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Tutup
        </button>
      </div>
    </div>
  );
}

export default VerificationModal;
