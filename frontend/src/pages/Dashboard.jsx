import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import ResumeService from "../services/resume.service";
import AnalysisResult from "../components/AnalysisResult";

const roles = [
  "Software Developer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Analyst", "Data Scientist",
  "UI/UX Designer", "Java Developer", "Product Manager", "AI Engineer", "Machine Learning Engineer"
];

const NavItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${active ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    style={active ? {
      background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.12))",
      border: "1px solid rgba(124,58,237,0.25)",
      boxShadow: "0 4px 20px rgba(124,58,237,0.15)"
    } : {}}
  >
    {/* Left accent bar */}
    {active && (
      <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: 'linear-gradient(180deg, #7c3aed, #06b6d4)' }} />
    )}
    {icon}
    <span>{label}</span>
  </button>
);

const StepBadge = ({ step, label, done }) => (
  <div className={`flex items-center gap-2 text-xs ${done ? 'text-violet-400' : 'text-slate-500'}`}>
    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${done ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40' : 'bg-white/5 border border-white/10'
      }`}>{done ? '✓' : step}</span>
    {label}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("Software Developer");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleLogout = () => { AuthService.logout(); navigate("/login"); };
  const handleFileChange = (e) => { setFile(e.target.files[0]); setMessage(""); setAnalysis(null); };
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setMessage(""); setAnalysis(null); }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) { setMessage("Please select a resume file first."); return; }
    if (!jobDescription.trim()) { setMessage("Please provide a brief job description."); return; }
    setLoading(true); setMessage(""); setAnalysis(null);
    try {
      setMessage("Uploading & parsing resume...");
      const uploadRes = await ResumeService.uploadResume(file);
      const resumeId = uploadRes.data.resumeId;
      setMessage("Analyzing with AI...");
      const analysisRes = await ResumeService.generateAnalysis(resumeId, jobRole, jobDescription);
      setAnalysis(analysisRes.data);
      setMessage("");
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message || "An unexpected error occurred.";
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  const initials = currentUser?.username?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#060b18' }}>
      {/* Animated mesh bg */}
      <div className="mesh-bg" />
      <div className="bg-orb" style={{ width: 600, height: 600, background: '#7c3aed', top: '-200px', left: '-200px' }} />
      <div className="bg-orb" style={{ width: 420, height: 420, background: '#06b6d4', bottom: '-100px', right: '8%', animationDelay: '-6s' }} />

      {/* Sidebar */}
      <aside className="relative z-10 flex flex-col w-64 min-h-screen p-5 flex-shrink-0" style={{
        background: 'rgba(6,11,24,0.85)',
        backdropFilter: 'blur(28px)',
        borderRight: '1px solid rgba(255,255,255,0.07)'
      }}>


        {/* User card */}
        <div className="mb-7 fade-up fade-up-d1">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(124,58,237,0.18)' }}>
            {/* Avatar with animated ring */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#060b18' }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{currentUser?.username}</p>
              <span className="badge badge-purple mt-0.5">Free plan</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1 flex-1 fade-up fade-up-d2">
          <NavItem
            active
            label="Dashboard"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <NavItem
            label="Resume Builder"
            onClick={() => navigate("/builder")}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
          />
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all duration-200 w-full fade-up fade-up-d3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-8 fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Analyze Resume
              </h2>
              <p className="text-slate-400 text-sm mt-1">Get an AI-powered ATS score and tailored suggestions.</p>
            </div>
            {/* Stat badges */}
            <div className="hidden md:flex items-center gap-2">
              <span className="badge badge-purple">🤖 AI-Powered</span>
              <span className="badge badge-cyan">⚡ Instant</span>
              <span className="badge badge-green">🎯 ATS-Ready</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Upload form */}
          <div className="lg:col-span-2 fade-up fade-up-d1">
            <div className="glass-card p-6">
              {/* Step indicators */}


              <form onSubmit={handleAnalyze} className="space-y-5">
                {/* Role */}
                <div>
                  <p className="section-label">Target Role</p>
                  <select
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="glass-input"
                    style={{ appearance: 'none' }}
                  >
                    {roles.map(r => <option key={r} value={r} style={{ background: '#0f172a', color: '#e2e8f0' }}>{r}</option>)}
                  </select>
                </div>

                {/* Job description */}
                <div>
                  <p className="section-label">Job Description</p>
                  <textarea
                    rows={4}
                    className="glass-input"
                    placeholder="Paste the target job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Drop zone */}
                <div>
                  <p className="section-label">Resume File</p>
                  <label
                    htmlFor="file-upload"
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center p-7 rounded-xl cursor-pointer transition-all duration-300"
                    style={{
                      border: `2px dashed ${dragging ? '#7c3aed' : file ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      background: dragging ? 'rgba(124,58,237,0.1)' : file ? 'rgba(124,58,237,0.05)' : 'rgba(255,255,255,0.02)',
                      boxShadow: dragging ? '0 0 30px rgba(124,58,237,0.2)' : 'none',
                    }}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 ${dragging ? 'scale-110' : ''}`}
                      style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#a78bfa' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    {file ? (
                      <div className="text-center">
                        <p className="text-sm font-semibold" style={{ color: '#a78bfa' }}>{file.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-slate-300 font-medium">Drop file here or <span style={{ color: '#a78bfa' }}>browse</span></p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX up to 10MB</p>
                      </>
                    )}
                    <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx" />
                  </label>
                </div>

                {message && (
                  <div className={`text-sm p-3 rounded-xl border flex items-center gap-2 ${message.toLowerCase().includes('error') || message.toLowerCase().includes('please')
                    ? 'text-red-400 bg-red-500/10 border-red-500/20'
                    : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                    }`}>
                    {loading && <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-current flex-shrink-0" />}
                    {message}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-gradient w-full py-3 text-sm">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Analyze Resume
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results panel */}
          <div className="lg:col-span-3 fade-up fade-up-d2">
            {analysis ? (
              <AnalysisResult result={analysis} />
            ) : (
              <div className="glass-card flex flex-col items-center justify-center p-14 h-full min-h-80 text-center">
                {/* Illustrated SVG empty state */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 48 48" style={{ color: '#a78bfa' }}>
                      <rect x="10" y="8" width="28" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
                      <line x1="16" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="16" y1="30" x2="24" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="37" cy="37" r="8" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" />
                      <path d="M34 37l2 2 4-4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {/* Floating sparkle dots */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{ background: '#7c3aed', opacity: 0.6 }} />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full" style={{ background: '#06b6d4', opacity: 0.7 }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Ready to Analyze</h3>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
