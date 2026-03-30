'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, Lock, Mail, User, UserPlus, Code, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    CF_Handle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        FullName: formData.FullName,
        Email: formData.Email,
        Password: formData.Password,
        CF_Handle: formData.CF_Handle,
      });
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', position: 'relative', overflow: 'hidden', padding: '24px' }}>
      <div className="noise-overlay" />
      
      <div className="glow-bubble" style={{ width: '600px', height: '600px', backgroundColor: 'rgba(43, 89, 255, 0.15)', top: '-10%', left: '-10%' }} />
      <div className="glow-bubble" style={{ width: '500px', height: '500px', backgroundColor: 'rgba(147, 51, 234, 0.1)', bottom: '-10%', right: '-5%', animationDelay: '-5s' }} />

      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '48px', borderRadius: 'var(--radius-2xl)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(43, 89, 255, 0.3)', marginBottom: '24px', boxShadow: '0 0 20px rgba(43, 89, 255, 0.2)' }}>
            <UserPlus size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', fontStyle: 'italic', textTransform: 'uppercase', marginBottom: '8px' }}>
            Protocol <span style={{ color: 'var(--primary)' }}>Sync.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Join the elite community of competitive programmers.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '16px', borderRadius: 'var(--radius-md)', color: '#fb7185', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginLeft: '4px', marginBottom: '8px', display: 'block' }}>Full Identity</label>
            <div style={{ position: 'relative' }}>
              <User size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                name="FullName"
                required
                value={formData.FullName}
                onChange={handleChange}
                placeholder="Commander John Doe"
                style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'rgba(65, 105, 225, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.08)' })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)' })}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginLeft: '4px', marginBottom: '8px', display: 'block' }}>Communication Terminal</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="email"
                name="Email"
                required
                value={formData.Email}
                onChange={handleChange}
                placeholder="connect@devprogress.io"
                style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'rgba(65, 105, 225, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.08)' })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)' })}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginLeft: '4px', marginBottom: '8px', display: 'block' }}>CF Handle</label>
            <div style={{ position: 'relative' }}>
              <Code size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                name="CF_Handle"
                value={formData.CF_Handle}
                onChange={handleChange}
                placeholder="tourist"
                style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'rgba(65, 105, 225, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.08)' })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)' })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginLeft: '4px', marginBottom: '8px', display: 'block' }}>Access Key</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                name="Password"
                required
                value={formData.Password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', letterSpacing: '0.2em' }}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: 'rgba(65, 105, 225, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.08)' })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)' })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginLeft: '4px', marginBottom: '8px', display: 'block' }}>Verify Access Key</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                name="ConfirmPassword"
                required
                value={formData.ConfirmPassword}
                onChange={handleChange}
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
            style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', marginTop: '16px' }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                Initialize Profile <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Already have an authentication key?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', marginLeft: '8px' }}>
              Authorize Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
