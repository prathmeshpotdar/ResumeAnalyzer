import React, { useEffect, useRef, useState } from 'react';

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  const score = result.atsScore;
  const [displayScore, setDisplayScore] = useState(0);

  const getScoreColor = (s) => {
    if (s >= 90) return { ring: '#10b981', glow: 'rgba(16,185,129,0.5)', text: '#10b981', label: 'Excellent', badgeClass: 'badge-green' };
    if (s >= 75) return { ring: '#f59e0b', glow: 'rgba(245,158,11,0.5)', text: '#f59e0b', label: 'Good', badgeClass: 'badge-amber' };
    if (s >= 50) return { ring: '#f97316', glow: 'rgba(249,115,22,0.5)', text: '#f97316', label: 'Fair', badgeClass: 'badge-amber' };
    return { ring: '#ef4444', glow: 'rgba(239,68,68,0.5)', text: '#ef4444', label: 'Needs Work', badgeClass: 'badge-purple' };
  };

  const sc = getScoreColor(score);

  // Count-up animation
  useEffect(() => {
    let start = 0;
    const duration = 900;
    const step = Math.ceil(score / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayScore(score); clearInterval(timer); }
      else setDisplayScore(start);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  let suggestions = [];
  try {
    suggestions = JSON.parse(result.suggestionsJson);
  } catch {
    if (typeof result.suggestionsJson === 'string') suggestions = [result.suggestionsJson];
  }

  // Circular progress
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (displayScore / 100) * circumference;



  return (
    <div className="glass-card p-6 h-full fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Analysis Results</h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Target: <span style={{ color: '#a78bfa' }}>{result.jobRole}</span>
          </p>
        </div>
        <span className={`badge ${sc.badgeClass} text-sm px-3 py-1.5 animate-pulse`} style={{ animationDuration: '3s' }}>
          {sc.label}
        </span>
      </div>

      {/* Score + Stars row */}
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-7">
        {/* Circular score ring */}
        <div className="flex flex-col items-center">
          <div style={{ position: 'relative', width: '148px', height: '148px' }}>
            <svg width="148" height="148" viewBox="0 0 148 148">
              {/* Track */}
              <circle cx="74" cy="74" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11" />
              {/* Glow layer */}
              <circle
                cx="74" cy="74" r={radius}
                fill="none"
                stroke={sc.ring}
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 74 74)"
                style={{ filter: `drop-shadow(0 0 10px ${sc.glow})`, transition: 'stroke-dashoffset 0.05s linear' }}
                opacity="0.3"
              />
              {/* Main arc */}
              <circle
                cx="74" cy="74" r={radius}
                fill="none"
                stroke={sc.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 74 74)"
                style={{ transition: 'stroke-dashoffset 0.05s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: sc.ring, fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{displayScore}</span>
              <span style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>/ 100</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2 font-medium uppercase tracking-wider">ATS Match Score</p>
        </div>

        {/* Stars + score bar */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <p className="section-label mb-2">Overall Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="28" height="28" viewBox="0 0 20 20"
                  fill={star <= result.rating ? '#f59e0b' : 'transparent'}
                  stroke={star <= result.rating ? '#f59e0b' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="1.5"
                  style={{ flexShrink: 0, filter: star <= result.rating ? 'drop-shadow(0 0 4px rgba(245,158,11,0.6))' : 'none', transition: 'filter 0.2s' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-white font-bold text-lg ml-2">{result.rating}<span className="text-slate-400 text-sm font-normal"> / 5</span></span>
            </div>
          </div>

        </div>

      </div>{/* end Score + Stars row */}

      {/* Suggestions */}
      <div>
        <p className="section-label mb-4">💡 Suggestions for Improvement</p>
        {suggestions && suggestions.length > 0 ? (
          <ul className="space-y-2.5">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="suggestion-card flex items-start gap-3 p-3.5 rounded-xl relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Left accent gradient border */}
                <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: `linear-gradient(180deg, #7c3aed, #06b6d4)` }} />
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
                  {idx + 1}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{suggestion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm">No specific suggestions available.</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
