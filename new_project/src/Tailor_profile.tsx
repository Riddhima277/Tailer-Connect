import React, { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaBriefcase,
  FaCalendarAlt, FaMapMarkerAlt, FaLink, FaInstagram,
  FaYoutube, FaFacebook, FaGlobe, FaTimes, FaSearch,
  FaSave, FaEdit, FaTrash, FaCut, FaStore, FaUserTie,
  FaCamera, FaMoon, FaSun, FaCity,
} from "react-icons/fa";
import { GiSewingNeedle, GiSewingMachine, GiSewingString } from "react-icons/gi";
import { useDarkMode } from "../src/context/DarkModeContext";

// ─── API Base URL ─────────────────────────────────────────────────────────────
const API_BASE = "https://tailor-connect-new-mvxq.vercel.app";

const platformOptions = ["Website", "Instagram", "Facebook", "YouTube"];

const platformIcons: Record<string, React.ReactNode> = {
  Website:   <FaGlobe size={12} />,
  Instagram: <FaInstagram size={12} />,
  Facebook:  <FaFacebook size={12} />,
  YouTube:   <FaYoutube size={12} />,
};

interface SocialLink { platform: string; url: string; }

interface FormType {
  profilePic: string; email: string; name: string; contact: string;
  aadhaarFile: File | null; aadhaarPreview: string; address: string;
  city: string; aadhaarNo: string; category: string; speciality: string;
  dob: string; since: string; gender: string; workType: string;
  shopAddress: string; otherInfo: string; socialLinks: SocialLink[]; shopCity: string;
}

const defaultSvgAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d1f0a"/>
      <stop offset="100%" stop-color="#1a1230"/>
    </radialGradient>
    <radialGradient id="skin" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#f5cba7"/>
      <stop offset="100%" stop-color="#e59866"/>
    </radialGradient>
    <linearGradient id="shirt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c49a2c"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="100" fill="url(#bg)"/>
  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(196,154,44,0.12)" stroke-width="1"/>
  <ellipse cx="100" cy="178" rx="55" ry="40" fill="url(#shirt)" clip-path="url(#c)"/>
  <clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath>
  <ellipse cx="100" cy="168" rx="42" ry="32" fill="url(#shirt)"/>
  <path d="M84 148 Q100 160 116 148 L112 164 Q100 172 88 164 Z" fill="#78350f"/>
  <rect x="92" y="128" width="16" height="22" rx="8" fill="url(#skin)"/>
  <ellipse cx="100" cy="112" rx="33" ry="35" fill="url(#skin)"/>
  <ellipse cx="100" cy="82" rx="33" ry="15" fill="#3d2008"/>
  <ellipse cx="69" cy="99" rx="7" ry="13" fill="#3d2008"/>
  <ellipse cx="131" cy="99" rx="7" ry="13" fill="#3d2008"/>
  <ellipse cx="88" cy="110" rx="5.5" ry="6.5" fill="white"/>
  <ellipse cx="112" cy="110" rx="5.5" ry="6.5" fill="white"/>
  <ellipse cx="89" cy="111" rx="3.5" ry="4" fill="#3d2008"/>
  <ellipse cx="113" cy="111" rx="3.5" ry="4" fill="#3d2008"/>
  <circle cx="90" cy="109" r="1.2" fill="white" opacity="0.9"/>
  <circle cx="114" cy="109" r="1.2" fill="white" opacity="0.9"/>
  <path d="M83 103 Q89 100 95 102" stroke="#3d2008" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M105 102 Q111 100 117 103" stroke="#3d2008" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M98 114 Q96 121 100 122 Q104 121 102 114" stroke="#d4956a" stroke-width="1.5" fill="none"/>
  <path d="M91 127 Q100 134 109 127" stroke="#c0734a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="80" cy="122" rx="6" ry="3.5" fill="#f0a07a" opacity="0.3"/>
  <ellipse cx="120" cy="122" rx="6" ry="3.5" fill="#f0a07a" opacity="0.3"/>
  <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(196,154,44,0.4)" stroke-width="1.5">
    <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite"/>
  </circle>
  <path d="M28 38 L30 32 L32 38 L38 40 L32 42 L30 48 L28 42 L22 40 Z" fill="#fbbf24" opacity="0.7">
    <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="2.5s" repeatCount="indefinite"/>
  </path>
  <path d="M163 28 L165 23 L167 28 L172 30 L167 32 L165 37 L163 32 L158 30 Z" fill="#fde68a" opacity="0.7">
    <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="3.2s" repeatCount="indefinite"/>
  </path>
  <circle cx="168" cy="65" r="2.5" fill="#c49a2c">
    <animate attributeName="r" values="1.5;3.5;1.5" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>
