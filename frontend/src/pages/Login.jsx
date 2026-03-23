import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const FeaturePill = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
    {icon}
    {label}
  </div>
);

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await AuthService.login(username, password);
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setLoading(false);
      setMessage(resMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6" style={{ background: '#060b18' }}>
      {/* Animated mesh background */}
      <div className="mesh-bg" />
      {/* Floating orbs */}
      <div className="bg-orb" style={{ width: 550, height: 550, background: '#7c3aed', top: '-160px', left: '-160px' }} />
      <div className="bg-orb" style={{ width: 420, height: 420, background: '#06b6d4', bottom: '-110px', right: '-110px', animationDelay: '-5s' }} />

      <div className="relative z-10 fade-up" style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        {/* Logo + branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5, #06b6d4)' }}>
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {/* glow ring */}
            <span className="absolute inset-0 rounded-2xl animate-ping" style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', opacity: 0.2 }} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>AI Resume Analyzer</h1>
          <p className="text-slate-400 text-sm">Welcome back — sign in to your account</p>


        </div>

        {/* Card */}
        <div className="glass-card p-8 fade-up fade-up-d1">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <p className="section-label">Username</p>
              <input
                type="text"
                className="glass-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password with eye toggle */}
            <div>
              <p className="section-label">Password</p>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="glass-input"
                  style={{ paddingRight: '42px' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2" role="alert">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
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
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold" style={{ color: '#a78bfa' }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Login;
