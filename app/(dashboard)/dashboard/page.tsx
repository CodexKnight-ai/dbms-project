'use client';

import { useAuthStore } from '@/app/store/useAuthStore';
import Link from 'next/link';
import { 
  Trophy, 
  Target, 
  CheckCircle, 
  Calendar,
  MessageSquare,
  ChevronRight,
  User as UserIcon,
  Activity,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function DashboardPage() {
  const { user } = useAuthStore();
  // Correct endpoint: /stats/me returns TOTALSOLVED, CURRENTRANK, TOTALSUBMISSIONS (uppercase)
  const { data: stats } = useSWR('/stats/me', fetcher);
  // Fetch questions for daily objectives; API returns uppercase fields
  const { data: objectives, isLoading: objectivesLoading } = useSWR('/questions', fetcher);

  const totalSolved = stats?.TOTALSOLVED ?? 0;
  const currentRank = stats?.CURRENTRANK;
  const totalSubmissions = stats?.TOTALSUBMISSIONS ?? 0;

  const statCards = [
    { label: 'Total Solved', value: totalSolved, icon: CheckCircle, color: '#16a34a', bg: 'rgba(22, 163, 74, 0.15)' },
    { label: 'Current Rank', value: currentRank ? `#${currentRank}` : 'Unranked', icon: Trophy, color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
    { label: 'Submissions', value: totalSubmissions, icon: Activity, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
    { label: 'Problems Available', value: Array.isArray(objectives) ? objectives.length : '—', icon: MessageSquare, color: 'var(--primary)', bg: 'var(--primary-light)' },
  ];

  // daily objectives: first 3 questions from the DB
  const dailyList: any[] = Array.isArray(objectives) ? objectives.slice(0, 3) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '40px', animation: 'fadeInUp 0.7s ease-out' }}>
      
      {/* Header Sync Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 900, fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px', marginLeft: '4px' }}>
            <Calendar size={12} />
            Last Updated Today
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px', color: 'var(--text-main)' }}>
            Welcome back, {user?.FullName?.split(' ')[0] || 'Commander'}!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.125rem', maxWidth: '600px', lineHeight: 1.6 }}>
            {totalSolved > 0
              ? <>You've solved <span style={{ color: 'var(--text-main)', textDecoration: 'underline', textDecorationColor: 'rgba(43,89,255,0.4)', textUnderlineOffset: '4px', textDecorationThickness: '2px' }}>{totalSolved} problems</span> in total. Keep the momentum going!</>
              : 'Start solving problems to track your progress here.'}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[1, 2, 3, 4].map(i => (
            <img 
              key={i} 
              style={{ display: 'inline-block', height: '48px', width: '48px', borderRadius: '16px', border: '4px solid var(--bg-color)', marginLeft: i > 1 ? '-12px' : 0, position: 'relative', zIndex: 10 - i }}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} 
              alt="Friend"
            />
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', width: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '4px solid var(--bg-color)', marginLeft: '-12px', zIndex: 5, fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            +18
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ position: 'relative', borderRadius: 'var(--radius-2xl)', padding: '32px', transition: 'all var(--transition-normal)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = stat.color; e.currentTarget.style.boxShadow = `0 10px 30px -10px ${stat.color}40`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div style={{ marginBottom: '16px', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
            <div style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Objectives & Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Daily Objectives */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-2xl)', background: 'linear-gradient(135deg, rgba(43,89,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', padding: '1px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(32px)', borderRadius: 'calc(var(--radius-2xl) - 1px)', padding: '40px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'var(--primary)', color: 'white', boxShadow: '0 0 20px rgba(43,89,255,0.3)' }}>
                  <Target size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>Daily Objective</h3>
              </div>
              <Link href="/sheet" style={{ textDecoration: 'none' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  View All <ChevronRight size={12} />
                </button>
              </Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {objectivesLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', color: 'var(--text-muted)' }}>
                  <Loader2 size={20} className="animate-spin" color="var(--primary)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading challenges...</span>
                </div>
              ) : dailyList.length === 0 ? (
                <div style={{ padding: '24px', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600 }}>No questions found. Ask admin to add some!</div>
              ) : (
                dailyList.map((q: any, i: number) => {
                  // Questions from API have uppercase field names
                  const cfLink = q.CF_LINK || q.CF_Link || '#';
                  const tags = (q.TAGS || q.Tags || '').split(',').filter(Boolean);
                  return (
                    <a
                      key={q.QUESTIONID || i}
                      href={cfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        className="glass-panel"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(43,89,255,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--surface-color)'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ height: '16px', width: '16px', borderRadius: '50%', border: '2px solid rgba(43,89,255,0.4)', flexShrink: 0 }} />
                          <div>
                            <h4 style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '8px' }}>{q.TITLE || q.Title || 'Untitled'}</h4>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {tags.slice(0, 3).map((t: string) => (
                                <span key={t} style={{ fontSize: '0.5625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: 'var(--text-muted)' }}>{t.trim()}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>{q.RATING || q.Rating || '?'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.5625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
                            <ExternalLink size={10} />
                            CF
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Profile Snapshot Section */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-2xl)', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <UserIcon size={256} color="rgba(255,255,255,0.02)" style={{ position: 'absolute', right: '-64px', top: '-64px' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '24px' }}>Profile Snapshot</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName}`} 
                style={{ width: '80px', height: '80px', borderRadius: '24px', border: '4px solid rgba(43,89,255,0.1)' }}
                alt="Profile" 
              />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{user?.FullName || 'Anonymous User'}</div>
                {user?.CF_Handle ? (
                  <a
                    href={`https://codeforces.com/profile/${user.CF_Handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    @{user.CF_Handle} <ExternalLink size={11} />
                  </a>
                ) : (
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>No CF handle</div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-color)' }}>
                 <Activity size={16} color="var(--primary)" style={{ marginBottom: '8px' }} />
                 <div style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Global Rank</div>
                 <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{currentRank ? `#${currentRank}` : '—'}</div>
              </div>
            </div>
          </div>
          
          <Link href="/profile" style={{ position: 'relative', zIndex: 10, width: '100%', textDecoration: 'none' }}>
            <button className="button-primary" style={{ width: '100%', padding: '20px', borderRadius: '16px' }}>
              View Full Profile
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
