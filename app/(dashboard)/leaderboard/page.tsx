'use client';

import { useEffect } from 'react';
import { useLeaderboardStore } from '@/app/store/useLeaderboardStore';
import { Trophy, Medal, Loader2, Target, Award } from 'lucide-react';
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

export default function LeaderboardPage() {
  const { top, user, loading, fetchLeaderboard } = useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div style={{ paddingBottom: '80px', animation: 'fadeInUp 0.7s ease-out', maxWidth: '1024px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '48px', marginBottom: '48px' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', padding: '8px 16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(43,89,255,0.3)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Trophy size={14} /> Global Leaderboard
        </div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 0.9, margin: 0 }}>
          Top <span style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 0 20px rgba(43,89,255,0.4)' }}>Performers.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 500, margin: 0 }}>The absolute highest ranking individuals within the DevProgress ecosystem.</p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: '24px' }}>
          <Loader2 size={64} color="var(--primary)" className="animate-spin" />
          <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', color: 'var(--primary)' }}>Aggregating Ranks...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* Pinned User Stats */}
          {user && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel" 
              style={{ padding: '32px', borderRadius: '32px', backgroundColor: 'rgba(43,89,255,0.05)', border: '1px solid rgba(43,89,255,0.2)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', right: '-32px', top: '-64px', opacity: 0.05 }}>
                 <Award size={256} color="var(--primary)" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'var(--primary)', boxShadow: '0 0 30px rgba(43,89,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={32} color="white" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)' }}>Your Active Standing</span>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>{user.FULLNAME}</h3>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Global Rank</span>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>#{user.CURRENTRANK || 'N/A'}</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid rgba(43,89,255,0.1)', paddingTop: '24px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Total Solved</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{user.TOTALSOLVED} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Problems</span></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>CF Handle</span>
                    {user.CF_HANDLE ? (
                      <a href={`https://codeforces.com/profile/${user.CF_HANDLE}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-main)')}>@{user.CF_HANDLE}</a>
                    ) : (
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-muted)' }}>None</span>
                    )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Leaderboard Table */}
          <div className="glass-panel" style={{ borderRadius: '48px', overflow: 'hidden', padding: '1px' }}>
            <div style={{ overflowX: 'auto', backgroundColor: 'rgba(5,5,5,0.6)', borderRadius: '47px' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                  <tr>
                    <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Standing</th>
                    <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Identity</th>
                    <th style={{ padding: '32px 40px', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', textAlign: 'right' }}>Problems Solved</th>
                  </tr>
                </thead>
                <motion.tbody 
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {top.map((usr: any, idx: number) => {
                    const isSelf = usr.USERID === user?.USERID;
                    return (
                      <motion.tr 
                        key={usr.USERID} 
                        variants={item}
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.02)', 
                          transition: 'all 0.2s',
                          backgroundColor: isSelf ? 'rgba(43,89,255,0.05)' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelf) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelf) e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <td style={{ padding: '32px 40px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {idx === 0 && <Medal size={28} color="#eab308" style={{ filter: 'drop-shadow(0 0 10px rgba(234,179,8,0.5))' }} />}
                            {idx === 1 && <Medal size={28} color="#94a3b8" />}
                            {idx === 2 && <Medal size={28} color="#b45309" />}
                            {idx > 2 && <div style={{ width: '28px' }} />}
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: idx < 3 ? 'var(--text-main)' : 'var(--text-muted)', letterSpacing: '-0.05em' }}>
                              #{idx + 1}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '32px 40px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 900, color: isSelf ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {usr.FULLNAME}
                              {isSelf && <span style={{ fontSize: '0.5rem', padding: '4px 8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', letterSpacing: '0.2em' }}>YOU</span>}
                            </span>
                            {usr.CF_HANDLE ? (
                              <a href={`https://codeforces.com/profile/${usr.CF_HANDLE}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>@ {usr.CF_HANDLE}</a>
                            ) : (
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No Handle</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '32px 40px', textAlign: 'right' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 24px', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {usr.TOTALSOLVED}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
