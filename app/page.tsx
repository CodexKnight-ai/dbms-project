'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, User, Zap, Target, TrendingUp, Cpu, Layers, ChevronRight, Activity, Code, Share2, Database, Terminal, Trophy, Github, Twitter, Linkedin, LogOut
} from 'lucide-react';

import { useAuthStore } from '@/app/store/useAuthStore';
import { useQuestionStore } from '@/app/store/useQuestionStore';
import { useLeaderboardStore } from '@/app/store/useLeaderboardStore';

export default function DashboardUI() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { questions, fetchQuestions, loading: qLoading } = useQuestionStore();
  const { top, fetchLeaderboard, loading: lLoading } = useLeaderboardStore();

  const tabs = ["All Problems", "Dynamic Programming", "Graphs", "Data Structures", "Math", "Strings"];
  
  const dummyCards = [
    { QUESTIONID: 101, TITLE: "Segment Trees", TAGS: "trees, advanced", RATING: 2400, SOLVEDSTATUS: 'AC' },
    { QUESTIONID: 102, TITLE: "Network Flow", TAGS: "graphs, flow", RATING: 2600, SOLVEDSTATUS: 'WA' },
    { QUESTIONID: 103, TITLE: "Combinatorics", TAGS: "math", RATING: 1800, SOLVEDSTATUS: 'AC' },
    { QUESTIONID: 104, TITLE: "String Hashing", TAGS: "strings", RATING: 2100, SOLVEDSTATUS: null },
    { QUESTIONID: 105, TITLE: "Greedy Algorithms", TAGS: "greedy", RATING: 1200, SOLVEDSTATUS: 'AC' },
    { QUESTIONID: 106, TITLE: "Suffix Automaton", TAGS: "strings, elite", RATING: 2900, SOLVEDSTATUS: null }
  ];

  const dummyTop = [
    { USERID: 1, FULLNAME: 'Alex R.', CF_HANDLE: 'tourist_lite', TOTALSOLVED: 1204, CURRENTRANK: 1 },
    { USERID: 2, FULLNAME: 'Sarah J.', CF_HANDLE: 'sarah_codes', TOTALSOLVED: 980, CURRENTRANK: 2 },
    { USERID: 3, FULLNAME: 'Michael T.', CF_HANDLE: 'mike_dev', TOTALSOLVED: 955, CURRENTRANK: 3 },
  ];

  useEffect(() => {
    fetchQuestions();
    fetchLeaderboard();
  }, [fetchQuestions, fetchLeaderboard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCommandPaletteOpen(false);
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  const displayQuestions = (questions && questions.length > 0 ? questions : dummyCards as any[]).slice(0, 6);
  const displayLeaderboard = (top && top.length > 0 ? top : dummyTop).slice(0, 3);
  
  const paletteResults = (questions && questions.length > 0 ? questions : dummyCards as any[])
    .filter(q => q.TITLE.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  return (
    <div style={{ position: 'relative' }}>
      <div className="noise-overlay"></div>

      {/* 1. STICKY TOP BAR */}
      <header className="top-bar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <nav className="nav">
          <div className="container">
            <div className="nav-inner">
              <Link href="/" className="logo">DevProgress</Link>
              <div className="nav-links">
                <Link href="/" className="nav-item">Platform</Link>
                <Link href="/leaderboard" className="nav-item">Leaderboard</Link>
                <Link href="/dashboard" className="nav-item">Analytics</Link>
              </div>
              <div className="nav-actions">
                <Link href="/login" className="nav-item">Log In</Link>
                <Link href="/register" className="button-primary" style={{ padding: '8px 20px' }}>Access Terminal</Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="container top-bar-inner">
          <div className="top-bar-right">
            <div className="search-trigger" onClick={() => setIsCommandPaletteOpen(true)}>
              <Search size={16} />
              <span style={{ paddingRight: '40px' }}>Search problems...</span>
              <kbd style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>⌘K</kbd>
            </div>
            
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Bell size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800 }}>
                    {user?.FullName?.[0] || 'U'}
                  </div>
                  <LogOut size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={handleLogout} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* 3. COMMAND PALETTE OVERLAY */}
      <div 
        className={`command-palette-overlay ${isCommandPaletteOpen ? 'open' : ''}`}
        onClick={() => setIsCommandPaletteOpen(false)}
      >
        <div 
          className="command-palette-modal glass-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="palette-input-area">
            <Search size={20} color="var(--text-muted)" />
            <input 
               type="text" 
               placeholder="Search by problem title..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               autoFocus={isCommandPaletteOpen} 
            />
          </div>
          <div className="palette-results">
            <div style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Available Problems</div>
            {paletteResults.length > 0 ? paletteResults.map((res: any, i: number) => (
              <a key={i} href={res.CF_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className="palette-row">
                <Code size={18} color="var(--primary)" />
                <div>
                  <div className="palette-row-title">{res.TITLE}</div>
                  <div className="palette-row-desc text-muted">Rating: {res.RATING} • Tags: {res.TAGS || 'general'}</div>
                </div>
              </a>
            )) : (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No problems found.</div>
            )}
          </div>
        </div>
      </div>

      <main>
        {/* 2. HERO SECTION */}
        <section className="hero-section">
          <div className="hero-bg-glows">
            <div className="glow-bubble" style={{ width: '600px', height: '600px', backgroundColor: 'rgba(43, 89, 255, 0.15)', top: '-10%', left: '-10%' }} />
            <div className="glow-bubble" style={{ width: '500px', height: '500px', backgroundColor: 'rgba(147, 51, 234, 0.1)', top: '40%', right: '-5%', animationDelay: '-5s' }} />
          </div>
          
          <div className="container hero-grid">
            <div className="hero-content animate-fade-in-up">
              <div style={{ padding: '6px 16px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', width: 'fit-content', border: '1px solid rgba(43, 89, 255, 0.3)', marginBottom: '24px' }}>
                DevProgress Engine v4.0 Live
              </div>
              <h1 className="hero-title">
                The <span>Elite</span> <br/>Workspace.
              </h1>
              <p className="hero-desc">
                High-performance tracking for the world's most disciplined competitive programmers. Synchronize your progress, analyze your speed, and dominate the ranks.
              </p>
              <div className="hero-buttons">
                {isAuthenticated ? (
                  <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <button className="button-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Access Dashboard <ChevronRight size={16} />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register" style={{ textDecoration: 'none' }}>
                      <button className="button-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Initialize Account <ChevronRight size={16} />
                      </button>
                    </Link>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                      <button className="button-outline">
                        Secure Login
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="hero-mockup-container animate-fade-in-up delay-200">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #9333ea 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                     {isAuthenticated ? (user?.FullName?.[0] || 'U') : 'GM'}
                   </div>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{isAuthenticated ? user?.FullName : 'Grandmaster User'}</div>
                     <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status: {isAuthenticated ? 'Active' : 'Offline'}</div>
                   </div>
                </div>
                <Activity color="var(--primary)" />
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Activity Sync</span>
                   <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 700 }}>100%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                   <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary)' }}></div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <Database size={20} color="var(--primary)" style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{isAuthenticated ? 'Live' : '1,234'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problems Solved</div>
                 </div>
                 <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <Target size={20} color="#16a34a" style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{isAuthenticated ? 'Tracking' : '89.2%'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accuracy Rate</div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        <section className="category-section">
          <div className="container">
            <div className="category-strip">
              {[
                { label: "All Topics", tag: "" },
                { label: "Dynamic Programming", tag: "dp" },
                { label: "Graphs", tag: "graphs" },
                { label: "Data Structures", tag: "data structures" },
                { label: "Math", tag: "math" },
                { label: "Strings", tag: "strings" }
              ].map((t, i) => (
                <a 
                  key={i}
                  href={t.tag ? `https://codeforces.com/problemset?tags=${encodeURIComponent(t.tag)}` : 'https://codeforces.com/problemset'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="category-pill"
                  style={{ textDecoration: 'none' }}
                >
                  {t.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 5. MAIN GRID SYSTEM */}
        <section className="main-section">
          <div className="container">
            <div className="main-grid">
              {displayQuestions.map((q: any, i: number) => {
                const isSolved = q.SOLVEDSTATUS === 'AC';
                const progress = isSolved ? 100 : (q.SOLVEDSTATUS ? 40 : 0);
                const tag = q.TAGS?.split(',')[0] || 'General';

                return (
                  <a href={q.CF_LINK} target="_blank" rel="noopener noreferrer" key={i} className={`card glass-panel ${i === 0 ? 'featured' : ''}`} style={{ textDecoration: 'none' }}>
                    <span className="card-tag" style={{ color: isSolved ? '#16a34a' : 'var(--primary)' }}>
                      {tag}
                    </span>
                    <div className="card-title">{q.TITLE}</div>
                    <p style={{ fontSize: '0.875rem', marginBottom: '16px', minHeight: '42px', color: 'var(--text-muted)' }}>
                      Rating: {q.RATING} | ID: {q.QUESTIONID}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status</span>
                      <span style={{ color: isSolved ? '#16a34a' : 'var(--text-main)' }}>{q.SOLVEDSTATUS || 'Unsolved'}</span>
                    </div>
                    <div className="card-progress-container">
                      <div 
                        className="card-progress-bar" 
                        style={{ 
                          width: '0%', 
                          backgroundColor: isSolved ? '#16a34a' : 'var(--primary)' 
                        }} 
                        ref={(el) => {
                          if (el) setTimeout(() => el.style.width = `${progress}%`, 300);
                        }}
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. WIDGET SECTION */}
        <section className="widget-section">
          <div className="container">
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem' }}>Leaderboard & Analytics Insights</h2>
            </div>
            <div className="widget-grid">
              
              <div className="widget-panel glass-panel">
                <div className="widget-header">
                  <span>Top Global Rank</span>
                  <Trophy size={16} color="#eab308" />
                </div>
                {lLoading ? (
                  <div style={{ marginTop: 'auto', color: 'var(--text-muted)' }}>Loading...</div>
                ) : (
                  <>
                    <div className="widget-value text-refraction">#{displayLeaderboard[0]?.CURRENTRANK || 1}</div>
                    <div style={{ fontSize: '0.875rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={14} /> {displayLeaderboard[0]?.CF_HANDLE || 'Anonymous'}
                    </div>
                  </>
                )}
              </div>
              
              <div className="widget-panel glass-panel">
                 <div className="widget-header">
                   <span>Most Problems Solved</span>
                   <Database size={16} color="var(--primary)" />
                 </div>
                 {lLoading ? (
                  <div style={{ marginTop: 'auto', color: 'var(--text-muted)' }}>Loading...</div>
                ) : (
                  <>
                    <div className="widget-value">{displayLeaderboard[0]?.TOTALSOLVED || 0}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>By Global Leader</div>
                  </>
                )}
              </div>
              
              <div className="widget-panel glass-panel">
                <div className="widget-header">
                  <span>Weekly Activity</span>
                  <Activity size={16} color="#9333ea" />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px', marginTop: 'auto' }}>
                  {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: i === 5 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', height: `${h}%`, borderRadius: '4px 4px 0 0', transition: 'all 0.3s ease' }} />
                  ))}
                </div>
              </div>
              
              <div className="widget-panel glass-panel">
                <div className="widget-header">
                  <span>System Accuracy</span>
                  <Target size={16} color="#16a34a" />
                </div>
                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto', marginTop: 'auto' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                     <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                     <circle cx="50" cy="50" r="40" stroke="var(--primary)" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.89)} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>89%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. PREMIUM/FEATURE SECTION */}
        <section className="premium-section">
          <div className="container">
            <div className="premium-block">
              <div className="media-container glass-panel">
                <div className="mockup-code" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#ec4899', marginBottom: '8px' }}>// Deep Integration Protocol</div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                     <span style={{ color: '#3b82f6' }}>import</span>
                     <span>{'{ Engine }'}</span>
                     <span style={{ color: '#3b82f6' }}>from</span>
                     <span style={{ color: '#10b981' }}>'@devprogress/core'</span>;
                  </div>
                  <div><span style={{ color: '#3b82f6' }}>const</span> sync = <span style={{ color: '#eab308' }}>await</span> Engine.connect();</div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
                     <CheckCircle size={14} /> Neural sync established.
                  </div>
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem', marginBottom: '16px' }}>Neural Sync Layer</div>
                <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Real-time Platform <br/>Integration.</h2>
                <p style={{ fontSize: '1.125rem', marginBottom: '32px', color: 'var(--text-muted)' }}>
                  Seamlessly pipe your telemetry from Codeforces, LeetCode, and AtCoder straight into our analytics engine.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { title: "Zero Data Loss", desc: "Automated historical fetching and continuous polling." },
                    { title: "Granular Metrics", desc: "Track exact submission times, penalty analysis, and logic paths." }
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Terminal size={24} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)' }}>{f.title}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="premium-block reverse">
               <div className="media-container glass-panel" style={{ background: 'linear-gradient(135deg, rgba(3,3,3,0.9) 0%, rgba(43,89,255,0.1) 100%)' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '32px', width: '100%' }}>
                   {[ Cpu, Layers, Zap, Target ].map((Icon, i) => (
                     <div key={i} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <Icon size={32} color="var(--primary)" />
                        <div style={{ height: '8px', width: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                     </div>
                   ))}
                 </div>
               </div>
               <div>
                  <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Slab Design Architecture.</h2>
                  <p style={{ fontSize: '1.125rem', marginBottom: '32px', color: 'var(--text-muted)' }}>
                    Unique prismatic glass interface built for deep focus and precision. Distraction-free tracking environment designed strictly for high-performers.
                  </p>
                  <div className="premium-actions">
                    <Link href="/register" style={{ textDecoration: 'none' }}>
                      <button className="button-primary">Initialize Sequence</button>
                    </Link>
                    <button className="button-outline" onClick={() => alert('System Alert: Documentation feature is under active development.')}>Read Documentation</button>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 8. SOCIAL PROOF */}
        <section className="social-section text-center">
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Top Performers.</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem', color: 'var(--text-muted)' }}>Compete with the highest ranking individuals worldwide.</p>
            
            <div className="social-grid" style={{ textAlign: 'left' }}>
              {displayLeaderboard.map((u: any, i: number) => (
                <div key={i} className="testimonial-card glass-panel" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}>#{u.CURRENTRANK}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800 }}>{u.FULLNAME[0] || 'U'}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.FULLNAME}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.CF_HANDLE}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                     <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Solved</div>
                     <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{u.TOTALSOLVED}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. CTA BANNER */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-container">
              <div className="glow-bubble" style={{ width: '400px', height: '400px', backgroundColor: 'rgba(43, 89, 255, 0.4)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '24px' }}>Ready to dominate?</h2>
                <p style={{ fontSize: '1.25rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', color: 'var(--text-muted)' }}>
                  Synchronize your profile now and join the ranks of the highest performing competitive programmers.
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <button className="button-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                      Proceed to Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link href="/register" style={{ textDecoration: 'none' }}>
                    <button className="button-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                      Commence Synchronization
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="logo" style={{ marginBottom: '16px' }}>DevProgress</div>
              <p className="hero-subtitle" style={{ fontSize: '0.875rem' }}>Engineered for elite competitive programmers. Scale your skills with unparalleled telemetry.</p>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Platform</div>
              <Link href="/dashboard" className="footer-link">Analytics Dashboard</Link>
              <Link href="/leaderboard" className="footer-link">Global Leaderboard</Link>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Incoming Feature: API framework.'); }} className="footer-link">API Integration</a>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Resources</div>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Incoming Feature: Docs are compiling.'); }} className="footer-link">Documentation</a>
              <Link href="/sheet" className="footer-link">Algorithm Library</Link>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('All systems operational. Zero lag detected.'); }} className="footer-link">System Status</a>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Protocol</div>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy rules enforce max isolation.'); }} className="footer-link">Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Standard operations accepted.'); }} className="footer-link">Terms of Service</a>
              <a href="mailto:support@devprogress.io" className="footer-link">Contact Elite Support</a>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>© 2026 DevProgress Engine v4.0. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Github size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
              <Twitter size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
              <Linkedin size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Temporary Lucide icon fix for hydration
const CheckCircle = ({ size, color }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
