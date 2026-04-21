import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCut, FaHome, FaSearch, FaStar, FaBars, FaTimes } from "react-icons/fa";
import { GiSewingMachine } from "react-icons/gi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useDarkMode } from "../src/context/DarkModeContext";
import axios from "axios";

// ─── API Base URL ─────────────────────────────────────────────────────────────
const API_BASE = "https://tailor-connect-new-mvxq.vercel.app";

const ALL_NAV_LINKS = [
  { label: "Home",        path: "/",             icon: <FaHome size={13} />,  showFor: ["customer", "tailor", ""] },
  { label: "Find Tailor", path: "/FindTailor",   icon: <FaSearch size={13} />, showFor: ["customer"] },
  { label: "Rate & Review", path: "/RateAndReview", icon: <FaStar size={13} />, showFor: ["customer"] },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dm = darkMode;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE}/profile/logout`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userEmail");
      navigate("/ProfilePage", { state: { mode: "login" } });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const userType = localStorage.getItem("userType") || "";
  const NAV_LINKS = ALL_NAV_LINKS.filter(link => link.showFor.includes(userType));

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        background: dm
          ? "linear-gradient(135deg, #0d0d1a 0%, #1a1230 50%, #0d1a0d 100%)"
          : "linear-gradient(135deg, #fef3c7 0%, #fff7ed 40%, #fdf4ff 100%)",
        minHeight: "100vh",
        transition: "background 0.5s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes floatNav {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-5px) rotate(8deg); }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes shimmerMove {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .nav-logo-spin { animation: spinSlow 10s linear infinite; display: inline-block; }
        .nav-icon-float { animation: floatNav 3.5s ease-in-out infinite; }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          border: none;
          background: transparent;
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #c49a2c, #92400e);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after { width: 60%; }
        .nav-link:hover { transform: translateY(-2px); }

        .mode-btn {
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          border: none;
        }
        .mode-btn:hover { transform: scale(1.15) rotate(15deg); }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover { transform: translateX(4px); }

        .hamburger-btn {
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }
        .hamburger-btn:hover { transform: scale(1.1); }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled
            ? dm ? "rgba(15,12,30,0.97)" : "rgba(255,255,255,0.97)"
            : dm ? "rgba(15,12,30,0.85)" : "rgba(255,255,255,0.85)",
          borderBottom: dm
            ? "1px solid rgba(196,154,44,0.18)"
            : "1px solid rgba(196,154,44,0.2)",
          backdropFilter: "blur(20px)",
          boxShadow: scrolled
            ? dm ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(196,154,44,0.1)"
            : "none",
          transition: "all 0.4s ease",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* ── Logo ── */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <div style={{ position: "relative", width: "36px", height: "36px" }}>
              <div
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #c49a2c 0%, #92400e 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(196,154,44,0.4)",
                }}
              >
                <FaCut size={15} color="white" className="nav-logo-spin" />
              </div>
              <div
                style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  width: "14px", height: "14px", borderRadius: "50%",
                  background: dm ? "#0f0c1e" : "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid rgba(196,154,44,0.5)",
                }}
              >
                <GiSewingMachine size={7} color="#c49a2c" />
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "18px", fontWeight: 700,
                  color: dm ? "white" : "#1c0a00",
                  lineHeight: 1, letterSpacing: "0.02em",
                }}
              >
                TailorConnect
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px", fontWeight: 600,
                  color: "#c49a2c", letterSpacing: "0.14em",
                  textTransform: "uppercase", lineHeight: 1.2,
                }}
              >
                Precision Crafted
              </div>
            </div>
          </motion.div>

          {/* ── Desktop Nav Links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {NAV_LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <motion.button
                  key={link.path}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`nav-link${active ? " active" : ""}`}
                  onClick={() => navigate(link.path)}
                  style={{
                    color: active ? "#c49a2c" : dm ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)",
                    background: active
                      ? dm ? "rgba(196,154,44,0.12)" : "rgba(196,154,44,0.1)"
                      : "transparent",
                    border: active
                      ? dm ? "1px solid rgba(196,154,44,0.25)" : "1px solid rgba(196,154,44,0.2)"
                      : "1px solid transparent",
                  }}
                >
                  <span style={{ color: active ? "#c49a2c" : dm ? "rgba(196,154,44,0.5)" : "#c49a2c", opacity: active ? 1 : 0.6 }}>
                    {link.icon}
                  </span>
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: "absolute", inset: 0, borderRadius: "10px",
                        background: "linear-gradient(135deg, rgba(196,154,44,0.08), rgba(146,64,14,0.06))",
                        zIndex: -1,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* ── Right Side Controls ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!dm)}
              className="mode-btn"
              style={{
                width: "38px", height: "38px", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: dm ? "rgba(196,154,44,0.12)" : "rgba(146,64,14,0.07)",
                border: dm ? "1px solid rgba(196,154,44,0.25)" : "1px solid rgba(146,64,14,0.14)",
                color: dm ? "#fbbf24" : "#92400e", fontSize: "15px",
              }}
            >
              {dm ? <BsSun /> : <BsMoon />}
            </button>

            {userType && (
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px", borderRadius: "10px",
                  border: dm ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(239,68,68,0.3)",
                  background: dm ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.07)",
                  color: "#f87171", fontFamily: "'DM Sans',sans-serif",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  letterSpacing: "0.04em", transition: "all 0.2s ease",
                }}
                onMouseOver={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                onMouseOut={e => (e.currentTarget.style.background = dm ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.07)")}
              >
                Log Out
              </button>
            )}

            {/* Hamburger (mobile) */}
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: "38px", height: "38px", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                color: dm ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)",
              }}
            >
              {menuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: "64px", left: "16px", right: "16px",
              zIndex: 99, borderRadius: "16px", padding: "12px",
              background: dm ? "rgba(15,12,30,0.98)" : "rgba(255,255,255,0.98)",
              border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.18)",
              backdropFilter: "blur(20px)",
              boxShadow: dm
                ? "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(196,154,44,0.1)"
                : "0 20px 60px rgba(196,154,44,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
              transformOrigin: "top center",
            }}
          >
            {/* Brand strip */}
            <div style={{ padding: "8px 12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #c49a2c, #92400e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <FaCut size={11} color="white" />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", fontWeight: 700, color: dm ? "white" : "#1c0a00" }}>
                TailorConnect
              </div>
            </div>

            <div style={{ height: "1px", background: dm ? "rgba(255,255,255,0.07)" : "rgba(196,154,44,0.14)", marginBottom: "8px" }} />

            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.path);
              return (
                <motion.button
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="mobile-nav-link"
                  onClick={() => { navigate(link.path); setMenuOpen(false); }}
                  style={{
                    color: active ? "#c49a2c" : dm ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                    background: active ? dm ? "rgba(196,154,44,0.12)" : "rgba(196,154,44,0.09)" : "transparent",
                    border: active ? dm ? "1px solid rgba(196,154,44,0.22)" : "1px solid rgba(196,154,44,0.18)" : "1px solid transparent",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "32px", height: "32px", borderRadius: "9px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: active ? "linear-gradient(135deg, #c49a2c, #92400e)" : dm ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                      color: active ? "white" : dm ? "rgba(196,154,44,0.6)" : "#c49a2c",
                      flexShrink: 0,
                    }}
                  >
                    {link.icon}
                  </span>
                  {link.label}
                  {active && (
                    <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#c49a2c" }} />
                  )}
                </motion.button>
              );
            })}

            {userType && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06 }}
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 20px", borderRadius: "12px",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", width: "100%", textAlign: "left",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171", marginBottom: "4px",
                }}
              >
                <span style={{ width: "32px", height: "32px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,0.15)", color: "#f87171", flexShrink: 0 }}>
                  ✕
                </span>
                Log Out
              </motion.button>
            )}

            {/* Footer */}
            <div style={{ padding: "12px 8px 4px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "1px", background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <FaCut size={8} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)" }} />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", color: dm ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", letterSpacing: "0.12em" }}>
                  TAILORCONNECT
                </span>
                <FaCut size={8} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)", transform: "scaleX(-1)" }} />
              </div>
              <div style={{ flex: 1, height: "1px", background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Content ── */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
