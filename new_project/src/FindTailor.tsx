import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaSearch, FaMapMarkerAlt, FaBriefcase, FaStar, FaStarHalfAlt, FaRegStar,
  FaPhone, FaEnvelope, FaStore, FaHome, FaCity, FaCalendarAlt,
  FaInstagram, FaYoutube, FaFacebook, FaGlobe, FaMoon, FaSun,
  FaChevronLeft, FaChevronRight, FaUserTie, FaCut, FaFilter,
  FaTimes, FaHeart, FaIdCard, FaInfoCircle,
} from "react-icons/fa";
import { GiSewingMachine, GiSewingNeedle } from "react-icons/gi";
import { useDarkMode } from "../src/context/DarkModeContext";

// ─── API Base URL ─────────────────────────────────────────────────────────────
const API_BASE = "https://tailer-connect-backened.vercel.app";

// ─── Axios ────────────────────────────────────────────────────────────────────
const API = axios.create({ baseURL: API_BASE });

const tailorAPI = {
  search: (f: Record<string, string>) => API.post("/find-tailor/search", f),
  all:    ()                           => API.get("/find-tailor/all"),
  byId:   (id: string)                 => API.get(`/find-tailor/${id}`),
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface SocialLink { platform: string; url: string; }

interface TailorProfile {
  _id: string;
  name: string;
  email: string;
  contact: string;
  profilePic: string;
  city: string;
  shopCity: string;
  shopAddress: string;
  address: string;
  category: string;
  speciality: string;
  workType: "Home" | "Shop" | "Both";
  since: string;
  dob: string;
  gender: string;
  otherInfo: string;
  socialLinks: SocialLink[];
  rating?: number;
  reviewCount?: number;
}

interface ReviewDoc {
  _id: string;
  tailorContact: string;
  tailorName: string;
  star: number;
  review: string;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d1f0a"/><stop offset="100%" stop-color="#1a1230"/>
    </radialGradient>
    <radialGradient id="skin" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#f5cba7"/><stop offset="100%" stop-color="#e59866"/>
    </radialGradient>
    <linearGradient id="shirt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c49a2c"/><stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="100" fill="url(#bg)"/>
  <ellipse cx="100" cy="178" rx="55" ry="40" fill="url(#shirt)" clip-path="url(#c)"/>
  <clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath>
  <ellipse cx="100" cy="168" rx="42" ry="32" fill="url(#shirt)"/>
  <rect x="92" y="128" width="16" height="22" rx="8" fill="url(#skin)"/>
  <ellipse cx="100" cy="112" rx="33" ry="35" fill="url(#skin)"/>
  <ellipse cx="100" cy="82" rx="33" ry="15" fill="#3d2008"/>
  <ellipse cx="69" cy="99" rx="7" ry="13" fill="#3d2008"/>
  <ellipse cx="131" cy="99" rx="7" ry="13" fill="#3d2008"/>
  <ellipse cx="88" cy="110" rx="5.5" ry="6.5" fill="white"/>
  <ellipse cx="112" cy="110" rx="5.5" ry="6.5" fill="white"/>
  <ellipse cx="89" cy="111" rx="3.5" ry="4" fill="#3d2008"/>
  <ellipse cx="113" cy="111" rx="3.5" ry="4" fill="#3d2008"/>
  <path d="M91 127 Q100 134 109 127" stroke="#c0734a" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

function yearsExp(since: string) {
  if (!since) return 0;
  return new Date().getFullYear() - new Date(since).getFullYear();
}

function RatingStars({ rating = 0, size = 11 }: { rating?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => {
        if (rating >= i) return <FaStar key={i} size={size} color="#f59e0b"/>;
        if (rating >= i-0.5) return <FaStarHalfAlt key={i} size={size} color="#f59e0b"/>;
        return <FaRegStar key={i} size={size} color="#f59e0b"/>;
      })}
    </div>
  );
}

const platformIcons: Record<string, React.ReactNode> = {
  Website:   <FaGlobe size={11}/>,
  Instagram: <FaInstagram size={11}/>,
  Facebook:  <FaFacebook size={11}/>,
  YouTube:   <FaYoutube size={11}/>,
};

