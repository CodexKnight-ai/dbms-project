'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Loader2, 
  MessageCircle, 
  Lightbulb, 
  Code2, 
  StickyNote,
  ChevronRight,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import DiscussionModal from './shared/DiscussionModal';
import QuestionNotesModal from './shared/NotesModal';
import api from '@/lib/api';

export default function QuestionCard({ question }: { question: any }) {
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(question.SolvedStatus || null);
  const [error, setError] = useState<string | null>(null);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getStatusStyles = () => {
    if (verdict === 'AC') return 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-[0_0_50px_rgba(16,185,129,0.1)]';
    if (verdict) return 'border-rose-500/40 bg-rose-500/[0.03] shadow-[0_0_50px_rgba(244,63,94,0.1)]';
    return 'glass-card border-white/5';
  };

  const tags = question.Tags?.split(',') || [];

  const handleCheckSubmission = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/submissions/verify', { QuestionID: question.QuestionID, CF_Link: question.CF_Link });
      setVerdict(res.data.verdict);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const cfLink = question.CF_Link || '#';
  const hasHint = !!question.Hint;
  const hasSolution = !!question.Solution;

  const actions = [
    { icon: MessageCircle, label: 'COMMS', onClick: () => setIsDiscussionOpen(true), active: true },
    { 
      icon: Lightbulb, 
      label: 'INTEL', 
      onClick: () => setShowHint(v => !v), 
      active: hasHint,
      toggled: showHint,
    },
    { 
      icon: Code2, 
      label: 'SRC', 
      onClick: () => setShowSolution(v => !v), 
      active: hasSolution,
      toggled: showSolution,
    },
    { icon: StickyNote, label: 'LOGS', onClick: () => setIsNotesOpen(true), active: true },
  ];

  return (
    <>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`group relative flex flex-col gap-6 rounded-[3rem] border p-10 transition-all duration-700 noise-grain ${getStatusStyles()}`}
      >
        {/* Prismatic Border Overlay */}
        <div className="absolute inset-0 prismatic-border -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div style={{ transform: "translateZ(50px)" }} className="flex-1 space-y-6">
          <div className="flex items-center gap-5">
            {/* Title links to Codeforces */}
            <a
              href={cfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/title"
              style={{ textDecoration: 'none' }}
            >
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none group-hover/title:text-[#2B59FF] transition-colors duration-200">
                {question.Title || 'Untracked Task'}
              </h3>
            </a>
            {question.IsVerified && (
              <div className="royal-pill !bg-[#2B59FF]/20 !px-2 !py-2 shrink-0">
                <ShieldCheck className="h-4 w-4 text-[#2B59FF]" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
             <div className="glass-impact px-5 py-2 rounded-2xl border-white/10 text-white font-black text-xs tracking-widest backdrop-blur-3xl shadow-2xl skew-x-[-12deg]">
               <span className="skew-x-[12deg] inline-block">{question.Rating || 'UNRATED'}</span>
             </div>
            {tags.map((tag: string) => (
              <span key={tag} className="text-[10px] font-black text-zinc-600 bg-white/[0.02] px-4 py-2 rounded-2xl border border-white/5 group-hover:border-[#2B59FF]/30 group-hover:text-zinc-300 transition-all uppercase tracking-[0.2em] backdrop-blur-md">
                {tag.trim()}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-10 pt-6 border-t border-white/5">
            {actions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: action.active ? 1.1 : 1, y: action.active ? -2 : 0 }}
                onClick={action.active ? action.onClick : undefined}
                title={
                  !action.active
                    ? action.label === 'INTEL' ? 'No hint available' : 'No solution available'
                    : undefined
                }
                className={`flex items-center gap-3 text-[10px] font-black transition-all group/btn uppercase tracking-[0.2em] ${
                  action.active
                    ? action.toggled
                      ? 'text-[#2B59FF] cursor-pointer'
                      : 'text-zinc-500 hover:text-[#2B59FF] cursor-pointer'
                    : 'text-zinc-700 cursor-not-allowed opacity-50'
                }`}
              >
                <div className={`p-3 rounded-2xl border transition-all shadow-inner ${
                  action.toggled
                    ? 'bg-[#2B59FF]/10 border-[#2B59FF]/40'
                    : 'bg-white/[0.02] border-white/5 group-hover/btn:border-[#2B59FF]/40 group-hover/btn:bg-[#2B59FF]/10'
                }`}>
                  <action.icon className="h-4 w-4" />
                </div>
                {action.label}
                {(action.label === 'INTEL' || action.label === 'SRC') && action.active && (
                  action.toggled ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Hint Panel */}
          <AnimatePresence>
            {showHint && hasHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(251,191,36,0.05)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    marginTop: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Lightbulb size={14} color="#fbbf24" />
                    <span style={{ fontSize: '0.5625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fbbf24' }}>Intel / Hint</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                    {question.Hint}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solution Panel */}
          <AnimatePresence>
            {showSolution && hasSolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  style={{
                    borderRadius: '20px',
                    backgroundColor: 'rgba(43,89,255,0.04)',
                    border: '1px solid rgba(43,89,255,0.15)',
                    marginTop: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(43,89,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Code2 size={14} color="#2B59FF" />
                      <span style={{ fontSize: '0.5625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2B59FF' }}>Reference Solution</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(43,89,255,0.4)' }} />
                    </div>
                  </div>
                  <pre style={{ padding: '20px 24px', fontSize: '0.8125rem', color: '#a8b4ff', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", overflowX: 'auto', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {question.Solution}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ transform: "translateZ(80px)" }} className="flex flex-col gap-6 sm:items-end sm:min-w-[320px]">
          <div className="flex items-center gap-5 w-full sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(43,89,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckSubmission}
              disabled={loading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-4 rounded-3xl px-8 py-5 text-xs font-black uppercase tracking-widest transition-all shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ${
                verdict === 'AC' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#2B59FF] text-white shadow-[#2B59FF]/20'
              }`}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              {verdict ? 'RE-VERIFY' : 'INIT SYNC'}
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href={cfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 rounded-3xl bg-white/[0.03] border border-white/5 px-8 py-5 text-xs font-black text-white hover:bg-white/[0.08] hover:border-[#2B59FF]/40 transition-all tracking-widest uppercase"
            >
              HACK <ChevronRight className="h-5 w-5 text-[#2B59FF]" />
            </motion.a>
          </div>

          <div className="flex flex-col gap-3 items-end w-full">
            {verdict && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full border shadow-2xl backdrop-blur-3xl ${
                verdict === 'AC' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
              }`}>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-2 h-2 rounded-full ${verdict === 'AC' ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_15px_currentColor]`} 
                />
                CORE PROTOCOL: {verdict}
              </motion.div>
            )}
            
            {error && (
              <div className="flex items-center gap-3 text-[10px] text-rose-500 font-black bg-rose-500/5 px-6 py-2.5 rounded-full border border-rose-500/20 uppercase tracking-[0.2em] backdrop-blur-md">
                <AlertCircle className="h-4 w-4" />
                SYNC ERROR: {error}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <DiscussionModal
        questionId={question.QuestionID}
        questionTitle={question.Title || 'Untitled'}
        isOpen={isDiscussionOpen}
        onClose={() => setIsDiscussionOpen(false)}
      />

      <QuestionNotesModal
        questionId={question.QuestionID}
        questionTitle={question.Title || 'Untracked Task'}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </>
  );
}