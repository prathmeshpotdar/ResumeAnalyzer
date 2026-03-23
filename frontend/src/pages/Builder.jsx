import React, { useState } from 'react';
import ResumeBuilderWorkspace from '../components/ResumeBuilderWorkspace';
import AuthService from '../services/auth.service';
import axiosInstance from "axios";
import { useNavigate } from 'react-router-dom';

const AI_URL = "http://localhost:8081/api/ai/";

const inputCls = "glass-input";
const textareaCls = "glass-input";

const SectionCard = ({ children, accent }) => (
  <div className="rounded-2xl p-5 mb-5 relative overflow-hidden transition-all duration-200"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
    {accent && (
      <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: accent }} />
    )}
    {children}
  </div>
);

const SectionHeader = ({ title }) => (
  <h3 className="text-sm font-bold mb-4 uppercase tracking-widest" style={{ color: '#a78bfa' }}>{title}</h3>
);

const AIButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
    style={{ background: loading ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}
  >
    {loading ? (
      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    ) : <span>✨</span>}
    {loading ? "Thinking..." : "AI Improve"}
  </button>
);

const RemoveButton = ({ onClick }) => (
  <button type="button" onClick={onClick}
    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:bg-red-500/20"
    style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
    Remove
  </button>
);

const AddButton = ({ onClick, label }) => (
  <button type="button" onClick={onClick}
    className="text-xs font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
    style={{ color: '#06b6d4', border: '1px dashed rgba(6,182,212,0.35)', background: 'rgba(6,182,212,0.06)' }}>
    <span className="text-base leading-none">+</span> {label}
  </button>
);

// Progress tracker sections
const SECTIONS = [
  { key: ['fullName', 'email'], label: 'Personal', icon: '👤' },
  { key: ['summary'], label: 'Summary', icon: '📝' },
  { key: ['experience'], label: 'Experience', icon: '💼', array: true },
  { key: ['projects'], label: 'Projects', icon: '🚀', array: true },
  { key: ['skills'], label: 'Skills', icon: '⚙️' },
  { key: ['education'], label: 'Education', icon: '🎓', array: true },
];

