'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/app/store/useAuthStore';
import { Loader2, Lock, Mail, ArrowRight, Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { Email: email, Password: password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAuth(response.data.user, response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', position: 'relative', overflow: 'hidden' }}>
      <div className="noise-overlay" />
      
      <div className="glow-bubble" style={{ width: '500px', height: '500px', backgroundColor: 'rgba(43, 89, 255, 0.2)', top: '-20%', left: '-10%' }} />
      <div className="glow-bubble" style={{ width: '400px', height: '400px', backgroundColor: 'rgba(147, 51, 234, 0.1)', bottom: '-10%', right: '-10%', animationDelay: '-5s' }} />

      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '48px', borderRadius: 'var(--radius-2xl)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(43, 89, 255, 0.3)', marginBottom: '24px', boxShadow: '0 0 20px rgba(43, 89, 255, 0.2)' }}>
            <Zap size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', fontStyle: 'italic', textTransform: 'uppercase', marginBottom: '8px' }}>
            Access <span style={{ background: 'linear-gradient(135deg, #fff 0%, #7393ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Granted.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Elevate your performance. Join the elite.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '16px', borderRadius: 'var(--radius-md)', color: '#fb7185', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginLeft: '4px', marginBottom: '8px', display: 'block' }}>Email Terminal</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="access@devprogress.io"
                style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'rgba(65, 105, 225, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.08)' })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)' })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginLeft: '4px', marginBottom: '8px', display: 'block' }}>Secure Key</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', letterSpacing: '0.2em' }}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'rgba(65, 105, 225, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.08)' })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)' })}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="button-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', marginTop: '8px' }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                Initialize Access <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Don't have an authentication key?{' '}
            <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', marginLeft: '8px' }}>
              Register Protocol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
