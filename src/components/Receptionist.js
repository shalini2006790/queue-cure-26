import React, { useState } from 'react';
import { UserPlus, PhoneCall, Trash2, RotateCcw, Clock } from 'lucide-react';

export default function Receptionist({ state, socket }) {
  const [name, setName] = useState('');
  const [avgTime, setAvgTime] = useState(state.avgTime || 5);

  const addPatient = () => {
    if (!name.trim()) return;
    socket.emit('add_patient', name.trim());
    setName('');
  };

  const callNext = () => {
    socket.emit('call_next', avgTime);
  };

  const removePatient = (index) => {
    socket.emit('remove_patient', index);
  };

  const resetQueue = () => {
    if (window.confirm('Reset entire queue?')) {
      socket.emit('reset_queue');
    }
  };

  const updateAvgTime = (val) => {
    setAvgTime(val);
    socket.emit('update_avg_time', val);
  };

  const smartWait = () => {
    if (state.history && state.history.length > 0) {
      const avg = state.history.reduce((a, b) => a + b, 0) / state.history.length;
      return Math.round(avg * 10) / 10;
    }
    return avgTime;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '24px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#065f46', margin: 0 }}>
              Queue Cure
            </h1>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>Receptionist Dashboard</p>
          </div>
          <button onClick={resetQueue} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #d1fae5', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{state.queue.length}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Waiting</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #d1fae5', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{state.totalSeen || 0}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Seen today</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #d1fae5', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{smartWait()}m</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Avg time</div>
          </div>
        </div>

        {/* Current Token */}
        {state.currentToken && (
          <div style={{ background: '#059669', color: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Now seeing</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>#{String(state.currentToken).padStart(3, '0')} — {state.currentName}</div>
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, opacity: 0.3 }}>#{String(state.currentToken).padStart(3, '0')}</div>
          </div>
        )}

        {/* Add Patient */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #d1fae5', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 12 }}>ADD PATIENT</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPatient()}
              placeholder="Patient name..."
              style={{ flex: 1, padding: '10px 14px', border: '1px solid #d1fae5', borderRadius: 8, fontSize: 14, outline: 'none' }}
            />
            <button onClick={addPatient} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              <UserPlus size={16} /> Add
            </button>
          </div>

          {/* Avg Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <Clock size={14} color="#6b7280" />
            <span style={{ fontSize: 13, color: '#6b7280' }}>Avg consultation time:</span>
            <input
              type="number"
              value={avgTime}
              min={1} max={60}
              onChange={e => updateAvgTime(Number(e.target.value))}
              style={{ width: 60, padding: '4px 8px', border: '1px solid #d1fae5', borderRadius: 6, fontSize: 14, textAlign: 'center' }}
            />
            <span style={{ fontSize: 13, color: '#6b7280' }}>mins</span>
          </div>
        </div>

        {/* Call Next Button */}
        <button
          onClick={callNext}
          disabled={state.queue.length === 0}
          style={{ width: '100%', padding: '14px', background: state.queue.length === 0 ? '#d1fae5' : '#065f46', color: state.queue.length === 0 ? '#6b7280' : '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: state.queue.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          <PhoneCall size={18} /> Call Next Patient
        </button>

        {/* Queue List */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #d1fae5' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 12 }}>QUEUE ({state.queue.length})</div>
          {state.queue.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0', fontSize: 14 }}>No patients in queue</div>
          ) : (
            state.queue.map((p, i) => (
              <div key={p.token} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < state.queue.length - 1 ? '1px solid #f0fdf4' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#065f46' }}>
                  #{String(p.token).padStart(3, '0').slice(-3)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{i === 0 ? 'Next up' : `${i} ahead • ~${(i + 1) * smartWait()}m wait`}</div>
                </div>
                <button onClick={() => removePatient(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}