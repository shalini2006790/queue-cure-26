import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCheckin({ socket }) {
  const [qrImage, setQrImage] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const checkinUrl = `${window.location.origin}/checkin`;

  useEffect(() => {
    QRCode.toDataURL(checkinUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#065f46', light: '#ffffff' }
    }).then(url => setQrImage(url));
  }, []);

  const handleCheckin = () => {
    if (!name.trim()) return;
    socket.emit('add_patient', name.trim());
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'sans-serif' }}>

      {!submitted ? (
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 380, width: '100%', border: '1px solid #d1fae5', textAlign: 'center' }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#065f46', margin: 0 }}>
              Queue Cure Clinic
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '6px 0 0' }}>
              Self Check-in
            </p>
          </div>

          {/* QR Code */}
          <div style={{ background: '#f0fdf4', borderRadius: 16, padding: 16, marginBottom: 24, display: 'inline-block' }}>
            {qrImage && <img src={qrImage} alt="QR Code" style={{ width: 160, height: 160 }} />}
          </div>

          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
            Scan QR or enter your name below to get your token
          </p>

          {/* Name Input */}
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheckin()}
            placeholder="Enter your name..."
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1fae5', borderRadius: 10, fontSize: 15, outline: 'none', marginBottom: 12, textAlign: 'center' }}
          />

          <button
            onClick={handleCheckin}
            style={{ width: '100%', padding: '12px', background: '#065f46', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Get My Token
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 380, width: '100%', border: '1px solid #d1fae5', textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#065f46', margin: '0 0 8px' }}>
            You're in the queue!
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 24px' }}>
            Welcome, <strong>{name}</strong>!<br />
            Please watch the screen for your token number.
          </p>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Your name</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#065f46' }}>{name}</div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setName(''); }}
            style={{ width: '100%', padding: '12px', background: '#f0fdf4', color: '#065f46', border: '1px solid #d1fae5', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Check in another patient
          </button>
        </div>
      )}
    </div>
  );
}