const ITEMS_PER_PAGE = 6;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FindTailor() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [city, setCity]                   = useState("");
  const [category, setCategory]           = useState("");
  const [speciality, setSpeciality]       = useState("");
  const [workType, setWorkType]           = useState("");
  const [tailors, setTailors]             = useState<TailorProfile[]>([]);
  const [loading, setLoading]             = useState(false);
  const [searched, setSearched]           = useState(false);
  const [error, setError]                 = useState("");
  const [currentPage, setCurrentPage]     = useState(1);
  const [savedSet, setSavedSet]           = useState<Set<string>>(new Set());
  const [detailTailor, setDetailTailor]   = useState<TailorProfile | null>(null);
  const [modalReviews, setModalReviews]   = useState<ReviewDoc[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const dm = darkMode;

  // ─── SEARCH ───────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    setLoading(true); setSearched(true); setError(""); setCurrentPage(1);
    try {
      const filters: Record<string, string> = {};
      if (city)       filters.city       = city;
      if (category)   filters.category   = category;
      if (speciality) filters.speciality = speciality;
      if (workType)   filters.workType   = workType;

      const res = await tailorAPI.search(filters);
      setTailors(res.data.status ? res.data.docs : []);
    } catch {
      setError("Server not reachable. Make sure the backend is running on port 2009.");
      setTailors([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setCity(""); setCategory(""); setSpeciality(""); setWorkType("");
    setTailors([]); setSearched(false); setError("");
  };

  const toggleSave = (id: string) => {
    setSavedSet(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ─── VIEW TAILOR — opens modal and fetches reviews ────────────────────────
  const handleViewTailor = async (t: TailorProfile) => {
    setDetailTailor(t);
    setModalReviews([]);
    setReviewsLoading(true);
    try {
      const res = await API.post("/review/getByContact", { tailorContact: t.contact });
      if (res.data.status) setModalReviews(res.data.docs);
    } catch {
      // silently fail — reviews section just stays empty
    } finally {
      setReviewsLoading(false);
    }
  };

  const totalPages  = Math.ceil(tailors.length / ITEMS_PER_PAGE);
  const pageTailors = tailors.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE);

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const selectSt = (hasVal: boolean): React.CSSProperties => ({
    background: dm ? "#1e1630" : "rgba(146,64,14,0.04)",
    border: `1px solid ${dm ? "rgba(255,255,255,0.1)" : "rgba(196,154,44,0.25)"}`,
    color: hasVal ? (dm ? "white" : "#1c0a00") : (dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"),
    appearance: "none" as any, cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontSize: "13px",
    outline: "none", borderRadius: "10px",
    padding: "10px 14px 10px 38px", width: "100%", transition: "all 0.25s",
  });

  const optSt: React.CSSProperties = {
    background: dm ? "#1e1630" : "white",
    color: dm ? "white" : "#1c0a00",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: dm
          ? "linear-gradient(135deg,#0d0d1a 0%,#1a1230 50%,#0d1a0d 100%)"
          : "linear-gradient(135deg,#fef3c7 0%,#fff7ed 40%,#fdf4ff 100%)",
        fontFamily: "'Cormorant Garamond',Georgia,serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(8deg)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{left:-100%}100%{left:200%}}
        .float-a{animation:floatA 4s ease-in-out infinite}
        .spin{animation:spin 0.9s linear infinite}
        .tp-card{transition:all 0.35s cubic-bezier(0.16,1,0.3,1)}
        .tp-card:hover{transform:translateY(-7px)}
        .tp-shine{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);transition:left 0.6s ease;pointer-events:none}
        .tp-card:hover .tp-shine{left:160%}
        .lbl{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;display:block;margin-bottom:5px}
        .tp-input{width:100%;padding:10px 14px 10px 38px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:all 0.25s}
        .pg-btn{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;border-radius:8px;padding:7px 13px;cursor:pointer;transition:all 0.2s;border:none}
        .pg-btn:hover{transform:translateY(-1px)}
        .modal-overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px)}
        .reviews-scroll::-webkit-scrollbar{width:4px}
        .reviews-scroll::-webkit-scrollbar-track{background:transparent}
        .reviews-scroll::-webkit-scrollbar-thumb{border-radius:4px;background:rgba(196,154,44,0.25)}
      `}</style>

      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{ background: dm ? "rgba(13,13,26,0.93)" : "rgba(255,251,235,0.93)", borderBottom: dm ? "1px solid rgba(196,154,44,0.15)" : "1px solid rgba(196,154,44,0.2)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="float-a"><GiSewingMachine size={24} color="#c49a2c"/></div>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 700, color: dm ? "white" : "#1c0a00", lineHeight: 1 }}>TailorConnect</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#c49a2c", letterSpacing: "0.1em", textTransform: "uppercase" }}>Find Your Expert Tailor</p>
          </div>
        </div>
        <button onClick={() => setDarkMode(!dm)} className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: dm ? "rgba(196,154,44,0.14)" : "rgba(146,64,14,0.07)", border: dm ? "1px solid rgba(196,154,44,0.28)" : "1px solid rgba(146,64,14,0.14)", color: dm ? "#fbbf24" : "#92400e", cursor: "pointer" }}>
          {dm ? <FaSun size={14}/> : <FaMoon size={14}/>}
        </button>
      </header>

      <div className="flex max-w-[1400px] mx-auto px-4 py-6 gap-6">

        {/* ─── SIDEBAR ─────────────────────────────────────────────────────── */}
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full lg:w-[290px] flex-shrink-0" style={{ alignSelf: "flex-start", position: "sticky", top: "78px" }}>
          <div className="rounded-2xl overflow-hidden shadow-xl"
            style={{ background: dm ? "rgba(15,12,30,0.97)" : "rgba(255,255,255,0.98)", border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.15)", backdropFilter: "blur(20px)" }}>

            {/* Sidebar header */}
            <div className="px-5 py-5 relative overflow-hidden"
              style={{ background: dm ? "linear-gradient(145deg,#1a1230,#2d1f0a)" : "linear-gradient(145deg,#92400e,#c49a2c)" }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style={{ background: "white", transform: "translate(30%,-30%)" }}/>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <FaFilter size={11} color="rgba(255,255,255,0.7)"/>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>Search Filters</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 700, color: "white" }}>Find Your Tailor</h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* City */}
              <div>
                <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>City</label>
                <div className="relative">
                  <FaCity className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: "#c49a2c" }}/>
                  <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
                    placeholder="Enter city name..." className="tp-input"
                    style={{ background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)", border: `1px solid ${dm ? "rgba(255,255,255,0.1)" : "rgba(196,154,44,0.25)"}`, color: dm ? "white" : "#1c0a00" }}/>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Category</label>
                <div className="relative">
                  <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 z-10" size={11} style={{ color: "#c49a2c" }}/>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={selectSt(!!category)}>
                    <option value="" style={optSt}>All Categories</option>
                    {["Men","Women","Children","Both"].map(c => <option key={c} value={c} style={optSt}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Speciality */}
              <div>
                <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Speciality</label>
                <div className="relative">
                  <GiSewingNeedle className="absolute left-3 top-1/2 -translate-y-1/2 z-10" size={13} style={{ color: "#c49a2c" }}/>
                  <input list="spec-list" value={speciality} onChange={e => setSpeciality(e.target.value)}
                    placeholder="e.g. Bridal, Suits..." className="tp-input"
                    style={{ background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)", border: `1px solid ${dm ? "rgba(255,255,255,0.1)" : "rgba(196,154,44,0.25)"}`, color: dm ? "white" : "#1c0a00" }}/>
                  <datalist id="spec-list">
                    {["Bridal Lehenga","Suits","Sherwanis","Salwar Kameez","Sarees","Kurtis","Blazers","Pathani","Kurta Pyjama","School Uniforms","Kids Wear","Alterations","Casual Wear","Designer Blouses","Gowns"].map(s => <option key={s} value={s}/>)}
                  </datalist>
                </div>
              </div>

              {/* Work Type */}
              <div>
                <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Work Type</label>
                <div className="relative">
                  <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 z-10" size={11} style={{ color: "#c49a2c" }}/>
                  <select value={workType} onChange={e => setWorkType(e.target.value)} style={selectSt(!!workType)}>
                    <option value="" style={optSt}>Any Work Type</option>
                    {["Home","Shop","Both"].map(w => <option key={w} value={w} style={optSt}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ height: "1px", background: dm ? "rgba(255,255,255,0.06)" : "rgba(196,154,44,0.12)" }}/>

              {/* Search btn */}
              <motion.button onClick={handleSearch} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
                style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, opacity: loading ? 0.7 : 1, boxShadow: "0 8px 24px rgba(196,154,44,0.35)", letterSpacing: "0.04em" }}>
                {loading
                  ? <><div className="spin w-4 h-4 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "white" }}/> Searching...</>
                  : <><FaSearch size={13}/> Find Tailors</>}
              </motion.button>

              {(city||category||speciality||workType) && (
                <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2"
                  style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)", background: "none", border: "none", cursor: "pointer", padding: "6px" }}>
                  <FaTimes size={10}/> Clear Filters
                </motion.button>
              )}
            </div>

            {/* Count badge */}
            {searched && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mx-5 mb-5 rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: dm ? "rgba(196,154,44,0.08)" : "rgba(196,154,44,0.06)", border: dm ? "1px solid rgba(196,154,44,0.18)" : "1px solid rgba(196,154,44,0.15)" }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: 700, color: dm ? "#fbbf24" : "#92400e", lineHeight: 1 }}>{tailors.length}</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tailors Found</p>
                </div>
                <FaCut size={20} color="#c49a2c" style={{ opacity: 0.4 }}/>
              </motion.div>
            )}
          </div>
        </motion.aside>

        {/* ─── RESULTS AREA ────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Initial state */}
          {!searched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
              <div className="float-a mb-6"><GiSewingMachine size={68} color={dm ? "rgba(196,154,44,0.3)" : "rgba(196,154,44,0.22)"}/></div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 600, color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)", marginBottom: "8px" }}>Find Your Perfect Tailor</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: dm ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>Use the filters on the left to search verified tailor profiles</p>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl px-5 py-4 mb-5 flex items-center gap-3"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <FaTimes size={12} color="#ef4444"/>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#ef4444" }}>{error}</span>
            </motion.div>
          )}

          {/* No results */}
          {searched && tailors.length === 0 && !loading && !error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
              <GiSewingNeedle size={52} color={dm ? "rgba(196,154,44,0.3)" : "rgba(196,154,44,0.25)"}/>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: 600, color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)", marginTop: "16px", marginBottom: "8px" }}>No Tailors Found</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: dm ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>Try adjusting your search filters</p>
            </motion.div>
          )}

          {/* Cards grid */}
          {searched && tailors.length > 0 && (
            <>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4"
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
                Showing {(currentPage-1)*ITEMS_PER_PAGE+1}–{Math.min(currentPage*ITEMS_PER_PAGE, tailors.length)} of {tailors.length} tailors
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence mode="wait">
                  {pageTailors.map((t, i) => (
                    <motion.div key={t._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.38, delay: i*0.06 }}>
                      <TailorCard
                        tailor={t}
                        dm={dm}
                        saved={savedSet.has(t._id)}
                        onSave={() => toggleSave(t._id)}
                        onView={() => handleViewTailor(t)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1} className="pg-btn flex items-center gap-1.5"
                    style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(146,64,14,0.06)", border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)", color: currentPage===1 ? (dm ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)") : (dm ? "rgba(255,255,255,0.7)" : "#92400e"), cursor: currentPage===1 ? "not-allowed" : "pointer" }}>
                    <FaChevronLeft size={10}/> Prev
                  </button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} className="pg-btn"
                      style={{ background: currentPage===p ? "linear-gradient(135deg,#c49a2c,#92400e)" : dm ? "rgba(255,255,255,0.06)" : "rgba(146,64,14,0.06)", border: currentPage===p ? "none" : dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)", color: currentPage===p ? "white" : dm ? "rgba(255,255,255,0.6)" : "#92400e", boxShadow: currentPage===p ? "0 4px 12px rgba(196,154,44,0.3)" : "none", minWidth: "34px" }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="pg-btn flex items-center gap-1.5"
                    style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(146,64,14,0.06)", border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)", color: currentPage===totalPages ? (dm ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)") : (dm ? "rgba(255,255,255,0.7)" : "#92400e"), cursor: currentPage===totalPages ? "not-allowed" : "pointer" }}>
                    Next <FaChevronRight size={10}/>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-3 py-8">
        <div className="flex-1 max-w-[200px] h-px" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}/>
        <div className="flex items-center gap-1.5">
          <FaCut size={8} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)" }}/>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "10px", color: dm ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)", letterSpacing: "0.12em" }}>TAILORCONNECT</span>
          <FaCut size={8} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)", transform: "scaleX(-1)" }}/>
        </div>
        <div className="flex-1 max-w-[200px] h-px" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}/>
      </div>

      {/* ─── Detail Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {detailTailor && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailTailor(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl overflow-hidden"
              style={{ background: dm ? "rgba(15,12,30,0.98)" : "rgba(255,255,255,0.99)", border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.4)", maxHeight: "90vh", overflowY: "auto" }}
            >
              {/* Modal top band */}
              <div className="h-28 relative" style={{ background: dm ? "linear-gradient(135deg,#1a1230,#2d1f0a)" : "linear-gradient(135deg,#92400e,#c49a2c)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: "white", transform: "translate(30%,-30%)" }}/>
                <button onClick={() => setDetailTailor(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", color: "white" }}>
                  <FaTimes size={12}/>
                </button>
                <div className="absolute bottom-3 left-5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,0.9)", fontSize: "10px" }}>
                    {detailTailor.workType === "Home" ? <FaHome size={9}/> : detailTailor.workType === "Shop" ? <FaStore size={9}/> : <><FaHome size={9}/><FaStore size={9}/></>}
                    &nbsp;{detailTailor.workType}
                  </span>
                </div>
              </div>

              {/* Avatar overlap */}
              <div className="px-6" style={{ marginTop: "10px", marginBottom: "12px", position: "relative", zIndex: 10 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                  border: "3px solid rgba(196,154,44,0.5)", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>
                  <img src={detailTailor.profilePic && detailTailor.profilePic !== "nopic.jpg" ? detailTailor.profilePic : defaultAvatar} alt={detailTailor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                </div>
              </div>

              <div className="px-6 pb-6">
                {/* Name & category */}
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 700, color: dm ? "white" : "#1c0a00", marginBottom: "4px" }}>{detailTailor.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                    style={{ background: dm ? "rgba(196,154,44,0.1)" : "rgba(196,154,44,0.08)", border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.15)", fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#c49a2c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <FaBriefcase size={8}/> {detailTailor.category}
                  </span>
                  {detailTailor.gender && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                      style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)", fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: dm ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)", textTransform: "uppercase" }}>
                      {detailTailor.gender}
                    </span>
                  )}
                </div>

                {/* Rating summary */}
                <div className="flex items-center gap-2 mb-4">
                  <RatingStars rating={detailTailor.rating ?? 0} size={13}/>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#f59e0b" }}>{(detailTailor.rating ?? 0).toFixed(1)}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>({detailTailor.reviewCount ?? 0} reviews)</span>
                </div>

                <div style={{ height: "1px", background: dm ? "rgba(255,255,255,0.07)" : "rgba(196,154,44,0.12)", marginBottom: "16px" }}/>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { icon: <FaMapMarkerAlt size={10} color="#c49a2c"/>, label: "Home City",   val: detailTailor.city },
                    { icon: <FaCalendarAlt size={10} color="#c49a2c"/>,  label: "Experience", val: `${yearsExp(detailTailor.since)}+ years` },
                    { icon: <FaPhone size={10} color="#c49a2c"/>,        label: "Contact",    val: detailTailor.contact },
                    { icon: <FaEnvelope size={10} color="#c49a2c"/>,     label: "Email",      val: detailTailor.email },
                    ...(detailTailor.shopCity ? [{ icon: <FaStore size={10} color="#c49a2c"/>, label: "Shop City", val: detailTailor.shopCity }] : []),
                    ...(detailTailor.speciality ? [{ icon: <GiSewingNeedle size={11} color="#c49a2c"/>, label: "Speciality", val: detailTailor.speciality }] : []),
                  ].map((row, i) => (
                    <div key={i} className="rounded-lg px-3 py-2" style={{ background: dm ? "rgba(255,255,255,0.04)" : "rgba(196,154,44,0.04)", border: dm ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(196,154,44,0.1)" }}>
                      <div className="flex items-center gap-1.5 mb-0.5">{row.icon}<span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em", color: dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>{row.label}</span></div>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.75)" : "#1c0a00", wordBreak: "break-all" }}>{row.val}</p>
                    </div>
                  ))}
                </div>

                {/* Address */}
                {detailTailor.address && (
                  <div className="rounded-lg px-3 py-2 mb-4" style={{ background: dm ? "rgba(255,255,255,0.04)" : "rgba(196,154,44,0.04)", border: dm ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(196,154,44,0.1)" }}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <FaMapMarkerAlt size={9} color="#c49a2c"/>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em", color: dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>Address</span>
                    </div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>{detailTailor.address}</p>
                  </div>
                )}

                {/* Shop Address */}
                {detailTailor.shopAddress && (
                  <div className="rounded-lg px-3 py-2 mb-4" style={{ background: dm ? "rgba(255,255,255,0.04)" : "rgba(196,154,44,0.04)", border: dm ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(196,154,44,0.1)" }}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <FaStore size={9} color="#c49a2c"/>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em", color: dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>Shop Address</span>
                    </div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>{detailTailor.shopAddress}</p>
                  </div>
                )}

                {/* Other Info */}
                {detailTailor.otherInfo && (
                  <div className="rounded-lg px-3 py-2 mb-4" style={{ background: dm ? "rgba(255,255,255,0.04)" : "rgba(196,154,44,0.04)", border: dm ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(196,154,44,0.1)" }}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <FaInfoCircle size={9} color="#c49a2c"/>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em", color: dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>About</span>
                    </div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>{detailTailor.otherInfo}</p>
                  </div>
                )}

                {/* Social links */}
                {detailTailor.socialLinks?.length > 0 && (
                  <div className="flex gap-2 mb-5">
                    {detailTailor.socialLinks.map((l,i) => (
                      <a key={i} href={l.url} target="_blank" rel="noreferrer"
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: dm ? "rgba(255,255,255,0.07)" : "rgba(196,154,44,0.08)", border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)", color: dm ? "rgba(196,154,44,0.8)" : "#92400e" }}>
                        {platformIcons[l.platform] || <FaGlobe size={11}/>}
                      </a>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <motion.a href={`mailto:${detailTailor.email}`} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full rounded-xl py-3"
                  style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em", boxShadow: "0 6px 18px rgba(196,154,44,0.35)", textDecoration: "none" }}>
                  <FaEnvelope size={12}/> Contact Tailor
                </motion.a>

                {/* ─── REVIEWS SECTION ──────────────────────────────────── */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ height: "1px", background: dm ? "rgba(255,255,255,0.07)" : "rgba(196,154,44,0.12)", marginBottom: "14px" }}/>

                  <div className="flex items-center justify-between mb-3">
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: dm ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", margin: 0 }}>
                      Customer Reviews ({modalReviews.length})
                    </p>
                    {modalReviews.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <RatingStars rating={detailTailor.rating ?? 0} size={10}/>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, color: "#f59e0b" }}>
                          {(detailTailor.rating ?? 0).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {reviewsLoading && (
                    <div className="flex justify-center py-5">
                      <div className="w-5 h-5 rounded-full border-2"
                        style={{ borderColor: "rgba(196,154,44,0.25)", borderTopColor: "#c49a2c", animation: "spin 0.7s linear infinite" }}/>
                    </div>
                  )}

                  {!reviewsLoading && modalReviews.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 rounded-xl"
                      style={{ background: dm ? "rgba(255,255,255,0.02)" : "rgba(196,154,44,0.03)", border: dm ? "1px dashed rgba(255,255,255,0.08)" : "1px dashed rgba(196,154,44,0.2)" }}>
                      <GiSewingNeedle size={22} color={dm ? "rgba(196,154,44,0.25)" : "rgba(196,154,44,0.3)"}/>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)", marginTop: "8px" }}>
                        No reviews yet — be the first!
                      </p>
                    </div>
                  )}

                  {!reviewsLoading && modalReviews.length > 0 && (
                    <div className="reviews-scroll" style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "260px", overflowY: "auto", paddingRight: "4px" }}>
                      {modalReviews.map((r: ReviewDoc) => (
                        <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                          style={{ borderRadius: "10px", padding: "10px 12px", background: dm ? "rgba(255,255,255,0.04)" : "rgba(196,154,44,0.04)", border: dm ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(196,154,44,0.1)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: r.review ? "6px" : "0" }}>
                            <RatingStars rating={r.star} size={11}/>
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: dm ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
                              {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          {r.review && (
                            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "13px", fontStyle: "italic", color: dm ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)", lineHeight: 1.55, margin: 0 }}>
                              "{r.review}"
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tailor Card ──────────────────────────────────────────────────────────────
function TailorCard({ tailor, dm, saved, onSave, onView }: {
  tailor: TailorProfile; dm: boolean; saved: boolean; onSave: () => void; onView: () => void;
}) {
  const exp = yearsExp(tailor.since);
  const rating = tailor.rating ?? 0;
  const reviews = tailor.reviewCount ?? 0;

  const displayCity = (tailor.workType === "Shop" || tailor.workType === "Both") && tailor.shopCity
    ? tailor.shopCity : tailor.city;

  const workIcon = tailor.workType === "Home" ? <FaHome size={9}/> : tailor.workType === "Shop" ? <FaStore size={9}/> : <><FaHome size={9}/><FaStore size={9}/></>;

  return (
    <div className="tp-card rounded-2xl relative"
      style={{ background: dm ? "rgba(15,12,30,0.97)" : "rgba(255,255,255,0.98)", border: dm ? "1px solid rgba(196,154,44,0.18)" : "1px solid rgba(196,154,44,0.15)", boxShadow: dm ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(196,154,44,0.1)" }}>
      <div className="tp-shine"/>

      {/* Top band */}
      <div className="h-16 relative overflow-hidden"
        style={{ background: dm ? "linear-gradient(135deg,#1a1230,#2d1f0a)" : "linear-gradient(135deg,#92400e,#c49a2c)" }}>
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: "white", transform: "translate(30%,-30%)" }}/>
        <button onClick={onSave} className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: saved ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.2s" }}>
          <FaHeart size={10} color={saved ? "white" : "rgba(255,255,255,0.6)"}/>
        </button>
        <div className="absolute bottom-2 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.85)", letterSpacing: "0.05em" }}>
            {workIcon} {tailor.workType}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="px-4" style={{ marginTop: "8px", marginBottom: "8px", position: "relative", zIndex: 10 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden",
          border: "2.5px solid rgba(196,154,44,0.5)", boxShadow: "0 4px 12px rgba(0,0,0,0.25)" }}>
          <img
            src={tailor.profilePic && tailor.profilePic !== "nopic.jpg" ? tailor.profilePic : defaultAvatar}
            alt={tailor.name} className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="mb-1">
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", fontWeight: 700, color: dm ? "white" : "#1c0a00", lineHeight: 1.2 }}>{tailor.name}</h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md mt-1"
            style={{ background: dm ? "rgba(196,154,44,0.1)" : "rgba(196,154,44,0.08)", border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.15)", fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#c49a2c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <FaBriefcase size={8}/> {tailor.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 mb-2">
          <RatingStars rating={rating} size={11}/>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, color: "#f59e0b" }}>{rating.toFixed(1)}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>({reviews} reviews)</span>
        </div>

        {tailor.speciality && (
          <p className="flex items-center gap-1.5 mb-2" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" }}>
            <GiSewingNeedle size={10} color="#c49a2c"/> {tailor.speciality}
          </p>
        )}

        <div style={{ height: "1px", background: dm ? "rgba(255,255,255,0.06)" : "rgba(196,154,44,0.1)", margin: "8px 0" }}/>

        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <FaMapMarkerAlt size={9} color="#c49a2c"/>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>{displayCity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt size={9} color="#c49a2c"/>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>{exp}+ yrs exp</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <FaPhone size={9} color="#c49a2c"/>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>{tailor.contact}</span>
          </div>
        </div>

        {tailor.socialLinks?.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {tailor.socialLinks.map((l,i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer"
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: dm ? "rgba(255,255,255,0.07)" : "rgba(196,154,44,0.08)", border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.15)", color: dm ? "rgba(196,154,44,0.8)" : "#92400e" }}>
                {platformIcons[l.platform] || <FaGlobe size={9}/>}
              </a>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <motion.button onClick={onView} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5"
            style={{ background: dm ? "rgba(196,154,44,0.1)" : "rgba(196,154,44,0.08)", border: dm ? "1px solid rgba(196,154,44,0.25)" : "1px solid rgba(196,154,44,0.2)", color: dm ? "#fbbf24" : "#92400e", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
            <FaIdCard size={10}/> View Profile
          </motion.button>
          <motion.a href={`mailto:${tailor.email}`} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5"
            style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", boxShadow: "0 4px 12px rgba(196,154,44,0.3)", textDecoration: "none" }}>
            <FaEnvelope size={10}/> Contact
          </motion.a>
        </div>
      </div>
    </div>
  );
}