const ProgressTracker = ({ formData }) => {
  const isDone = (sec) => {
    if (sec.array) return formData[sec.key[0]]?.some(e => Object.values(e).some(v => v));
    return sec.key.some(k => formData[k]?.trim());
  };
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {SECTIONS.map((sec, i) => {
        const done = isDone(sec);
        return (
          <div key={i} className="flex items-center gap-1">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 ${done ? '' : 'opacity-40'}`}
              style={{ background: done ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)', color: done ? '#a78bfa' : '#64748b', border: `1px solid ${done ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}` }}>
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </div>
            {i < SECTIONS.length - 1 && <span className="text-slate-700 text-xs">·</span>}
          </div>
        );
      })}
    </div>
  );
};

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", location: "", linkedin: "",
    summary: "",
    skills: "",
    experience: [{ title: "", company: "", date: "", description: "" }],
    projects: [{ title: "", link: "", date: "", description: "" }],
    education: [{ degree: "", school: "", year: "" }]
  });
  const [aiLoading, setAiLoading] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleArrayChange = (index, field, value, type) => {
    const updated = [...formData[type]]; updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };
  const addArrayItem = (type) => {
    const templates = {
      experience: { title: "", company: "", date: "", description: "" },
      projects: { title: "", link: "", date: "", description: "" },
      education: { degree: "", school: "", year: "" },
    };
    setFormData({ ...formData, [type]: [...formData[type], templates[type]] });
  };
  const removeArrayItem = (index, type) =>
    setFormData({ ...formData, [type]: formData[type].filter((_, i) => i !== index) });

  const improveWithAI = async (text, context, onSuccess) => {
    if (!text || !text.trim()) { alert("Please enter some text before using AI Improve."); return; }
    setAiLoading(true);
    try {
      const response = await axiosInstance.post(AI_URL + "improve", { text, context });
      if (onSuccess) onSuccess(response.data.improvedText);
    } catch (e) {
      console.error("Error calling AI improve:", e);
      alert("Failed to improve text. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden print:bg-white print:block" style={{ background: '#060b18' }}>
      <div className="mesh-bg print:hidden" />
      <div className="bg-orb print:hidden" style={{ width: 500, height: 500, background: '#7c3aed', top: '-150px', left: '-100px' }} />
      <div className="bg-orb print:hidden" style={{ width: 350, height: 350, background: '#06b6d4', bottom: '-80px', right: '45%', animationDelay: '-6s' }} />

      {/* Editor Panel */}
      <div className="relative z-10 w-full md:w-1/2 overflow-y-auto h-screen print:hidden border-r"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,11,24,0.88)', backdropFilter: 'blur(28px)' }}>

        {/* Top bar */}
        <div className="sticky top-0 z-20 border-b" style={{ background: 'rgba(6,11,24,0.97)', backdropFilter: 'blur(28px)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              {/* Breadcrumb */}
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
              </button>
              <span className="text-slate-600">›</span>
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Resume Builder</h2>
            </div>
            <button onClick={() => window.print()} className="btn-gradient flex items-center gap-2 px-4 py-2 text-sm rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Export PDF
            </button>
          </div>
          {/* Progress tracker */}
          <div className="px-6 pb-3">
            <ProgressTracker formData={formData} />
          </div>
        </div>

        <div className="p-6 space-y-2">
          {/* Personal Info */}
          <SectionCard accent="linear-gradient(180deg, #7c3aed, #4f46e5)">
            <SectionHeader title="Personal Information" />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputCls} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} />
              <input className={inputCls} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              <input className={inputCls} name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
              <input className={inputCls} name="location" placeholder="City, State" value={formData.location} onChange={handleInputChange} />
              <input className={`${inputCls} col-span-2`} name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleInputChange} />
            </div>
          </SectionCard>

          {/* Summary */}
          <SectionCard accent="linear-gradient(180deg, #4f46e5, #6366f1)">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Professional Summary" />
              <AIButton loading={aiLoading} onClick={() => improveWithAI(formData.summary, "resume summary", (v) => setFormData({ ...formData, summary: v }))} />
            </div>
            <textarea className={textareaCls} name="summary" rows={4} placeholder="A brief summary of your expertise..." value={formData.summary} onChange={handleInputChange} style={{ resize: 'vertical' }} />
          </SectionCard>

          {/* Experience */}
          <SectionCard accent="linear-gradient(180deg, #06b6d4, #0891b2)">
            <SectionHeader title="Experience" />
            {formData.experience.map((exp, i) => (
              <div key={i} className="mb-4 last:mb-0 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input className={inputCls} placeholder="Job Title" value={exp.title} onChange={(e) => handleArrayChange(i, "title", e.target.value, "experience")} />
                  <input className={inputCls} placeholder="Company Name" value={exp.company} onChange={(e) => handleArrayChange(i, "company", e.target.value, "experience")} />
                  <input className={`${inputCls} col-span-2`} placeholder="Date (e.g. Jan 2020 – Present)" value={exp.date} onChange={(e) => handleArrayChange(i, "date", e.target.value, "experience")} />
                </div>
                <textarea className={textareaCls} rows={3} placeholder="Description of achievements (one per line)..." value={exp.description} onChange={(e) => handleArrayChange(i, "description", e.target.value, "experience")} style={{ resize: 'vertical', marginBottom: 8 }} />
                <div className="flex justify-between">
                  <AIButton loading={aiLoading} onClick={() => improveWithAI(exp.description, exp.title || "experience", (v) => handleArrayChange(i, "description", v, "experience"))} />
                  <RemoveButton onClick={() => removeArrayItem(i, "experience")} />
                </div>
              </div>
            ))}
            <div className="mt-3"><AddButton onClick={() => addArrayItem("experience")} label="Add Experience" /></div>
          </SectionCard>

          {/* Projects */}
          <SectionCard accent="linear-gradient(180deg, #8b5cf6, #7c3aed)">
            <SectionHeader title="Projects" />
            {formData.projects.map((proj, i) => (
              <div key={i} className="mb-4 last:mb-0 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input className={inputCls} placeholder="Project Title" value={proj.title} onChange={(e) => handleArrayChange(i, "title", e.target.value, "projects")} />
                  <input className={inputCls} placeholder="GitHub / Demo Link" value={proj.link} onChange={(e) => handleArrayChange(i, "link", e.target.value, "projects")} />
                  <input className={`${inputCls} col-span-2`} placeholder="Date (e.g. Jan 2024)" value={proj.date} onChange={(e) => handleArrayChange(i, "date", e.target.value, "projects")} />
                </div>
                <textarea className={textareaCls} rows={3} placeholder="Project description and key features..." value={proj.description} onChange={(e) => handleArrayChange(i, "description", e.target.value, "projects")} style={{ resize: 'vertical', marginBottom: 8 }} />
                <div className="flex justify-between">
                  <AIButton loading={aiLoading} onClick={() => improveWithAI(proj.description, proj.title || "project", (v) => handleArrayChange(i, "description", v, "projects"))} />
                  <RemoveButton onClick={() => removeArrayItem(i, "projects")} />
                </div>
              </div>
            ))}
            <div className="mt-3"><AddButton onClick={() => addArrayItem("projects")} label="Add Project" /></div>
          </SectionCard>

          {/* Skills */}
          <SectionCard accent="linear-gradient(180deg, #10b981, #059669)">
            <SectionHeader title="Technical Skills" />
            <input className={inputCls} name="skills" placeholder="React, Node.js, Java, Spring Boot, AWS..." value={formData.skills} onChange={handleInputChange} />
          </SectionCard>

          {/* Education */}
          <SectionCard accent="linear-gradient(180deg, #f59e0b, #d97706)">
            <SectionHeader title="Education" />
            {formData.education.map((edu, i) => (
              <div key={i} className="mb-4 last:mb-0 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange(i, "degree", e.target.value, "education")} />
                  <input className={inputCls} placeholder="School / University" value={edu.school} onChange={(e) => handleArrayChange(i, "school", e.target.value, "education")} />
                  <input className={inputCls} placeholder="Graduation Year" value={edu.year} onChange={(e) => handleArrayChange(i, "year", e.target.value, "education")} />
                  <div className="flex items-center justify-end">
                    <RemoveButton onClick={() => removeArrayItem(i, "education")} />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-3"><AddButton onClick={() => addArrayItem("education")} label="Add Education" /></div>
          </SectionCard>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="relative z-10 w-full md:w-1/2 overflow-y-auto h-screen print:hidden"
        style={{ background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,11,24,0.5)', backdropFilter: 'blur(20px)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Live Preview</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500">Auto-updated</span>
          </div>
        </div>
        <div className="p-6 flex justify-center">
          <div className="w-full max-w-[800px] shadow-2xl rounded-lg overflow-hidden" style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
            <ResumeBuilderWorkspace formData={formData} />
          </div>
        </div>
      </div>

      {/* Print target */}
      <div className="hidden print:block print:absolute print:inset-0 print:m-0 print:p-[0.75in]">
        <ResumeBuilderWorkspace formData={formData} />
      </div>
      <style type="text/css" media="print">{`
        @page { size: auto; margin: 0; }
        body, html { height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
