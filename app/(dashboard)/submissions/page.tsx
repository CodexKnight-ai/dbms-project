'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Code2, Clock, Zap, Activity, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

interface Submission {
  SUBMISSIONID: number;
  USERID: number;
  QUESTIONID: number;
  VERDICTID: number;
  VERDICTNAME: string;
  SUBMITTEDCODE: string;
  SUBMITTEDAT: string;
  TITLE: string;
  FULLNAME: string;
  CF_HANDLE: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      try {
        const res = await api.get('/submissions/all');
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSubmissions();
  }, []);

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'AC': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', glow: '0 0 20px rgba(16, 185, 129, 0.2)' };
      case 'WA': return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', glow: '0 0 20px rgba(244, 63, 94, 0.2)' };
      default: return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', glow: 'none' };
    }
  };

  return (
    <div style={{ paddingBottom: '80px', animation: 'fadeInUp 0.7s ease-out' }}>
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '48px', marginBottom: '64px' }}
      >
        <div style={{ display: 'inline-block', width: 'fit-content', padding: '8px 16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(43,89,255,0.3)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Live Uplink
        </div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 0.9, margin: 0 }}>
          Collective <span style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 0 20px rgba(43,89,255,0.4)' }}>Transmission.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 500, margin: 0 }}>Real-time submission telemetry from the global elite community.</p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: '24px' }}>
          <Loader2 size={64} color="var(--primary)" className="animate-spin" />
          <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', color: 'var(--primary)' }}>Scanning Data Packets...</span>
        </div>
      ) : (
        <div className="glass-panel" style={{ borderRadius: '48px', overflow: 'hidden', padding: '1px' }}>
          <div style={{ overflowX: 'auto', backgroundColor: 'rgba(5,5,5,0.6)', borderRadius: '47px' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Source Identity</th>
                  <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Encrypted Intel</th>
                  <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Packet Verdict</th>
                  <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Code Hash</th>
                  <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Timestamp</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={container}
                initial="hidden"
                animate="show"
              >
                {submissions.map((s) => (
                  <motion.tr 
                    key={s.SUBMISSIONID} 
                    variants={item}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '32px 40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <UserIcon size={16} color="var(--text-muted)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{s.FULLNAME}</span>
                          {s.CF_HANDLE ? (
                            <a href={`https://codeforces.com/profile/${s.CF_HANDLE}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>@ {s.CF_HANDLE}</a>
                          ) : (
                            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No Handle</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '32px 40px' }}>
                      <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                        {s.TITLE}
                      </div>
                    </td>
                    <td style={{ padding: '32px 40px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', borderRadius: '9999px', padding: '8px 20px', fontSize: '0.5625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', ...getVerdictStyle(s.VERDICTNAME) }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: `0 0 10px currentColor` }} />
                        {s.VERDICTNAME}
                      </span>
                    </td>
                    <td style={{ padding: '32px 40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
                        <Code2 size={16} color="rgba(43,89,255,0.5)" />
                        <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '-0.05em', fontSize: '0.6875rem', fontWeight: 700 }}>HEX: {s.SUBMITTEDCODE.slice(0, 10)}...</span>
                      </div>
                    </td>
                    <td style={{ padding: '32px 40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                            <Clock size={16} opacity={0.3} />
                            {new Date(s.SUBMITTEDAT).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && submissions.length === 0 && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', borderRadius: '64px', borderStyle: 'dashed', gap: '24px' }}>
          <Activity size={48} color="rgba(255,255,255,0.1)" />
          <p style={{ color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', fontStyle: 'italic', margin: 0 }}>No active packet transmissions detected.</p>
        </div>
      )}
    </div>
  );
}