`)}`;

const TABS = ["personal", "professional", "contact"] as const;
type Tab = typeof TABS[number];

export default function ProfileTailor() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [form, setForm] = useState<FormType>({
    profilePic: "", email: "", name: "", contact: "",
    aadhaarFile: null, aadhaarPreview: "", address: "", city: "",
    aadhaarNo: "", category: "", speciality: "", dob: "", since: "",
    gender: "", workType: "", shopAddress: "", otherInfo: "",
    socialLinks: [], shopCity: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [ocrLoading, setOcrLoading] = useState(false);

  const dm = darkMode;

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, profilePic: URL.createObjectURL(file) });
  };

  const handleAadhaarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, aadhaarFile: file, aadhaarPreview: previewURL }));
    setOcrLoading(true);
    try {
      const formData = new FormData();
      formData.append("aadhaarFile", file);
      const res = await axios.post(`${API_BASE}/tailor/extract-aadhaar`, formData, {
        headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" },
      });
      if (res.data.status) {
        const { extracted, previewUrl } = res.data;
        setForm((prev) => ({
          ...prev,
          aadhaarPreview: previewUrl || prev.aadhaarPreview,
          aadhaarNo:      extracted.aadhaarNo  || prev.aadhaarNo,
          gender:         extracted.gender     || prev.gender,
          address:        extracted.address    || prev.address,
          city:           extracted.city       || prev.city,
        }));
      }
    } catch (err) {
      console.log("OCR extract failed", err);
    } finally {
      setOcrLoading(false);
    }
  };

  const handlePlatformSelect = (platform: string) => {
    if (form.socialLinks.find((p) => p.platform === platform)) return;
    setForm({ ...form, socialLinks: [...form.socialLinks, { platform, url: "" }] });
  };

  const handleLinkChange = (index: number, value: string) => {
    const updated = [...form.socialLinks];
    updated[index].url = value;
    setForm({ ...form, socialLinks: updated });
  };

  const removePlatform = (index: number) => {
    setForm({ ...form, socialLinks: form.socialLinks.filter((_, i) => i !== index) });
  };

  const handleSearch = async () => {
    if (!form.email) { alert("Enter email first"); return; }
    try {
      const response = await axios.post(`${API_BASE}/tailor/find`, { email: form.email }, authHeader());
      if (!response.data.status) { alert("Tailor not found"); return; }
      const data = response.data.doc;
      setForm({ ...form, ...data, profilePic: data.profilePic || "", aadhaarPreview: data.aadhaarFile || "", socialLinks: data.socialLinks || [] });
      setIsSaved(true);
      alert("Profile Loaded Successfully!");
    } catch (error: any) {
      console.log(error.response?.data);
      alert("Search failed");
    }
  };

  const handleDelete = async () => {
    if (!form.email) return alert("Enter email to delete");
    try {
      const response = await axios.post(`${API_BASE}/tailor/delete`, { email: form.email }, authHeader());
      alert(response.data.msg);
      setIsSaved(false);
      setForm({
        profilePic: "", email: "", name: "", contact: "",
        aadhaarFile: null, aadhaarPreview: "", address: "", city: "",
        aadhaarNo: "", category: "", speciality: "", dob: "", since: "",
        gender: "", workType: "", shopAddress: "", otherInfo: "",
        socialLinks: [], shopCity: "",
      });
    } catch (error: any) {
      alert(error.response?.data?.msg || "Error deleting profile");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.name) newErrors.name = "Full name is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.contact) newErrors.contact = "Contact number required";
    else if (!/^[0-9]{10}$/.test(form.contact)) newErrors.contact = "Enter valid 10 digit number";
    if (!form.aadhaarNo) newErrors.aadhaarNo = "Aadhaar number required";
    else if (!/^[0-9]{12}$/.test(form.aadhaarNo)) newErrors.aadhaarNo = "Enter valid 12 digit Aadhaar";
    if (!form.category) newErrors.category = "Select category";
    if (!form.since) newErrors.since = "Work start date required";
    if (!form.workType) newErrors.workType = "Select work type";
    if (!form.city) newErrors.city = "City required";
    if (!form.address) newErrors.address = "Address required";
    if (form.workType === "Shop" || form.workType === "Both") {
      if (!form.shopAddress) newErrors.shopAddress = "Shop address required";
      if (!form.shopCity) newErrors.shopCity = "Shop city required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      formData.append("email", form.email); formData.append("name", form.name);
      formData.append("contact", form.contact); formData.append("aadhaarNo", form.aadhaarNo);
      formData.append("address", form.address); formData.append("city", form.city);
      formData.append("category", form.category); formData.append("speciality", form.speciality);
      formData.append("dob", form.dob); formData.append("since", form.since);
      formData.append("gender", form.gender); formData.append("workType", form.workType);
      formData.append("shopAddress", form.shopAddress); formData.append("shopCity", form.shopCity);
      formData.append("otherInfo", form.otherInfo);
      if (form.aadhaarFile) formData.append("aadhaarFile", form.aadhaarFile);
      if (form.profilePic) {
        const response = await fetch(form.profilePic);
        const blob = await response.blob();
        formData.append("profilePic", blob);
      }
      formData.append("socialLinks", JSON.stringify(form.socialLinks));

      const url = !isSaved
        ? `${API_BASE}/tailor/create`
        : `${API_BASE}/tailor/update`;

      await axios.post(url, formData, {
        headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" },
      });

      if (!isSaved) { alert("Profile Saved Successfully!"); setIsSaved(true); }
      else alert("Profile Updated Successfully!");
    } catch (error: any) {
      console.log(error.response?.data);
      alert(error.response?.data?.msg || "Something went wrong!");
    }
  };

  const inputStyle: React.CSSProperties = {
    background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)",
    border: `1px solid ${dm ? "rgba(255,255,255,0.1)" : "rgba(196,154,44,0.25)"}`,
    color: dm ? "white" : "#1c0a00",
  };
  const errInputStyle: React.CSSProperties = {
    ...inputStyle,
    border: "1px solid rgba(239,68,68,0.6)",
  };
  const selectOptStyle = (hasVal: boolean): React.CSSProperties => ({
    ...inputStyle,
    appearance: "none" as any,
    cursor: "pointer",
    color: hasVal ? (dm ? "white" : "#1c0a00") : (dm ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"),
    background: dm ? "#1e1630" : "rgba(146,64,14,0.04)",
  });

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

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

        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(8deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(-6deg)} }
        @keyframes floatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spinSlow { to{transform:rotate(360deg)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulseRing {
          0%  {box-shadow:0 0 0 0 rgba(196,154,44,0.45)}
          70% {box-shadow:0 0 0 12px rgba(196,154,44,0)}
          100%{box-shadow:0 0 0 0 rgba(196,154,44,0)}
        }

        .float-a{animation:floatA 4s ease-in-out infinite}
        .float-b{animation:floatB 5.5s ease-in-out infinite}
        .float-c{animation:floatC 3.5s ease-in-out infinite}
        .spin-slow{animation:spinSlow 8s linear infinite;display:inline-block}
        .avatar-pulse{animation:pulseRing 2.5s ease infinite}
        .ocr-spin{animation:spin 0.8s linear infinite}

        .tp-input {
          width:100%; padding:10px 14px 10px 40px;
          border-radius:10px; font-family:'DM Sans',sans-serif;
          font-size:13px; outline:none; transition:all 0.25s ease;
        }
        .tp-input:focus{transform:translateY(-1px)}
        .tp-input-bare {
          width:100%; padding:10px 14px;
          border-radius:10px; font-family:'DM Sans',sans-serif;
          font-size:13px; outline:none; transition:all 0.25s ease;
        }
        .tp-input-bare:focus{transform:translateY(-1px)}

        .lbl {
          font-family:'DM Sans',sans-serif; font-size:11px;
          font-weight:600; letter-spacing:0.07em;
          text-transform:uppercase; display:block; margin-bottom:5px;
        }

        .tab-btn {
          font-family:'DM Sans',sans-serif; font-size:12px;
          font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
          padding:8px 16px; border-radius:8px; border:none;
          cursor:pointer; transition:all 0.25s ease;
        }

        .action-btn {
          position:relative; overflow:hidden;
          font-family:'DM Sans',sans-serif; font-size:13px;
          font-weight:600; letter-spacing:0.05em;
          transition:all 0.3s ease; cursor:pointer;
          border:none; border-radius:10px;
          padding:12px 20px; display:flex;
          align-items:center; justify-content:center; gap:8px;
        }
        .action-btn::after {
          content:''; position:absolute;
          top:0; left:-100%; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transition:left 0.5s ease;
        }
        .action-btn:hover::after{left:100%}
        .action-btn:hover{transform:translateY(-2px)}
        .action-btn:active{transform:translateY(0)}

        .mode-btn{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;border:none}
        .mode-btn:hover{transform:scale(1.15) rotate(15deg)}

        .platform-btn {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:20px; font-family:'DM Sans',sans-serif;
          font-size:11px; cursor:pointer; transition:all 0.2s ease; border:none;
        }
        .platform-btn:hover{transform:translateY(-1px)}

        .feat-pill {
          display:inline-flex; align-items:center;
          padding:4px 10px; border-radius:8px; margin:3px;
          font-family:'DM Sans',sans-serif; font-size:10px;
          background:rgba(255,255,255,0.1);
          border:1px solid rgba(255,255,255,0.15);
          color:rgba(255,255,255,0.82);
        }

        .section-div{height:1px;margin:16px 0}
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row transition-colors duration-500"
        style={{
          background: dm ? "rgba(15,12,30,0.97)" : "rgba(255,255,255,0.98)",
          border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: dm
            ? "0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(196,154,44,0.1)"
            : "0 40px 80px rgba(196,154,44,0.12),inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {/* ══════════ LEFT DECORATIVE PANEL ══════════ */}
        <div
          className="hidden lg:flex lg:w-[280px] flex-shrink-0 flex-col items-center justify-between relative overflow-hidden py-10 px-7"
          style={{
            background: dm
              ? "linear-gradient(145deg,#1a1230 0%,#2d1f0a 50%,#1a1230 100%)"
              : "linear-gradient(145deg,#92400e 0%,#c49a2c 40%,#78350f 100%)",
          }}
        >
          <div className="float-a absolute top-10 left-6" style={{ opacity: 0.18 }}>
            <GiSewingMachine size={36} color={dm ? "#fbbf24" : "white"} />
          </div>
          <div className="float-b absolute top-24 right-5" style={{ opacity: 0.14 }}>
            <span className="spin-slow"><FaCut size={26} color={dm ? "#fbbf24" : "white"} /></span>
          </div>
          <div className="float-c absolute bottom-32 left-8" style={{ opacity: 0.16 }}>
            <GiSewingNeedle size={32} color={dm ? "#fbbf24" : "white"} />
          </div>
          <div className="float-a absolute bottom-14 right-6" style={{ opacity: 0.14, animationDelay: "1.2s" }}>
            <GiSewingString size={28} color={dm ? "#fbbf24" : "white"} />
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full"
            style={{ background: dm ? "#fbbf24" : "white", opacity: 0.07, transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full"
            style={{ background: dm ? "#fbbf24" : "white", opacity: 0.06, transform: "translate(-30%,30%)" }} />

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(10px)" }}>
              <FaUserTie size={9} color="#fde68a" />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>
                Tailor Profile
              </span>
            </div>

            <div className="relative mb-3">
              <motion.div whileHover={{ scale: 1.06 }} className="avatar-pulse w-28 h-28 rounded-full overflow-hidden"
                style={{ border: "3px solid rgba(251,191,36,0.6)" }}>
                <img src={form.profilePic || defaultSvgAvatar} alt="profile" className="w-full h-full object-cover" />
              </motion.div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)", border: "2px solid rgba(255,255,255,0.3)" }}>
                <FaCamera size={11} color="white" />
                <input type="file" hidden accept="image/*" onChange={handleProfilePic} />
              </label>
            </div>

            <motion.h3 key={form.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 700, color: "white", textAlign: "center", marginBottom: "4px" }}>
              {form.name || "Tailor Name"}
            </motion.h3>
            <motion.p key={form.email} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", textAlign: "center" }}>
              {form.email || "email@example.com"}
            </motion.p>

            <div className="flex flex-col gap-1.5 w-full mt-2">
              {form.city && (
                <div className="flex items-center gap-2" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  <FaCity size={9} color="#fbbf24" /> {form.city}
                </div>
              )}
              {form.category && (
                <div className="flex items-center gap-2" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  <FaBriefcase size={9} color="#fbbf24" /> {form.category}
                </div>
              )}
              {form.workType && (
                <div className="flex items-center gap-2" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  <FaStore size={9} color="#fbbf24" /> {form.workType}
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-4"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.28)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: isSaved ? "#4ade80" : "#fbbf24" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: isSaved ? "#4ade80" : "#fbbf24", letterSpacing: "0.06em" }}>
                {isSaved ? "Existing Tailor" : "New Tailor"}
              </span>
            </div>
          </div>

          <div className="relative z-10 text-center">
            {["✂️ Expert", "📐 Precision", "⭐ Rated"].map((f, i) => (
              <span key={i} className="feat-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* ══════════ MAIN FORM ══════════ */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="absolute top-5 right-5 z-20">
            <button onClick={() => setDarkMode(!dm)} className="mode-btn w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: dm ? "rgba(196,154,44,0.14)" : "rgba(146,64,14,0.07)",
                border: dm ? "1px solid rgba(196,154,44,0.28)" : "1px solid rgba(146,64,14,0.14)",
                color: dm ? "#fbbf24" : "#92400e", fontSize: "15px",
              }}>
              {dm ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-y-auto" style={{ maxHeight: "92vh" }}>
            <div className="p-8 pb-4">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5 pr-10">
                <p className="lbl" style={{ color: "#c49a2c" }}>Manage Profile</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, lineHeight: 1.1, color: dm ? "white" : "#1c0a00", marginBottom: "4px" }}>
                  Tailor Profile
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: dm ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.35)" }}>
                  Search existing record or create a new tailor profile
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
                <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Email Address</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2" size={12}
                      style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="tailor@example.com"
                      className={`tp-input ${errors.email ? "border-red-400" : ""}`}
                      style={errors.email ? errInputStyle : inputStyle} />
                  </div>
                  <motion.button type="button" onClick={handleSearch}
                    whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                    className="action-btn"
                    style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)", color: "white", minWidth: "95px", boxShadow: "0 6px 18px rgba(196,154,44,0.3)" }}>
                    <FaSearch size={11} /> Search
                  </motion.button>
                </div>
                {errors.email && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.email}</p>}
              </motion.div>

              <div className="section-div" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(196,154,44,0.12)" }} />

              <div className="flex gap-2 mb-5">
                {TABS.map((tab) => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)} className="tab-btn"
                    style={{
                      background: activeTab === tab ? "linear-gradient(135deg,#c49a2c,#92400e)" : dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.05)",
                      color: activeTab === tab ? "white" : dm ? "rgba(255,255,255,0.45)" : "rgba(146,64,14,0.7)",
                      border: activeTab === tab ? "none" : dm ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(196,154,44,0.2)",
                      boxShadow: activeTab === tab ? "0 4px 14px rgba(196,154,44,0.3)" : "none",
                    }}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 px-8 pb-4 overflow-y-auto">
              <AnimatePresence mode="wait">

                {activeTab === "personal" && (
                  <motion.div key="personal" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <div>
                      <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Full Name *</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="tp-input" style={errors.name ? errInputStyle : inputStyle} />
                      </div>
                      {errors.name && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Date of Birth *</label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                          <input type="date" name="dob" value={form.dob} onChange={handleChange} className="tp-input" style={errors.dob ? errInputStyle : inputStyle} />
                        </div>
                        {errors.dob && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.dob}</p>}
                      </div>
                      <div>
                        <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Gender *</label>
                        <select name="gender" value={form.gender} onChange={handleChange} className="tp-input" style={errors.gender ? errInputStyle : selectOptStyle(!!form.gender)}>
                          <option value="" style={{ background: dm ? "#1e1630" : "white", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Select Gender</option>
                          {["Male","Female","Other"].map(g => <option key={g} value={g} style={{ background: dm ? "#1e1630" : "white", color: dm ? "white" : "#1c0a00" }}>{g}</option>)}
                        </select>
                        {errors.gender && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.gender}</p>}
                      </div>
                    </div>

                    <div className="rounded-xl p-4" style={{ background: dm ? "rgba(196,154,44,0.06)" : "rgba(196,154,44,0.05)", border: dm ? "1px solid rgba(196,154,44,0.15)" : "1px solid rgba(196,154,44,0.15)" }}>
                      <label className="lbl mb-3" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>
                        <FaIdCard className="inline mr-1.5" size={11} style={{ color: "#c49a2c" }} />
                        Aadhaar Verification
                      </label>
                      <div className="flex items-center gap-3 mb-3">
                        <label className="action-btn cursor-pointer text-xs px-4 py-2"
                          style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)", color: "white", fontSize: "11px", opacity: ocrLoading ? 0.6 : 1 }}>
                          {ocrLoading ? "Scanning..." : "Upload Aadhaar"}
                          <input type="file" hidden onChange={handleAadhaarUpload} disabled={ocrLoading} />
                        </label>
                        {ocrLoading && (
                          <div className="flex items-center gap-2">
                            <div className="ocr-spin w-4 h-4 rounded-full border-2"
                              style={{ borderColor: "#c49a2c", borderTopColor: "transparent" }} />
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>
                              Extracting data...
                            </span>
                          </div>
                        )}
                        {form.aadhaarPreview && !ocrLoading && (
                          <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={form.aadhaarPreview} alt="Aadhaar"
                            className="w-24 h-16 object-cover rounded-lg"
                            style={{ border: "1px solid rgba(196,154,44,0.4)" }}
                          />
                        )}
                      </div>
                      <div>
                        <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Aadhaar Number *</label>
                        <div className="relative">
                          <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                          <input
                            name="aadhaarNo" maxLength={12} value={form.aadhaarNo} placeholder="12-digit number"
                            onChange={(e) => setForm({ ...form, aadhaarNo: e.target.value.replace(/\D/g, "") })}
                            className="tp-input" style={errors.aadhaarNo ? errInputStyle : inputStyle}
                          />
                        </div>
                        {errors.aadhaarNo && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.aadhaarNo}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "professional" && (
                  <motion.div key="professional" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Category *</label>
                        <select name="category" value={form.category} onChange={handleChange} className="tp-input" style={errors.category ? errInputStyle : selectOptStyle(!!form.category)}>
                          <option value="" style={{ background: dm ? "#1e1630" : "white", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Select Category</option>
                          {["Men","Women","Children","Both"].map(c => <option key={c} value={c} style={{ background: dm ? "#1e1630" : "white", color: dm ? "white" : "#1c0a00" }}>{c}</option>)}
                        </select>
                        {errors.category && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.category}</p>}
                      </div>
                      <div>
                        <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Work Type *</label>
                        <select name="workType" value={form.workType} onChange={handleChange} className="tp-input" style={errors.workType ? errInputStyle : selectOptStyle(!!form.workType)}>
                          <option value="" style={{ background: dm ? "#1e1630" : "white", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Select Work Type</option>
                          {["Home","Shop","Both"].map(w => <option key={w} value={w} style={{ background: dm ? "#1e1630" : "white", color: dm ? "white" : "#1c0a00" }}>{w}</option>)}
                        </select>
                        {errors.workType && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.workType}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Speciality</label>
                      <div className="relative">
                        <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                        <input name="speciality" value={form.speciality} onChange={handleChange} placeholder="e.g. Bridal, Suits, Alterations" className="tp-input" style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Working Since *</label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                        <input type="date" name="since" value={form.since} onChange={handleChange} className="tp-input" style={errors.since ? errInputStyle : inputStyle} />
                      </div>
                      {errors.since && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.since}</p>}
                    </div>

                    {(form.workType === "Shop" || form.workType === "Both") && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Shop Address *</label>
                          <div className="relative">
                            <FaStore className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                            <input name="shopAddress" value={form.shopAddress} onChange={handleChange} placeholder="Shop address" className="tp-input" style={errors.shopAddress ? errInputStyle : inputStyle} />
                          </div>
                          {errors.shopAddress && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.shopAddress}</p>}
                        </div>
                        <div>
                          <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Shop City *</label>
                          <div className="relative">
                            <FaCity className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                            <input name="shopCity" value={form.shopCity} onChange={handleChange} placeholder="Shop city" className="tp-input" style={errors.shopCity ? errInputStyle : inputStyle} />
                          </div>
                          {errors.shopCity && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.shopCity}</p>}
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Other Info</label>
                      <textarea name="otherInfo" value={form.otherInfo} onChange={handleChange as any}
                        placeholder="Any additional information..." rows={2}
                        className="tp-input-bare resize-none" style={{ ...inputStyle, paddingLeft: "14px" }} />
                    </div>

                    <div className="rounded-xl p-4" style={{ background: dm ? "rgba(196,154,44,0.06)" : "rgba(196,154,44,0.04)", border: dm ? "1px solid rgba(196,154,44,0.15)" : "1px solid rgba(196,154,44,0.12)" }}>
                      <label className="lbl mb-3" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>
                        <FaLink className="inline mr-1.5" size={10} style={{ color: "#c49a2c" }} />
                        Social Links
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {platformOptions.map((platform) => (
                          <button key={platform} type="button" onClick={() => handlePlatformSelect(platform)} className="platform-btn"
                            style={{
                              background: form.socialLinks.find(l => l.platform === platform) ? "linear-gradient(135deg,#c49a2c,#92400e)" : dm ? "rgba(255,255,255,0.07)" : "rgba(196,154,44,0.08)",
                              border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.25)",
                              color: form.socialLinks.find(l => l.platform === platform) ? "white" : dm ? "rgba(255,255,255,0.7)" : "#92400e",
                            }}>
                            {platformIcons[platform]} {platform}
                          </button>
                        ))}
                      </div>
                      {form.socialLinks.map((link, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-center mb-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }}>
                              {platformIcons[link.platform]}
                            </span>
                            <input type="text" placeholder={`${link.platform} URL`} value={link.url}
                              onChange={(e) => handleLinkChange(index, e.target.value)} className="tp-input" style={inputStyle} />
                          </div>
                          <button type="button" onClick={() => removePlatform(index)}
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                            <FaTimes size={11} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "contact" && (
                  <motion.div key="contact" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <div>
                      <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Contact Number *</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                        <input name="contact" value={form.contact} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} className="tp-input" style={errors.contact ? errInputStyle : inputStyle} />
                      </div>
                      {errors.contact && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.contact}</p>}
                    </div>
                    <div>
                      <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>City *</label>
                      <div className="relative">
                        <FaCity className="absolute left-3 top-1/2 -translate-y-1/2" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="tp-input" style={errors.city ? errInputStyle : inputStyle} />
                      </div>
                      {errors.city && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.city}</p>}
                    </div>
                    <div>
                      <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>Full Address *</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3.5" size={11} style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                        <textarea name="address" value={form.address} onChange={handleChange as any}
                          placeholder="Street, Area, Landmark..." rows={3}
                          className="tp-input resize-none" style={errors.address ? errInputStyle : inputStyle} />
                      </div>
                      {errors.address && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#f87171", marginTop: "4px" }}>{errors.address}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-8 pb-7 pt-4">
              <div className="section-div" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(196,154,44,0.1)" }} />
              {!isSaved ? (
                <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  className="action-btn w-full"
                  style={{ background: "linear-gradient(135deg,#c49a2c 0%,#92400e 100%)", color: "white", boxShadow: "0 8px 24px rgba(196,154,44,0.35)" }}>
                  <FaSave size={13} /> Save Profile
                </motion.button>
              ) : (
                <div className="flex gap-3">
                  <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    className="action-btn flex-1"
                    style={{ background: "linear-gradient(135deg,#c49a2c 0%,#92400e 100%)", color: "white", boxShadow: "0 6px 18px rgba(196,154,44,0.3)" }}>
                    <FaEdit size={12} /> Update Profile
                  </motion.button>
                  <motion.button type="button" onClick={handleDelete} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    className="action-btn flex-1"
                    style={{ background: dm ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171" }}>
                    <FaTrash size={12} /> Delete Profile
                  </motion.button>
                </div>
              )}
              <div className="flex items-center gap-3 mt-5">
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
          </form>
        </div>
      </motion.div>
    </div>
  );
}
