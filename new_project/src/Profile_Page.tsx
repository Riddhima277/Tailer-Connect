import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye, FaEyeSlash, FaMoon, FaSun, FaCut,
  FaEnvelope, FaLock, FaPhone, FaUserTag,
  FaChevronRight, FaCheckCircle, FaRedo, FaHome,
} from "react-icons/fa";
import { GiSewingNeedle, GiSewingString, GiSewingMachine } from "react-icons/gi";
import { useDarkMode } from "../src/context/DarkModeContext";

// ─── API Base URL ─────────────────────────────────────────────────────────────
const API_BASE = "https://tailor-connect-new-fovv.vercel.app";

interface AuthState {
  isLogin: boolean; email: string; password: string;
  userType: string; contact: string; error: string;
}

// ─── OTP Screen ───────────────────────────────────────────────────────────────
const OtpScreen = ({ email, darkMode, onSuccess, onBack }: {
  email: string; darkMode: boolean; onSuccess: () => void; onBack: () => void;
}) => {
  const [otp, setOtp] = useState<string[]>(["","","","","",""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dm = darkMode;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp]; updated[index] = value; setOtp(updated); setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp]; digits.split("").forEach((d, i) => { updated[i] = d; });
    setOtp(updated); inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the full 6-digit OTP"); return; }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/profile/verify-otp`, { email, otp: code });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true); setError("");
    try {
      await axios.post(`${API_BASE}/profile/resend-otp`, { email });
      setOtp(["","","","","",""]); setResendCooldown(60); inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-screen-anim">
      <style>{`
        @keyframes otpIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes successPop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .otp-screen-anim{animation:otpIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards}
        .success-icon{animation:successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .otp-shake{animation:shake 0.4s ease}
        .otp-box{width:48px;height:56px;text-align:center;font-size:22px;font-weight:700;border-radius:12px;outline:none;transition:all 0.2s ease;font-family:'Cormorant Garamond',serif;caret-color:#c49a2c}
        .otp-box:focus{transform:translateY(-2px);box-shadow:0 0 0 2px #c49a2c44}
      `}</style>
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="success-icon"><FaCheckCircle size={64} style={{ color: "#c49a2c" }} /></div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontWeight:700, color:dm?"white":"#1c0a00" }}>Verified!</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:dm?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.38)" }}>Redirecting to your profile...</p>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <button onClick={onBack} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#c49a2c", background:"none", border:"none", cursor:"pointer", marginBottom:"16px", padding:0, display:"flex", alignItems:"center", gap:"4px" }}>← Back</button>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", color:"#c49a2c", marginBottom:"8px" }}>OTP Verification</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"34px", fontWeight:700, lineHeight:1.1, color:dm?"white":"#1c0a00", marginBottom:"8px" }}>Check your<br/>inbox</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:dm?"rgba(255,255,255,0.42)":"rgba(0,0,0,0.38)", lineHeight:1.6 }}>
              We sent a 6-digit code to<br/><span style={{ color:dm?"rgba(255,255,255,0.75)":"#1c0a00", fontWeight:500 }}>{email}</span>
            </p>
          </div>
          <div className={`flex gap-2 mb-6 justify-center ${error?"otp-shake":""}`} key={error} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} className="otp-box"
                style={{ background:dm?(digit?"rgba(196,154,44,0.15)":"rgba(255,255,255,0.05)"):(digit?"rgba(196,154,44,0.1)":"rgba(146,64,14,0.04)"), border:digit?"1.5px solid rgba(196,154,44,0.7)":(dm?"1.5px solid rgba(255,255,255,0.1)":"1.5px solid rgba(196,154,44,0.2)"), color:dm?"white":"#1c0a00" }} autoFocus={i===0} />
            ))}
          </div>
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4" style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)" }}>
              <span style={{ fontSize:"12px" }}>⚠️</span>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#f87171", margin:0 }}>{error}</p>
            </div>
          )}
          <button onClick={handleVerify} disabled={loading} style={{ width:"100%", padding:"14px", borderRadius:"12px", border:"none", background:"linear-gradient(135deg,#c49a2c 0%,#92400e 100%)", color:"white", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, letterSpacing:"0.05em", cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"all 0.3s ease" }}>
            {loading ? <span style={{ display:"inline-block", width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> : <><FaCheckCircle size={13}/> Verify OTP</>}
          </button>
          <div className="text-center mt-5">
            {resendCooldown > 0 ? (
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:dm?"rgba(255,255,255,0.32)":"rgba(0,0,0,0.32)" }}>
                Resend code in <span style={{ color:"#c49a2c", fontWeight:600 }}>{resendCooldown}s</span>
              </p>
            ) : (
              <button onClick={handleResend} disabled={resending} style={{ background:"none", border:"none", cursor:"pointer", color:"#c49a2c", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, display:"inline-flex", alignItems:"center", gap:"6px" }}>
                <FaRedo size={11} style={{ animation:resending?"spin 1s linear infinite":"none" }}/>{resending?"Sending...":"Resend OTP"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Illustration ─────────────────────────────────────────────────────────────
const TailorIllustration = ({ darkMode }: { darkMode: boolean }) => (
  <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="200" cy="120" rx="45" ry="20" fill={darkMode?"#c49a2c":"#f59e0b"} opacity="0.9"/>
    <path d="M155 120 Q140 180 130 260 Q125 290 145 295 L255 295 Q275 290 270 260 Q260 180 245 120 Z" fill={darkMode?"#a07820":"#fbbf24"} opacity="0.85"/>
    <path d="M145 295 Q140 320 160 325 L240 325 Q260 320 255 295 Z" fill={darkMode?"#c49a2c":"#f59e0b"} opacity="0.7"/>
    <rect x="190" y="320" width="20" height="60" rx="5" fill={darkMode?"#7c5a10":"#d97706"} opacity="0.8"/>
    <line x1="290" y1="80" x2="320" y2="200" stroke={darkMode?"#e2c97e":"#92400e"} strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="290" cy="80" rx="6" ry="10" fill={darkMode?"#e2c97e":"#92400e"} transform="rotate(-30 290 80)"/>
    <circle cx="292" cy="77" r="3" fill={darkMode?"#1a1a2e":"white"}/>
    <path d="M292 77 Q340 120 310 180 Q290 220 330 260" stroke={darkMode?"#f87171":"#dc2626"} strokeWidth="2" strokeDasharray="6 4" fill="none" strokeLinecap="round"/>
    <g transform="translate(80,200) rotate(-20)">
      <circle cx="0" cy="0" r="12" fill="none" stroke={darkMode?"#e2c97e":"#92400e"} strokeWidth="2.5"/>
      <circle cx="20" cy="8" r="12" fill="none" stroke={darkMode?"#e2c97e":"#92400e"} strokeWidth="2.5"/>
      <line x1="10" y1="6" x2="60" y2="35" stroke={darkMode?"#e2c97e":"#92400e"} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="10" x2="60" y2="-18" stroke={darkMode?"#e2c97e":"#92400e"} strokeWidth="2.5" strokeLinecap="round"/>
    </g>
    <path d="M350 150 L353 140 L356 150 L366 153 L356 156 L353 166 L350 156 L340 153 Z" fill={darkMode?"#fbbf24":"#f59e0b"} opacity="0.8"/>
  </svg>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Profile_Page() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<"form"|"otp">("form");
  const [pendingEmail, setPendingEmail] = useState("");

  const [state, setState] = useState<AuthState>({
    isLogin: false, email: "", password: "", userType: "", contact: "", error: "",
  });

  useEffect(() => {
    const mode = (location.state as any)?.mode;
    if (mode === "login") setState((prev) => ({ ...prev, isLogin: true }));
    else if (mode === "signup") setState((prev) => ({ ...prev, isLogin: false }));
  }, [location.state]);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setState({ ...state, [e.target.name]: e.target.value, error: "" });
  };

  const toggleMode = () => {
    setAnimating(true);
    setTimeout(() => { setState((prev) => ({ ...prev, isLogin: !prev.isLogin, error: "" })); setAnimating(false); }, 300);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pw: string) => /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(pw);
  const validateContact = (c: string) => /^[0-9]{10}$/.test(c);

  const routeByUserType = (userType: string) => {
    if (userType === "customer") navigate("/CustomerProfile");
    else if (userType === "tailor") navigate("/TailorProfile");
    else navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(state.email))       { setState({ ...state, error: "Please enter a valid email address" }); return; }
    if (!validatePassword(state.password)) { setState({ ...state, error: "Password: 8+ chars, 1 number & 1 special character" }); return; }

    if (state.isLogin) {
      try {
        const res = await axios.post(`${API_BASE}/profile/login`, {
          email: state.email,
          password: state.password,
        });
        const userType: string = res.data.userType || res.data.data?.userType || "";
        localStorage.setItem("token", res.data.token || "");
        localStorage.setItem("userType", userType);
        localStorage.setItem("userEmail", state.email);
        routeByUserType(userType);
      } catch (err: any) {
        setState({ ...state, error: err.response?.data?.msg || "Something went wrong" });
      }
      return;
    }

    if (!state.userType)                   { setState({ ...state, error: "Please select a user type" }); return; }
    if (!validateContact(state.contact))   { setState({ ...state, error: "Please enter a valid 10-digit contact number" }); return; }

    try {
      const response = await axios.post(`${API_BASE}/profile/send-otp`, {
        email: state.email,
        password: state.password,
        userType: state.userType,
        contact: state.contact,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", state.userType);
      setPendingEmail(state.email);
      setScreen("otp");
    } catch (err: any) {
      setState({ ...state, error: err.response?.data?.msg || "Failed to send OTP" });
    }
  };

  const handleOtpSuccess = () => {
    const userType = localStorage.getItem("userType") || "";
    routeByUserType(userType);
  };

  const dm = darkMode;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
      style={{ background: dm ? "linear-gradient(135deg,#0d0d1a 0%,#1a1230 50%,#0d1a0d 100%)" : "linear-gradient(135deg,#fef3c7 0%,#fff7ed 40%,#fdf4ff 100%)", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(8deg)}}
        @keyframes floatB{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(-6deg)}}
        @keyframes floatC{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
        @keyframes formFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideLeft{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spinSlow{to{transform:rotate(360deg)}}
        .float-a{animation:floatA 4s ease-in-out infinite}.float-b{animation:floatB 5.5s ease-in-out infinite}.float-c{animation:floatC 3.5s ease-in-out infinite}
        .card-mounted{animation:scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards}.form-anim{animation:formFade 0.35s ease forwards}.form-hidden{opacity:0;pointer-events:none}
        .panel-anim{animation:slideLeft 0.8s ease forwards}.cut-spin{animation:spinSlow 8s linear infinite}
        .tailor-input{width:100%;padding:11px 14px 11px 42px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;transition:all 0.25s ease;outline:none}
        .tailor-input:focus{transform:translateY(-1px)}
        .lbl{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;display:block;margin-bottom:6px}
        .submit-btn{position:relative;overflow:hidden;font-family:'DM Sans',sans-serif;letter-spacing:0.05em;transition:all 0.3s ease;cursor:pointer;border:none}
        .submit-btn::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transition:left 0.5s ease}
        .submit-btn:hover::after{left:100%}.submit-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(196,154,44,0.4)}.submit-btn:active{transform:translateY(0)}
        .toggle-btn{font-family:'DM Sans',sans-serif;background:none;border:none;cursor:pointer;position:relative;transition:all 0.2s ease}
        .toggle-btn::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#c49a2c;transition:width 0.3s ease}.toggle-btn:hover::after{width:100%}
        .mode-btn{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;border:none}.mode-btn:hover{transform:scale(1.15) rotate(15deg)}
        .feat-pill{display:inline-flex;align-items:center;padding:5px 12px;border-radius:8px;margin:3px;font-family:'DM Sans',sans-serif;font-size:11px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.82)}
      `}</style>

      <div className={`w-full max-w-5xl rounded-3xl shadow-2xl flex transition-colors duration-500 ${mounted?"card-mounted":"opacity-0"}`}
        style={{ background:dm?"rgba(15,12,30,0.96)":"rgba(255,255,255,0.97)", border:dm?"1px solid rgba(196,154,44,0.2)":"1px solid rgba(196,154,44,0.15)", backdropFilter:"blur(20px)", boxShadow:dm?"0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(196,154,44,0.1)":"0 40px 80px rgba(196,154,44,0.12),inset 0 1px 0 rgba(255,255,255,0.8)" }}>

        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center relative overflow-hidden p-10"
          style={{ background:dm?"linear-gradient(145deg,#1a1230 0%,#2d1f0a 50%,#1a1230 100%)":"linear-gradient(145deg,#92400e 0%,#c49a2c 40%,#78350f 100%)" }}>
          <div className="float-a absolute top-12 left-8" style={{opacity:0.22}}><GiSewingNeedle size={40} color={dm?"#fbbf24":"white"}/></div>
          <div className="float-b absolute top-24 right-10" style={{opacity:0.16}}><GiSewingString size={36} color={dm?"#fbbf24":"white"}/></div>
          <div className="float-c absolute bottom-28 left-12" style={{opacity:0.2}}><span className="cut-spin" style={{display:"inline-block"}}><FaCut size={28} color={dm?"#fbbf24":"white"}/></span></div>
          <div className="float-a absolute bottom-16 right-8" style={{opacity:0.16,animationDelay:"1s"}}><GiSewingMachine size={34} color={dm?"#fbbf24":"white"}/></div>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{background:dm?"#fbbf24":"white",opacity:0.08,transform:"translate(30%,-30%)"}}/>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{background:dm?"#fbbf24":"white",opacity:0.08,transform:"translate(-30%,30%)"}}/>
          <div className="relative z-10 text-center panel-anim">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{background:"rgba(255,255,255,0.14)",border:"1px solid rgba(255,255,255,0.22)",backdropFilter:"blur(10px)"}}>
              <FaCut size={11} color="#fde68a"/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"11px",letterSpacing:"0.1em",color:"rgba(255,255,255,0.9)",textTransform:"uppercase"}}>Master Tailoring</span>
            </div>
            <div style={{width:"220px",height:"220px",margin:"0 auto 20px"}}><TailorIllustration darkMode={dm}/></div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"32px",fontWeight:700,color:"white",lineHeight:1.2,marginBottom:"12px"}}>
              Stitch Your<br/><span style={{background:"linear-gradient(135deg,#fbbf24,#fde68a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Perfect Fit</span>
            </h1>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:"rgba(255,255,255,0.62)",lineHeight:1.7,maxWidth:"210px",margin:"0 auto 20px"}}>Connect tailors &amp; customers on one elegant platform.</p>
            <div>{["✂️ Expert Tailors","📐 Perfect Fit","⭐ Rated Reviews"].map((f,i)=><span key={i} className="feat-pill">{f}</span>)}</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-7/12 w-full p-8 relative">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => navigate("/")}
              className="mode-btn w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background:dm?"rgba(196,154,44,0.14)":"rgba(146,64,14,0.07)", border:dm?"1px solid rgba(196,154,44,0.28)":"1px solid rgba(146,64,14,0.14)", color:dm?"#fbbf24":"#92400e", fontSize:"16px" }}
            >
              <FaHome size={14} />
            </button>
            <button
              onClick={() => setDarkMode(!dm)}
              className="mode-btn w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background:dm?"rgba(196,154,44,0.14)":"rgba(146,64,14,0.07)", border:dm?"1px solid rgba(196,154,44,0.28)":"1px solid rgba(146,64,14,0.14)", color:dm?"#fbbf24":"#92400e", fontSize:"16px" }}
            >
              {dm?<FaSun/>:<FaMoon/>}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <FaCut style={{color:"#c49a2c"}}/>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"18px",color:dm?"#fbbf24":"#92400e"}}>TailorConnect</span>
          </div>

          {screen === "otp" && <OtpScreen email={pendingEmail} darkMode={dm} onSuccess={handleOtpSuccess} onBack={()=>setScreen("form")}/>}

          {screen === "form" && (
            <>
              <div className={`mb-7 ${animating?"form-hidden":"form-anim"}`}>
                <p className="lbl" style={{color:"#c49a2c"}}>{state.isLogin?"Welcome back":"Get started"}</p>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"36px",fontWeight:700,lineHeight:1.1,color:dm?"white":"#1c0a00",marginBottom:"6px"}}>{state.isLogin?"Sign In":"Create Account"}</h2>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:dm?"rgba(255,255,255,0.42)":"rgba(0,0,0,0.38)"}}>{state.isLogin?"Enter your credentials to continue":"Join the tailoring community today"}</p>
              </div>

              <form onSubmit={handleSubmit} className={`space-y-4 ${animating?"form-hidden":"form-anim"}`}>
                <div>
                  <label className="lbl" style={{color:dm?"rgba(255,255,255,0.48)":"rgba(0,0,0,0.42)"}}>Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2" size={13} style={{color:dm?"rgba(196,154,44,0.6)":"#c49a2c"}}/>
                    <input type="email" name="email" required value={state.email} onChange={handleChange} placeholder="you@example.com" className="tailor-input"
                      style={{background:dm?"rgba(255,255,255,0.05)":"rgba(146,64,14,0.04)",border:dm?"1px solid rgba(255,255,255,0.1)":"1px solid rgba(196,154,44,0.2)",color:dm?"white":"#1c0a00"}}/>
                  </div>
                </div>

                <div>
                  <label className="lbl" style={{color:dm?"rgba(255,255,255,0.48)":"rgba(0,0,0,0.42)"}}>Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2" size={12} style={{color:dm?"rgba(196,154,44,0.6)":"#c49a2c"}}/>
                    <input type={showPassword?"text":"password"} name="password" required value={state.password} onChange={handleChange} placeholder="Min. 8 chars + number + symbol" className="tailor-input"
                      style={{background:dm?"rgba(255,255,255,0.05)":"rgba(146,64,14,0.04)",border:dm?"1px solid rgba(255,255,255,0.1)":"1px solid rgba(196,154,44,0.2)",color:dm?"white":"#1c0a00",paddingRight:"44px"}}/>
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:dm?"rgba(255,255,255,0.32)":"rgba(0,0,0,0.28)",fontSize:"14px"}}>
                      {showPassword?<FaEyeSlash/>:<FaEye/>}
                    </button>
                  </div>
                </div>

                {!state.isLogin && (
                  <div className="form-anim">
                    <label className="lbl" style={{color:dm?"rgba(255,255,255,0.48)":"rgba(0,0,0,0.42)"}}>Contact Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2" size={12} style={{color:dm?"rgba(196,154,44,0.6)":"#c49a2c"}}/>
                      <input type="text" name="contact" required value={state.contact} onChange={handleChange} maxLength={10} placeholder="10-digit mobile number" className="tailor-input"
                        style={{background:dm?"rgba(255,255,255,0.05)":"rgba(146,64,14,0.04)",border:dm?"1px solid rgba(255,255,255,0.1)":"1px solid rgba(196,154,44,0.2)",color:dm?"white":"#1c0a00"}}/>
                    </div>
                  </div>
                )}

                {!state.isLogin && (
                  <div className="form-anim">
                    <label className="lbl" style={{color:dm?"rgba(255,255,255,0.48)":"rgba(0,0,0,0.42)"}}>I am a...</label>
                    <div className="relative">
                      <FaUserTag className="absolute left-3.5 top-1/2 -translate-y-1/2" size={13} style={{color:dm?"rgba(196,154,44,0.6)":"#c49a2c"}}/>
                      <select name="userType" required value={state.userType} onChange={handleChange} className="tailor-input"
                        style={{appearance:"none",cursor:"pointer",background:dm?"#1e1630":"rgba(146,64,14,0.04)",border:dm?"1px solid rgba(255,255,255,0.1)":"1px solid rgba(196,154,44,0.2)",color:state.userType?(dm?"white":"#1c0a00"):(dm?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)")}}>
                        <option value="">Select your role</option>
                        <option value="customer">Customer</option>
                        <option value="tailor">Tailor</option>
                      </select>
                    </div>
                  </div>
                )}

                {state.error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)"}}>
                    <span style={{fontSize:"12px"}}>⚠️</span>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"12px",color:"#f87171",margin:0}}>{state.error}</p>
                  </div>
                )}

                <button type="submit" className="submit-btn w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                  style={{background:"linear-gradient(135deg,#c49a2c 0%,#92400e 100%)",fontSize:"14px"}}>
                  {state.isLogin?"Sign In":"Continue →"}{state.isLogin&&<FaChevronRight size={12}/>}
                </button>
              </form>

              <div className="text-center mt-6">
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:dm?"rgba(255,255,255,0.32)":"rgba(0,0,0,0.32)",marginBottom:"4px"}}>{state.isLogin?"New to TailorConnect?":"Already have an account?"}</p>
                <button onClick={toggleMode} className="toggle-btn font-semibold" style={{color:"#c49a2c",fontSize:"14px"}}>{state.isLogin?"Create a free account →":"Sign in instead →"}</button>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 mt-8">
            <div className="flex-1 h-px" style={{background:dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}}/>
            <div className="flex items-center gap-1.5">
              <FaCut size={9} style={{color:dm?"rgba(196,154,44,0.4)":"rgba(196,154,44,0.5)"}}/>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"11px",color:dm?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.18)",letterSpacing:"0.12em"}}>TAILORCONNECT</span>
              <FaCut size={9} style={{color:dm?"rgba(196,154,44,0.4)":"rgba(196,154,44,0.5)",transform:"scaleX(-1)"}}/>
            </div>
            <div className="flex-1 h-px" style={{background:dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}}/>
          </div>
        </div>
      </div>
    </div>
  );
}
