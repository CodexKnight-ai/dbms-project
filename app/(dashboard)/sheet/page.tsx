'use client';

import { useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import { useQuestionStore } from '@/app/store/useQuestionStore';
import { Search, Loader2, ChevronRight, Filter, Zap, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function SheetPage() {
  const { questions, loading, filters, setFilters, fetchQuestions } = useQuestionStore();

  useEffect(() => {
    fetchQuestions(filters);
  }, [filters, fetchQuestions]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '80px', animation: 'fadeInUp 0.7s ease-out' }}>
      
      {/* Immersive Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{ position: 'relative', padding: '64px', borderRadius: '48px', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(43,89,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--primary)' }}>Strategic Protocol Alpha</span>
          </motion.div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 0.9, color: 'var(--text-main)', margin: 0 }}>
            The <span style={{ color: '#fff', textShadow: '0 0 20px rgba(43,89,255,0.6)' }}>Sheet.</span>
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontWeight: 500, maxWidth: '600px', fontSize: '1.125rem', margin: 0 }}>
            The ultimate curation of competitive programming challenges. 
            Synchronize your brain with the engine.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Total Intel</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{questions.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', backgroundColor: 'rgba(43,89,255,0.05)', border: '1px solid rgba(43,89,255,0.2)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>Sync Status</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>UPLINK ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Floating Geometric Orbs Overlay */}
        <div style={{ position: 'absolute', top: '40px', right: '40px', opacity: 0.1, pointerEvents: 'none' }}>
           <LayoutGrid size={240} color="var(--text-main)" />
        </div>
      </motion.div>

      {/* Advanced Control HUD */}
      <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-end', padding: '32px', borderRadius: '32px', position: 'relative' }}>
        
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)', marginLeft: '8px' }}>Search Logic (Tags)</label>
          <div style={{ position: 'relative' }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="tag"
              placeholder="Query tags (e.g. dp, math)..."
              style={{ width: '100%', padding: '20px 20px 20px 56px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600, outline: 'none', transition: 'all 0.2s' }}
              value={filters.tag}
              onChange={handleFilterChange}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(43,89,255,0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
            />
          </div>
        </div>

        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)', marginLeft: '8px' }}>Intensity Tier</label>
          <div style={{ position: 'relative' }}>
            <Filter size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
            <select
              name="rating"
              style={{ width: '100%', padding: '20px 48px 20px 52px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 700, outline: 'none', appearance: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              value={filters.rating}
              onChange={handleFilterChange}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(43,89,255,0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <option value="" style={{ color: '#000' }}>ALL RATINGS</option>
              <option value="800" style={{ color: '#000' }}>800+</option>
              <option value="1200" style={{ color: '#000' }}>1200+</option>
              <option value="1600" style={{ color: '#000' }}>1600+</option>
              <option value="2000" style={{ color: '#000' }}>2000+</option>
              <option value="2400" style={{ color: '#000' }}>2400+</option>
            </select>
            <ChevronRight size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none' }} />
          </div>
        </div>

        <button 
          onClick={() => fetchQuestions(filters)}
          style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(43,89,255,0.3)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
        >
          <Zap size={24} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: '32px' }}>
          <Loader2 size={64} color="var(--primary)" className="animate-spin" />
          <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', color: 'var(--primary)' }}>Syncing Codeforces API...</span>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
          <AnimatePresence mode="popLayout">
            {questions.map((q) => (
              <motion.div
                key={q.QUESTIONID}
                variants={item}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <QuestionCard question={q} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && questions.length === 0 && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', borderRadius: '64px', borderStyle: 'dashed' }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', fontStyle: 'italic', margin: 0 }}>No transmission matches found.</p>
        </div>
      )}
    </div>
  );
}
