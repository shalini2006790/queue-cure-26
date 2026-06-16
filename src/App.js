import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Receptionist from './components/Receptionist';
import Patient from './components/Patient';
import QRCheckin from './components/QRCheckin';
import Analytics from './components/Analytics';

const socket = io(window.location.origin, {
  transports: ['websocket', 'polling']
});

export default function App() {
  const [state, setState] = useState({
    queue: [],
    currentToken: null,
    currentName: null,
    tokenCounter: 1,
    avgTime: 5,
    history: [],
    totalSeen: 0
  });

  const [view, setView] = useState('receptionist');
  const [connected, setConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const prevToken = useRef(null);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.6);
    } catch(e) {}
  };

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('state_update', (newState) => setState(newState));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('state_update');
    };
  }, []);

  useEffect(() => {
    if (soundEnabled && state.currentToken && state.currentToken !== prevToken.current) {
      playChime();
    }
    prevToken.current = state.currentToken;
  }, [state.currentToken, soundEnabled]);

  return (
    <div>
      {/* Top Navigation */}
      <div style={{ background: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setView('receptionist')}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: view === 'receptionist' ? '#ffffff' : 'transparent', color: view === 'receptionist' ? '#065f46' : '#ffffff' }}>
            Receptionist
          </button>
          <button
            onClick={() => setView('patient')}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: view === 'patient' ? '#ffffff' : 'transparent', color: view === 'patient' ? '#065f46' : '#ffffff' }}>
            Patient View
          </button>
          <button
            onClick={() => setView('checkin')}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: view === 'checkin' ? '#ffffff' : 'transparent', color: view === 'checkin' ? '#065f46' : '#ffffff' }}>
            QR Check-in
          </button>
        </div>
        <button
            onClick={() => setView('analytics')}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: view === 'analytics' ? '#ffffff' : 'transparent', color: view === 'analytics' ? '#065f46' : '#ffffff' }}>
            Analytics
          </button>

        {/* Right side — sound + connection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => { setSoundEnabled(s => !s); if (!soundEnabled) playChime(); }}
            style={{ padding: '5px 12px', background: soundEnabled ? '#10b981' : 'transparent', color: '#fff', border: '1px solid #10b981', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
            {soundEnabled ? '🔔 Sound ON' : '🔕 Sound OFF'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#10b981' : '#ef4444' }}></div>
            <span style={{ color: '#ffffff', fontSize: 12 }}>{connected ? 'Live' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      {/* Views */}
      {view === 'receptionist' && <Receptionist state={state} socket={socket} />}
      {view === 'patient' && <Patient state={state} />}
      {view === 'checkin' && <QRCheckin socket={socket} />}
      {view === 'analytics' && <Analytics state={state} />}
    </div>
  );
}