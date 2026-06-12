import React, { useEffect, useState } from 'react';
import { Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

const translations = {
  english: {
    clinicName: 'QUEUE CURE CLINIC',
    liveDisplay: 'Live Token Display',
    nowServing: 'NOW SERVING',
    ahead: 'Ahead',
    estWait: 'Est. Wait',
    seenToday: 'Seen Today',
    upNext: 'UP NEXT',
    noPatients: 'No patients waiting',
    minWait: 'min wait',
    liveUpdates: 'Live updates • No refresh needed',
  },
  hindi: {
    clinicName: 'क्यू क्योर क्लिनिक',
    liveDisplay: 'लाइव टोकन डिस्प्ले',
    nowServing: 'अभी सेवा में',
    ahead: 'आगे',
    estWait: 'अनुमानित प्रतीक्षा',
    seenToday: 'आज देखे गए',
    upNext: 'अगले',
    noPatients: 'कोई मरीज़ नहीं',
    minWait: 'मिनट प्रतीक्षा',
    liveUpdates: 'लाइव अपडेट • रिफ्रेश की जरूरत नहीं',
  },
  tamil: {
    clinicName: 'க்யூ க்யூர் கிளினிக்',
    liveDisplay: 'நேரடி டோக்கன் காட்சி',
    nowServing: 'இப்போது சேவையில்',
    ahead: 'முன்னால்',
    estWait: 'மதிப்பிடப்பட்ட காத்திருப்பு',
    seenToday: 'இன்று பார்த்தவர்கள்',
    upNext: 'அடுத்தது',
    noPatients: 'நோயாளிகள் இல்லை',
    minWait: 'நிமிட காத்திருப்பு',
    liveUpdates: 'நேரடி புதுப்பிப்புகள் • புதுப்பிக்க தேவையில்லை',
  }
};

export default function Patient({ state }) {
  const [blink, setBlink] = useState(true);
  const [lang, setLang] = useState('english');
  const t = translations[lang];

  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 1000);
    return () => clearInterval(interval);
  }, []);

  const smartWait = () => {
    if (state.history && state.history.length > 0) {
      const avg = state.history.reduce((a, b) => a + b, 0) / state.history.length;
      return Math.round(avg * 10) / 10;
    }
    return state.avgTime || 5;
  };

  const totalWait = state.queue.length * smartWait();

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'sans-serif' }}>

      {/* Language Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['english', 'hindi', 'tamil'].map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: lang === l ? '#10b981' : '#1e293b', color: lang === l ? '#fff' : '#94a3b8', textTransform: 'capitalize' }}>
            {l === 'english' ? '🇬🇧 English' : l === 'hindi' ? '🇮🇳 Hindi' : '🇮🇳 Tamil'}
          </button>
        ))}
      </div>

      {/* Clinic Name */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: 1 }}>
          {t.clinicName}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '6px 0 0' }}>{t.liveDisplay}</p>
      </div>

      {/* Now Serving */}
      <div style={{ background: '#1e293b', borderRadius: 24, padding: '40px 60px', marginBottom: 32, textAlign: 'center', border: '1px solid #334155', width: '100%', maxWidth: 500 }}>
        <div style={{ fontSize: 13, color: '#94a3b8', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
          {t.nowServing}
        </div>
        {state.currentToken ? (
          <>
            <div style={{ fontSize: 100, fontWeight: 900, color: '#10b981', lineHeight: 1, letterSpacing: -4, opacity: blink ? 1 : 0.85, transition: 'opacity 0.3s' }}>
              #{String(state.currentToken).padStart(3, '0')}
            </div>
            <div style={{ fontSize: 20, color: '#ffffff', marginTop: 8, fontWeight: 500 }}>
              {state.currentName}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 48, fontWeight: 700, color: '#475569' }}>—</div>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, width: '100%', maxWidth: 500, marginBottom: 32 }}>
        <div style={{ background: '#1e293b', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #334155' }}>
          <Users size={20} color="#10b981" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ffffff' }}>{state.queue.length}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{t.ahead}</div>
        </div>
        <div style={{ background: '#1e293b', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #334155' }}>
          <Clock size={20} color="#10b981" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ffffff' }}>{totalWait}m</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{t.estWait}</div>
        </div>
        <div style={{ background: '#1e293b', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #334155' }}>
          <CheckCircle size={20} color="#10b981" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ffffff' }}>{state.totalSeen || 0}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{t.seenToday}</div>
        </div>
      </div>

      {/* Queue Preview */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 20, width: '100%', maxWidth: 500, border: '1px solid #334155', marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', letterSpacing: 2, marginBottom: 12 }}>{t.upNext}</div>
        {state.queue.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#475569', padding: '16px 0', fontSize: 14 }}>
            {t.noPatients}
          </div>
        ) : (
          state.queue.slice(0, 5).map((p, i) => (
            <div key={p.token} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < Math.min(state.queue.length, 5) - 1 ? '1px solid #334155' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? '#10b981' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? '#fff' : '#94a3b8' }}>
                #{String(p.token).padStart(3, '0').slice(-3)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: '#ffffff' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>~{(i + 1) * smartWait()} {t.minWait}</div>
              </div>
              {i === 0 && <AlertCircle size={16} color="#f59e0b" />}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ color: '#475569', fontSize: 12 }}>
        {t.liveUpdates}
      </div>

    </div>
  );
}