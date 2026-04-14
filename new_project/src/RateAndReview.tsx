import { useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaPen, FaCheck, FaRedo, FaPhone, FaCut } from "react-icons/fa";
import { GiSewingNeedle, GiSewingMachine } from "react-icons/gi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useDarkMode } from "../src/context/DarkModeContext";

export default function RateAndReview() {
  //const [darkMode, setDarkMode] = useState(true); 
  const { darkMode, setDarkMode } = useDarkMode();
  const [mobile, setMobile] = useState("");
  const [tailorName, setTailorName] = useState("");
  const [nameVisible, setNameVisible] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const dm = darkMode;

  // ── onBlur → /review/findTailor ── UNCHANGED
  const handleMobileBlur = async () => {
    if (mobile.length !== 10) {
      setTailorName(""); setNameVisible(false); setNotFound(false); return;
    }
    setLookupLoading(true); setNotFound(false); setNameVisible(false);
    try {
      const res = await axios.post("https://tailor-connect-new-fovv.vercel.app//review/findTailor", { contact: mobile });
      if (res.data.status && res.data.doc) {
        setTailorName(res.data.doc.name);
        setNameVisible(true);
      } else { setNotFound(true); }
    } catch { setNotFound(true); }
    finally { setLookupLoading(false); }
  };

  // ── Submit → /review/create ── UNCHANGED
  const handleSubmit = async () => {
    if (!nameVisible || selectedStar === 0) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }
    setSubmitLoading(true);
    try {
      await axios.post("https://tailor-connect-new-fovv.vercel.app//review/create", {
        tailorContact: mobile, star: selectedStar, review,
      });
      setTimeout(() => { setSubmitted(true); setSubmitLoading(false); }, 500);
    } catch (err: any) {
      setSubmitLoading(false);
      alert(err.response?.data?.msg || "Something went wrong!");
    }
  };

  const handleReset = () => {
    setMobile(""); setTailorName(""); setNameVisible(false);
    setHoveredStar(0); setSelectedStar(0); setReview("");
    setSubmitted(false); setNotFound(false);
  };

  const starLabels = ["Terrible", "Bad", "Okay", "Good", "Excellent"];
  const activeStar = hoveredStar || selectedStar;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
      style={{
        background: dm
          ? "linear-gradient(135deg,#0d0d1a 0%,#1a1230 50%,#0d1a0d 100%)"
          : "linear-gradient(135deg,#fef3c7 0%,#fff7ed 40%,#fdf4ff 100%)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(8deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(-6deg)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.93) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes successPop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15);opacity:1} 100%{transform:scale(1)} }
        @keyframes starPulse { 0%{transform:scale(1)} 50%{transform:scale(1.35)} 100%{transform:scale(1)} }
        @keyframes spinSlow { to{transform:rotate(360deg)} }
        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }

        .float-a { animation: floatA 4s ease-in-out infinite; }
        .float-b { animation: floatB 5.5s ease-in-out infinite; }
        .cut-spin { animation: spinSlow 8s linear infinite; display: inline-block; }
        .card-in  { animation: scaleIn 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fade-up  { animation: fadeSlideUp 0.4s ease forwards; }
        .shake    { animation: shake 0.5s ease; }
        .star-pop { animation: starPulse 0.3s ease; }

        .lbl {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          display: block; margin-bottom: 6px;
        }

        .rr-input {
          width: 100%; border-radius: 10px;
          padding: 11px 14px 11px 40px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: all 0.25s ease;
        }
        .rr-input:focus { transform: translateY(-1px); }
        .rr-textarea {
          width: 100%; border-radius: 10px;
          padding: 11px 14px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: all 0.25s ease;
          resize: none; line-height: 1.6;
        }
        .rr-textarea:focus { transform: translateY(-1px); }

        .submit-btn {
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.06em;
          transition: all 0.3s ease;
          cursor: pointer; border: none;
        }
        .submit-btn::after {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transition: left 0.5s ease;
        }
        .submit-btn:hover::after { left: 100%; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(196,154,44,0.4); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .star-btn { transition: transform 0.15s ease, filter 0.15s ease; cursor: pointer; background: none; border: none; padding: 2px; }
        .star-btn:hover { transform: scale(1.25); }

        .mode-btn { transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer; border: none; }
        .mode-btn:hover { transform: scale(1.15) rotate(15deg); }

        .feat-pill {
          display: inline-flex; align-items: center;
          padding: 4px 10px; border-radius: 8px; margin: 3px;
          font-family: 'DM Sans', sans-serif; font-size: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.82);
        }
      `}</style>

      {/* Card */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl card-in"
        style={{
          background: dm ? "rgba(15,12,30,0.97)" : "rgba(255,255,255,0.98)",
          border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: dm
            ? "0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(196,154,44,0.1)"
            : "0 40px 80px rgba(196,154,44,0.12),inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >

        {/* ════ LEFT PANEL ════ */}
        <div
          className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center relative overflow-hidden p-10"
          style={{
            background: dm
              ? "linear-gradient(145deg,#1a1230 0%,#2d1f0a 50%,#1a1230 100%)"
              : "linear-gradient(145deg,#92400e 0%,#c49a2c 40%,#78350f 100%)",
          }}
        >
          {/* Floating icons */}
          <div className="float-a absolute top-12 left-8" style={{ opacity: 0.2 }}>
            <GiSewingNeedle size={38} color={dm ? "#fbbf24" : "white"} />
          </div>
          <div className="float-b absolute top-20 right-8" style={{ opacity: 0.14 }}>
            <span className="cut-spin"><FaCut size={26} color={dm ? "#fbbf24" : "white"} /></span>
          </div>
          <div className="float-a absolute bottom-28 left-10" style={{ opacity: 0.16, animationDelay: "0.8s" }}>
            <GiSewingMachine size={32} color={dm ? "#fbbf24" : "white"} />
          </div>
          <div className="float-b absolute bottom-12 right-8" style={{ opacity: 0.14, animationDelay: "1.5s" }}>
            <FaPen size={22} color={dm ? "#fbbf24" : "white"} />
          </div>

          {/* Blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full"
            style={{ background: dm ? "#fbbf24" : "white", opacity: 0.07, transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full"
            style={{ background: dm ? "#fbbf24" : "white", opacity: 0.06, transform: "translate(-30%,30%)" }} />

          {/* Content */}
          <div className="relative z-10 text-center fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(10px)" }}>
              <FaStar size={10} color="#fde68a" />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>
                Rate & Review
              </span>
            </div>

            {/* Big star display */}
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(s => (
                <FaStar key={s} size={28}
                  color={s <= (activeStar || 3) ? "#fbbf24" : "rgba(255,255,255,0.2)"}
                  style={{ transition: "color 0.2s ease", filter: s <= (activeStar || 3) ? "drop-shadow(0 0 6px rgba(251,191,36,0.5))" : "none" }}
                />
              ))}
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: "12px" }}>
              Share Your<br />
              <span style={{ background: "linear-gradient(135deg,#fbbf24,#fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Experience
              </span>
            </h1>

            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.58)", lineHeight: 1.7, maxWidth: "200px", margin: "0 auto 20px" }}>
              Help others find the best tailors. Your review makes a difference.
            </p>

            <div>
              {["✂️ Honest Review", "⭐ Star Rating", "👤 Verified Tailor"].map((f, i) => (
                <span key={i} className="feat-pill">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-10 relative">

          {/* Dark mode toggle */}
          <div className="absolute top-5 right-5">
            <button onClick={() => setDarkMode(!dm)} className="mode-btn w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: dm ? "rgba(196,154,44,0.14)" : "rgba(146,64,14,0.07)",
                border: dm ? "1px solid rgba(196,154,44,0.28)" : "1px solid rgba(146,64,14,0.14)",
                color: dm ? "#fbbf24" : "#92400e", fontSize: "15px",
              }}>
              {dm ? <BsSun /> : <BsMoon />}
            </button>
          </div>

          {/* Mobile logo (sm screens) */}
          <div className="flex items-center gap-2 mb-5 lg:hidden">
            <FaCut style={{ color: "#c49a2c" }} size={14} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "17px", color: dm ? "#fbbf24" : "#92400e" }}>
              TailorConnect
            </span>
          </div>

          {!submitted ? (
            <div className={shakeError ? "shake" : ""}>
              {/* Heading */}
              <div className="mb-6 pr-10">
                <p className="lbl" style={{ color: "#c49a2c" }}>Your Feedback</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, lineHeight: 1.1, color: dm ? "white" : "#1c0a00", marginBottom: "4px" }}>
                  Rate & Review
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.35)" }}>
                  Enter the tailor's number to get started
                </p>
              </div>

              <div className="space-y-5">
                {/* Mobile input */}
                <div>
                  <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Tailor's Mobile Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2" size={12}
                      style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                    <input
                      type="tel" maxLength={10} value={mobile}
                      onChange={e => { setMobile(e.target.value.replace(/\D/g,"")); setNameVisible(false); setNotFound(false); }}
                      onBlur={handleMobileBlur}
                      placeholder="Enter 10-digit number"
                      className="rr-input"
                      style={{
                        background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)",
                        border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                        color: dm ? "white" : "#1c0a00",
                      }}
                    />
                    {lookupLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2"
                        style={{ borderColor: "#c49a2c", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                    )}
                  </div>

                  {/* Verified badge */}
                  {nameVisible && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg fade-up"
                      style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}>
                      <span style={{ fontSize: "13px" }}>👤</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: dm ? "rgba(255,255,255,0.85)" : "#1c0a00" }}>
                        {tailorName}
                      </span>
                      <div className="ml-auto flex items-center gap-1">
                        <FaCheck size={9} color="#4ade80" />
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#4ade80", letterSpacing: "0.05em" }}>
                          verified
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Not found */}
                  {notFound && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg fade-up"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                      <span style={{ fontSize: "12px" }}>⚠️</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#f87171" }}>
                        No tailor found with this number
                      </span>
                    </div>
                  )}
                </div>

                {/* Star rating */}
                <div>
                  <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Rate Your Experience</label>
                  <div className="flex items-center gap-1.5 mb-2">
                    {[1,2,3,4,5].map((star) => {
                      const filled = star <= activeStar;
                      return (
                        <button
                          key={star}
                          className={`star-btn ${selectedStar === star ? "star-pop" : ""}`}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setSelectedStar(star)}
                        >
                          {filled
                            ? <FaStar size={32} color="#fbbf24" style={{ filter: "drop-shadow(0 0 4px rgba(251,191,36,0.5))" }} />
                            : <FaRegStar size={32} color={dm ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"} />
                          }
                        </button>
                      );
                    })}
                  </div>
                  {activeStar > 0 && (
                    <p className="fade-up" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#fbbf24", letterSpacing: "0.06em" }}>
                      {starLabels[activeStar - 1]}
                    </p>
                  )}
                </div>

                {/* Review textarea */}
                <div>
                  <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Write Your Review</label>
                  <textarea
                    value={review}
                    onChange={e => setReview(e.target.value.slice(0, 300))}
                    placeholder="Tell others about your experience..."
                    rows={4}
                    className="rr-textarea"
                    style={{
                      background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)",
                      border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                      color: dm ? "white" : "#1c0a00",
                    }}
                  />
                  <p className="text-right" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)", marginTop: "4px" }}>
                    {review.length}/300
                  </p>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="submit-btn w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#c49a2c 0%,#92400e 100%)", fontSize: "13px", letterSpacing: "0.08em" }}
                >
                  {submitLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white" style={{ borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <FaPen size={12} /> PUBLISH REVIEW
                    </>
                  )}
                </button>
              </div>
            </div>

          ) : (
            /* ── Success screen ── */
            <div className="text-center fade-up py-4">
              <div style={{ fontSize: "56px", animation: "successPop 0.6s ease forwards", marginBottom: "12px" }}>🎉</div>

              <p className="lbl" style={{ color: "#c49a2c" }}>Thank you!</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", fontWeight: 700, color: dm ? "white" : "#1c0a00", marginBottom: "8px" }}>
                Review Published!
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: dm ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)", marginBottom: "16px" }}>
                You reviewed{" "}
                <span style={{ color: dm ? "white" : "#1c0a00", fontWeight: 600 }}>{tailorName}</span>
              </p>

              {/* Stars display */}
              <div className="flex justify-center gap-1.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={22}
                    color={i < selectedStar ? "#fbbf24" : (dm ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)")}
                    style={{
                      filter: i < selectedStar ? "drop-shadow(0 0 5px rgba(251,191,36,0.5))" : "none",
                      animation: i < selectedStar ? `successPop 0.4s ${i * 0.09}s ease both` : "none",
                    }}
                  />
                ))}
              </div>

              {/* Review quote */}
              {review && (
                <div className="mx-auto mb-6 px-5 py-4 rounded-xl max-w-xs"
                  style={{ background: dm ? "rgba(196,154,44,0.08)" : "rgba(196,154,44,0.06)", border: dm ? "1px solid rgba(196,154,44,0.15)" : "1px solid rgba(196,154,44,0.15)" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", fontStyle: "italic", color: dm ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)", lineHeight: 1.6 }}>
                    "{review}"
                  </p>
                </div>
              )}

              <button
                onClick={handleReset}
                className="submit-btn inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold"
                style={{ background: "linear-gradient(135deg,#c49a2c 0%,#92400e 100%)", fontSize: "12px", letterSpacing: "0.08em" }}
              >
                <FaRedo size={11} /> Write Another Review
              </button>
            </div>
          )}

          {/* Footer brand */}
          <div className="flex items-center gap-3 mt-7">
            <div className="flex-1 h-px" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
            <div className="flex items-center gap-1.5">
              <FaCut size={8} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)" }} />
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "10px", color: dm ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)", letterSpacing: "0.12em" }}>
                TAILORCONNECT
              </span>
              <FaCut size={8} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)", transform: "scaleX(-1)" }} />
            </div>
            <div className="flex-1 h-px" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
