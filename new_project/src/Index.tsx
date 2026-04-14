import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCut, FaSearch, FaStar, FaArrowRight, FaCheckCircle,
   FaInstagram, FaLinkedin,
  FaCode, FaHeart,
} from "react-icons/fa";
import { GiSewingMachine, GiSewingNeedle } from "react-icons/gi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useDarkMode } from "../src/context/DarkModeContext";
import devImage from "../public/uploads/developer.jpeg";



const FEATURES = [
  { icon: "✂️", title: "Custom Stitching", desc: "Get clothes tailored exactly to your measurements by verified local tailors." },
  { icon: "👗", title: "Bridal & Ethnic Wear", desc: "Lehengas, sherwanis, and sarees crafted with elegance for your special day." },
  { icon: "📐", title: "Perfect Alterations", desc: "Resize, repair, or revamp your existing wardrobe with expert hands." },
  { icon: "⭐", title: "Rated & Reviewed", desc: "Choose tailors backed by real customer ratings and honest reviews." },
  { icon: "📍", title: "Find Nearby", desc: "Discover skilled tailors in your city — across all 29 Indian states." },
  { icon: "🔒", title: "Secure & Trusted", desc: "Verified profiles, OTP-protected accounts, and safe transactions." },
];

// ── Replaced Stats ─────────────────────────────────────────────────────────────
const STATS = [
  { num: "Custom", label: "Tailored Outfits", icon: "✂️", desc: "Stitched to your exact measurements" },
  { num: "Local", label: "Tailor Discovery", icon: "📍", desc: "Find skilled tailors near you" },
  { num: "Verified", label: "Tailor Profiles", icon: "✅", desc: "OTP-secured & background-checked" },
  { num: "Seamless", label: "Order Tracking", icon: "📦", desc: "Track every stitch in real time" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Delhi", text: "Found an amazing tailor for my wedding lehenga. Perfect fit, on time!", rating: 5 },
  { name: "Rohit Meena", city: "Jaipur", text: "As a tailor, TailorConnect tripled my customer base in just 2 months.", rating: 5 },
  { name: "Ananya Gupta", city: "Mumbai", text: "The alterations were done beautifully. Will definitely use again!", rating: 5 },
];

// ── Developer Profile ──────────────────────────────────────────────────────────
const DeveloperProfile = ({ dm }: { dm: boolean }) => (
  
  <section style={{ padding: "0 24px 100px" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c49a2c", marginBottom: "12px" }}>
          Behind the Craft
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: dm ? "white" : "#1c0a00" }}>
          Meet the Developer
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          borderRadius: "28px",
          padding: "48px 40px",
          background: dm
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.85)",
          border: dm
            ? "1px solid rgba(196,154,44,0.2)"
            : "1px solid rgba(196,154,44,0.22)",
          backdropFilter: "blur(14px)",
          display: "flex",
          alignItems: "center",
          gap: "48px",
          flexWrap: "wrap",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "rgba(196,154,44,0.06)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", left: "-40px",
          width: "160px", height: "160px", borderRadius: "50%",
          background: "rgba(146,64,14,0.06)",
          pointerEvents: "none",
        }} />

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: "150px", height: "150px", borderRadius: "50%",
            padding: "3px",
            background: "linear-gradient(135deg,#c49a2c,#92400e)",
            boxShadow: "0 16px 40px rgba(196,154,44,0.35)",
          }}>
            <img
              src={devImage}
              alt="Developer"
              style={{
                width: "100%", height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          </div>
          {/* Online badge */}
          <div style={{
            position: "absolute", bottom: "8px", right: "8px",
            width: "20px", height: "20px", borderRadius: "50%",
            background: "#22c55e",
            border: dm ? "3px solid #0f0c1e" : "3px solid white",
            boxShadow: "0 0 0 2px rgba(34,197,94,0.4)",
          }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: "240px", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "100px",
            background: "rgba(196,154,44,0.1)",
            border: "1px solid rgba(196,154,44,0.25)",
            marginBottom: "14px",
          }}>
            <FaCode size={10} color="#c49a2c" />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", color: "#c49a2c" }}>
              Full Stack Developer
            </span>
          </div>

          <h3 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "32px", fontWeight: 700,
            color: dm ? "white" : "#1c0a00",
            marginBottom: "8px", lineHeight: 1.1,
          }}>
            Riddhima Gupta
          </h3>

          <p style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "14px",
            color: dm ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
            lineHeight: 1.7,
            marginBottom: "24px",
            maxWidth: "420px",
          }}>
            Passionate about building elegant digital experiences. Crafted TailorConnect to bridge the gap between skilled tailors and fashion-forward customers across India.
          </p>

          {/* Tech stack pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
            {["React", "Node.js", "TypeScript", "MongoDB"].map((tech, i) => (
              <span key={i} style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "11px", fontWeight: 500,
                padding: "5px 12px", borderRadius: "8px",
                background: dm ? "rgba(196,154,44,0.12)" : "rgba(196,154,44,0.1)",
                border: dm ? "1px solid rgba(196,154,44,0.25)" : "1px solid rgba(196,154,44,0.2)",
                color: dm ? "rgba(255,255,255,0.7)" : "#92400e",
              }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Social links */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="https://www.instagram.com/gupta_riddhima_/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "12px",
                background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
                color: "white",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "13px", fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 6px 20px rgba(253,29,29,0.3)",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(253,29,29,0.4)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(253,29,29,0.3)"; }}
            >
              <FaInstagram size={15} />
              Instagram
            </a>

            <a
              href="https://www.linkedin.com/in/riddhima-gupta-89527438b/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "12px",
                background: "#0077b5",
                color: "white",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "13px", fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 6px 20px rgba(0,119,181,0.35)",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(0,119,181,0.5)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,119,181,0.35)"; }}
            >
              <FaLinkedin size={15} />
              LinkedIn
            </a>
          </div>
        </div>
      </motion.div>

      {/* Made with love */}
      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "13px",
          color: dm ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        }}>
          Made with <FaHeart size={11} color="#c49a2c" /> in India
        </p>
      </div>
    </div>
  </section>
);

