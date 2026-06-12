import React from 'react';
import { TrendingUp, Users, Clock, Activity } from 'lucide-react';

export default function Analytics({ state }) {
  const avgConsultTime = () => {
    if (state.history && state.history.length > 0) {
      const avg = state.history.reduce((a, b) => a + b, 0) / state.history.length;
      return Math.round(avg * 10) / 10;
    }
    return state.avgTime || 5;
  };

  const totalWaitTimeSaved = () => {
    // Estimate: each patient saves ~15 mins of physical waiting/confusion vs paper system
    return (state.totalSeen || 0) * 15;
  };

  const efficiencyScore = () => {
    const target = state.avgTime || 5;
    const actual = avgConsultTime();
    if (actual === 0) return 100;
    const score = Math.min(100, Math.round((target / actual) * 100));
    return score;
  };

  const maxHistory = Math.max(...(state.history.length ? state.history : [1]), 1);

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: 24, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#065f46', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={24} /> Clinic Analytics
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>Real-time performance insights</p>
        </div>

        {/* Key Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #d1fae5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Users size={18} color="#059669" />
              <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>PATIENTS SEEN TODAY</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#065f46' }}>{state.totalSeen || 0}</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #d1fae5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Clock size={18} color="#059669" />
              <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>AVG CONSULT TIME</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#065f46' }}>{avgConsultTime()}<span style={{ fontSize: 18 }}>m</span></div>
          </div>
        </div>

        {/* Impact Card */}
        <div style={{ background: 'linear-gradient(135deg, #065f46, #059669)', borderRadius: 16, padding: 24, marginBottom: 20, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp size={20} />
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>PATIENT TIME SAVED TODAY</span>
          </div>
          <div style={{ fontSize: 42, fontWeight: 800 }}>{totalWaitTimeSaved()} mins</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
            vs. traditional paper token system — based on {state.totalSeen || 0} patients × 15 min saved each
          </div>
        </div>

        {/* Efficiency Score */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #d1fae5', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#065f46' }}>CLINIC EFFICIENCY SCORE</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#059669' }}>{efficiencyScore()}%</span>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <div style={{ background: '#059669', height: '100%', width: `${efficiencyScore()}%`, transition: 'width 0.5s' }}></div>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Based on actual vs. target consultation time
          </div>
        </div>

        {/* Recent Consultation Times Chart */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #d1fae5', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 16 }}>RECENT CONSULTATION TIMES</div>
          {state.history && state.history.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {state.history.map((time, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{time}m</div>
                  <div style={{
                    width: '100%',
                    background: '#059669',
                    borderRadius: '4px 4px 0 0',
                    height: `${Math.max(10, (time / maxHistory) * 90)}px`,
                    transition: 'height 0.3s'
                  }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0', fontSize: 14 }}>
              No data yet — call patients to see trends
            </div>
          )}
        </div>

        {/* Current Queue Stats */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #d1fae5' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 12 }}>CURRENT STATUS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Patients waiting</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#065f46' }}>{state.queue.length}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Estimated clear time</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#065f46' }}>{state.queue.length * avgConsultTime()}m</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}