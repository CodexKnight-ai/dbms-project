'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  Trophy, 
  Settings, 
  Zap,
  ExternalLink,
  User as UserIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/app/store/useAuthStore';
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then(res => res.data);

const navItems = [
  { href: '/dashboard', label: 'Terminal', icon: LayoutDashboard },
  { href: '/sheet', label: 'The Sheet', icon: BookOpen },
  { href: '/submissions', label: 'Activity', icon: History },
  { href: '/leaderboard', label: 'Elite List', icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { data: stats } = useSWR('/stats/me', fetcher);

  const totalSolved = stats?.TOTALSOLVED ?? 0;
  const rank = stats?.CURRENTRANK;
  const cfHandle = user?.CF_Handle;

  // Progress bar: cap at some max to avoid weird 100%+ visuals
  const MAX_SOLVED = 200;
  const progressPct = Math.min(100, Math.round((totalSolved / MAX_SOLVED) * 100));

  return (
    <motion.nav 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="fixed left-6 top-6 bottom-6 w-80 flex flex-col rounded-[2.5rem] glass-panel overflow-hidden z-50"
      style={{ backgroundColor: 'rgba(5, 5, 5, 0.8)' }}
    >
      <div className="noise-overlay" />
      
      {/* Logo Section */}
      <div style={{ padding: '40px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(43,89,255,0.3)', boxShadow: '0 0 20px rgba(43,89,255,0.3)', transition: 'transform var(--transition-fast)' }} className="hover:scale-110">
            <Zap size={24} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.05em', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1, marginBottom: '4px' }}>DevProgress</h1>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Engine v4.0</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 10 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', transition: 'all var(--transition-normal)'
              }}
              className="group"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(43, 89, 255, 0.1)', border: '1px solid rgba(43, 89, 255, 0.2)', borderRadius: 'var(--radius-lg)', zIndex: -1, boxShadow: 'inset 0 0 20px rgba(43,89,255,0.1)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div style={{
                padding: '8px', borderRadius: '12px', transition: 'all var(--transition-normal)',
                backgroundColor: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                boxShadow: isActive ? '0 0 15px rgba(43,89,255,0.5)' : 'none'
              }}>
                <item.icon size={20} />
              </div>
              
              <span style={{
                fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'color var(--transition-normal)',
                color: isActive ? '#fff' : 'var(--text-muted)'
              }} className={!isActive ? "group-hover:text-[var(--text-main)]" : ""}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Stats Panel (replaces old hardcoded System Tier badge) */}
      <div style={{ padding: '28px 32px', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* User identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', border: '2px solid rgba(43,89,255,0.2)', flexShrink: 0 }}>
              {user?.FullName ? (
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.FullName}`}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <UserIcon size={16} color="var(--text-muted)" />
                </div>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.FullName || 'Anonymous'}
              </div>
              {cfHandle ? (
                <a
                  href={`https://codeforces.com/profile/${cfHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  @{cfHandle} <ExternalLink size={9} />
                </a>
              ) : (
                <span style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>No CF Handle</span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, padding: '10px 12px', backgroundColor: 'rgba(43,89,255,0.06)', borderRadius: '10px', border: '1px solid rgba(43,89,255,0.15)' }}>
              <div style={{ fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '4px' }}>Solved</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{totalSolved}</div>
            </div>
            <div style={{ flex: 1, padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '4px' }}>Rank</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{rank ? `#${rank}` : '—'}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Progress</span>
              <span style={{ fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>{progressPct}%</span>
            </div>
            <div style={{ height: '5px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, #7393ff 100%)', boxShadow: '0 0 8px rgba(43,89,255,0.5)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Footer */}
      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '16px 24px', borderRadius: 'var(--radius-lg)', backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all var(--transition-normal)'
        }} className="hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--text-main)] group">
          <Settings size={20} className="transition-transform group-hover:rotate-90 duration-500" />
          <span style={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Settings</span>
        </button>
        </Link>
      </div>
    </motion.nav>
  );
}