export default function Index() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const dm = darkMode;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: dm
        ? "linear-gradient(135deg,#0d0d1a 0%,#1a1230 50%,#0d1a0d 100%)"
        : "linear-gradient(135deg,#fef3c7 0%,#fff7ed 40%,#fdf4ff 100%)",
      minHeight: "100vh",
      overflowX: "hidden",
      transition: "background 0.5s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(8deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px) rotate(-5deg)} }
        @keyframes floatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spinSlow { to{transform:rotate(360deg)} }
        @keyframes shimmerLine {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }

        .float-a { animation:floatA 4s ease-in-out infinite; }
        .float-b { animation:floatB 5.5s ease-in-out infinite; }
        .float-c { animation:floatC 3.5s ease-in-out infinite; }
        .spin-slow { animation:spinSlow 10s linear infinite; display:inline-block; }
        .pulse-dot { animation:pulse 2s infinite; }

        .btn-gold {
          display:inline-flex; align-items:center; gap:8px;
          padding:14px 32px; border-radius:12px; border:none;
          background:linear-gradient(135deg,#c49a2c,#92400e);
          color:white; font-family:'DM Sans',sans-serif;
          font-size:14px; font-weight:600; letter-spacing:0.04em;
          cursor:pointer; transition:all 0.3s ease;
          box-shadow:0 8px 24px rgba(196,154,44,0.4);
          position:relative; overflow:hidden;
          text-decoration:none;
        }
        .btn-gold::after {
          content:''; position:absolute; top:0; left:-100%;
          width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
          transition:left 0.5s;
        }
        .btn-gold:hover::after { left:100%; }
        .btn-gold:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(196,154,44,0.5); }

        .btn-outline {
          display:inline-flex; align-items:center; gap:8px;
          padding:14px 32px; border-radius:12px;
          background:transparent; cursor:pointer;
          font-family:'DM Sans',sans-serif;
          font-size:14px; font-weight:600; letter-spacing:0.04em;
          transition:all 0.3s ease; text-decoration:none;
        }
        .btn-outline:hover { transform:translateY(-3px); }

        .feat-card {
          padding:28px 24px; border-radius:18px;
          transition:all 0.3s ease; cursor:default;
        }
        .feat-card:hover { transform:translateY(-6px); }

        .stat-card {
          padding:28px 24px; border-radius:16px;
          transition:all 0.3s ease;
        }
        .stat-card:hover { transform:translateY(-4px); }

        .test-card {
          padding:26px; border-radius:18px;
          transition:all 0.3s ease;
        }
        .test-card:hover { transform:translateY(-4px); }

        .nav-link {
          padding:8px 16px; border-radius:9px;
          font-family:'DM Sans',sans-serif;
          font-size:13px; font-weight:500;
          cursor:pointer; border:none; background:transparent;
          transition:all 0.2s; text-decoration:none;
        }
        .mode-btn { transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1); cursor:pointer; border:none; }
        .mode-btn:hover { transform:scale(1.15) rotate(15deg); }

        .shimmer-text {
          background:linear-gradient(90deg,#c49a2c,#fbbf24,#92400e,#c49a2c);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmerLine 3s linear infinite;
        }
      `}</style>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 32px",
        background: scrolled
          ? dm ? "rgba(15,12,30,0.97)" : "rgba(255,255,255,0.97)"
          : "transparent",
        borderBottom: scrolled
          ? dm ? "1px solid rgba(196,154,44,0.18)" : "1px solid rgba(196,154,44,0.2)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled
          ? dm ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(196,154,44,0.1)"
          : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/")}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "11px",
              background: "linear-gradient(135deg,#c49a2c,#92400e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(196,154,44,0.4)",
            }}>
              <FaCut size={16} color="white" className="spin-slow" />
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "19px", fontWeight: 700, color: dm ? "white" : "#1c0a00", lineHeight: 1 }}>
                TailorConnect
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 600, color: "#c49a2c", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Precision Crafted
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {["Home", "Find Tailor"].map((l, i) => (
              <button key={i} className="nav-link" style={{ color: dm ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.52)" }}
                onClick={() => navigate(i === 1 ? "/FindTailor" : "/")}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className="mode-btn" onClick={() => setDarkMode(!dm)}
              style={{
                width: "38px", height: "38px", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: dm ? "rgba(196,154,44,0.12)" : "rgba(146,64,14,0.07)",
                border: dm ? "1px solid rgba(196,154,44,0.25)" : "1px solid rgba(146,64,14,0.14)",
                color: dm ? "#fbbf24" : "#92400e", fontSize: "15px",
              }}>
              {dm ? <BsSun /> : <BsMoon />}
            </button>

            <div style={{ width: "1px", height: "22px", background: dm ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />

            <button className="btn-outline"
              style={{
                color: dm ? "rgba(255,255,255,0.8)" : "#92400e",
                border: dm ? "1px solid rgba(196,154,44,0.3)" : "1px solid rgba(196,154,44,0.35)",
                padding: "9px 22px",
              }}
              onClick={() => navigate("/ProfilePage", { state: { mode: "login" } })}>
              Log In
            </button>

            <button className="btn-gold" style={{ padding: "9px 22px" }}
              onClick={() => navigate("/ProfilePage", { state: { mode: "signup" } })}>
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px 24px 60px",
        position: "relative", overflow: "hidden",
      }}>
        {[
          { w: 500, h: 500, bg: "#c49a2c", top: "-150px", right: "-100px", op: 0.18 },
          { w: 380, h: 380, bg: "#92400e", bottom: "-80px", left: "-80px", op: 0.15 },
          { w: 250, h: 250, bg: "#fbbf24", top: "40%", left: "3%", op: 0.1 },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            width: b.w, height: b.h, background: b.bg,
            opacity: b.op, filter: "blur(70px)",
            top: (b as any).top, bottom: (b as any).bottom,
            left: (b as any).left, right: (b as any).right,
            pointerEvents: "none",
          }} />
        ))}

        <div className="float-a" style={{ position: "absolute", top: "18%", left: "6%", opacity: 0.2 }}>
          <GiSewingNeedle size={44} color={dm ? "#fbbf24" : "#92400e"} />
        </div>
        <div className="float-b" style={{ position: "absolute", top: "22%", right: "7%", opacity: 0.16 }}>
          <GiSewingMachine size={38} color={dm ? "#fbbf24" : "#92400e"} />
        </div>
        <div className="float-c" style={{ position: "absolute", bottom: "22%", left: "8%", opacity: 0.18 }}>
          <FaCut size={30} color={dm ? "#fbbf24" : "#92400e"} />
        </div>
        <div className="float-a" style={{ position: "absolute", bottom: "18%", right: "6%", opacity: 0.14, animationDelay: "1.5s" }}>
          <GiSewingNeedle size={34} color={dm ? "#fbbf24" : "#92400e"} />
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: "820px", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "8px 20px", borderRadius: "100px",
              background: "rgba(196,154,44,0.12)", border: "1px solid rgba(196,154,44,0.3)",
              marginBottom: "28px",
            }}>
              <span className="pulse-dot" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#c49a2c", display: "inline-block" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#92400e" }}>
                Now live across 29 states in India
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(3rem,7.5vw,5.5rem)",
              fontWeight: 700, lineHeight: 1.05,
              color: dm ? "white" : "#1c0a00",
              marginBottom: "24px",
            }}>
              Your Perfect Fit,<br />
              <span className="shimmer-text">Stitched With Care</span>
            </h1>

            <p style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "17px", color: dm ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
              lineHeight: 1.8, maxWidth: "540px", margin: "0 auto 40px",
            }}>
              Connect with verified local tailors, get custom-fitted clothes, and manage every order — all in one elegant platform.
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "56px" }}>
              <button className="btn-gold"
                onClick={() => navigate("/ProfilePage", { state: { mode: "signup" } })}>
                Get Started Free <FaArrowRight size={13} />
              </button>
              <button className="btn-outline"
                style={{
                  color: dm ? "rgba(255,255,255,0.8)" : "#92400e",
                  border: dm ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(196,154,44,0.35)",
                  background: dm ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
                }}
                onClick={() => navigate("/FindTailor")}>
                <FaSearch size={13} /> Find a Tailor
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
              {["Free to sign up", "Verified tailors only", "OTP-secured accounts"].map((t, i) => (
                <span key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "5px" }}>
                  <FaCheckCircle size={11} color="#c49a2c" /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STATS (Replaced) ═══════════════ */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="stat-card"
                style={{
                  background: dm ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
                  border: dm ? "1px solid rgba(196,154,44,0.18)" : "1px solid rgba(196,154,44,0.18)",
                  backdropFilter: "blur(10px)",
                }}>
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{s.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", fontWeight: 700, color: dm ? "white" : "#1c0a00", lineHeight: 1, marginBottom: "6px" }}>
                  {s.num}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#c49a2c", marginBottom: "6px" }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)", lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section style={{ padding: "0 24px 90px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c49a2c", marginBottom: "12px" }}>
              Everything You Need
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: dm ? "white" : "#1c0a00", marginBottom: "14px" }}>
              Built For Tailors &amp; Customers
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: dm ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.38)", maxWidth: "480px", margin: "0 auto" }}>
              One platform, two sides — whether you sew or you shop, we've got you covered.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "16px" }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className="feat-card"
                style={{
                  background: dm ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.82)",
                  border: dm ? "1px solid rgba(196,154,44,0.14)" : "1px solid rgba(196,154,44,0.16)",
                  backdropFilter: "blur(10px)",
                }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "13px",
                  background: dm ? "rgba(196,154,44,0.12)" : "rgba(196,154,44,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", marginBottom: "16px",
                }}>
                  {f.icon}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "19px", fontWeight: 600, color: dm ? "white" : "#1c0a00", marginBottom: "8px" }}>
                  {f.title}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: dm ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)", lineHeight: 1.7 }}>
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section style={{ padding: "0 24px 90px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c49a2c", marginBottom: "12px" }}>
              What People Say
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: dm ? "white" : "#1c0a00" }}>
              Loved by the Community
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="test-card"
                style={{
                  background: dm ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
                  border: dm ? "1px solid rgba(196,154,44,0.15)" : "1px solid rgba(196,154,44,0.2)",
                  backdropFilter: "blur(10px)",
                }}>
                <div style={{ display: "flex", marginBottom: "14px" }}>
                  {Array(t.rating).fill(0).map((_, j) => (
                    <FaStar key={j} size={14} color="#c49a2c" />
                  ))}
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", color: dm ? "rgba(255,255,255,0.82)" : "#2a1400", lineHeight: 1.6, fontStyle: "italic", marginBottom: "18px" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#c49a2c,#92400e)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "white",
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: dm ? "white" : "#1c0a00" }}>{t.name}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)" }}>{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              borderRadius: "28px", padding: "60px 40px", textAlign: "center",
              background: dm
                ? "linear-gradient(135deg,#2d1f0a,#1a1230)"
                : "linear-gradient(135deg,#92400e,#c49a2c)",
              border: "1px solid rgba(196,154,44,0.3)",
              position: "relative", overflow: "hidden",
            }}>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
                Join TailorConnect today
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,4.5vw,3.2rem)", fontWeight: 700, color: "white", marginBottom: "16px", lineHeight: 1.1 }}>
                Ready to Find Your<br />Perfect Tailor?
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.65)", marginBottom: "36px", maxWidth: "420px", margin: "0 auto 36px" }}>
                Sign up free today and connect with skilled tailors in your city — no hidden fees.
              </p>
              <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/ProfilePage", { state: { mode: "signup" } })}
                  style={{
                    padding: "14px 32px", borderRadius: "12px", border: "none",
                    background: "white", color: "#92400e",
                    fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 700,
                    cursor: "pointer", transition: "all 0.3s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}
                  onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}>
                  Create Free Account <FaArrowRight size={13} />
                </button>
                <button onClick={() => navigate("/ProfilePage", { state: { mode: "login" } })}
                  style={{
                    padding: "14px 32px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.12)", color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.3s",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                  onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}>
                  Already have an account? Log In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ DEVELOPER PROFILE ═══════════════ */}
      <DeveloperProfile dm={dm} />
      
      

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{
        borderTop: dm ? "1px solid rgba(196,154,44,0.12)" : "1px solid rgba(196,154,44,0.18)",
        padding: "32px 24px",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaCut size={11} color="rgba(196,154,44,0.5)" />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "13px", letterSpacing: "0.12em", color: dm ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)" }}>
              TAILORCONNECT · CRAFTED WITH PRECISION
            </span>
            <FaCut size={11} color="rgba(196,154,44,0.5)" style={{ transform: "scaleX(-1)" }} />
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Home", "Find Tailor", "Sign Up", "Log In"].map((l, i) => (
              <button key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseOver={e => (e.currentTarget.style.color = "#c49a2c")}
                onMouseOut={e => (e.currentTarget.style.color = dm ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)")}
                onClick={() => {
                  if (l === "Sign Up") navigate("/ProfilePage", { state: { mode: "signup" } });
                  else if (l === "Log In") navigate("/ProfilePage", { state: { mode: "login" } });
                  else if (l === "Find Tailor") navigate("/FindTailor");
                  else navigate("/");
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
