import React, { useEffect, useState } from 'react';

function RealTimeDisplay(){
      const [time, setTime] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('✅ Terhubung ke WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.time) {
          setTime(data.time);
        }
      } catch (error) {
        console.error('❌ Gagal parse data:', error);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket ditutup');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
    }, []);
    return(
    <div className="jam">
        <h2>{time || 'Menunggu data waktu...'} WIB</h2>
    </div>
    );
}

export default RealTimeDisplay;