import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaUser,
  FaCity,
  FaVenusMars,
  FaEnvelope,
  FaHome,
  FaMapMarker,
  FaCamera,
  FaSave,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCut,
} from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";
import { GiSewingMachine } from "react-icons/gi";
import { useDarkMode } from "../src/context/DarkModeContext";

// ─── API Base URL ─────────────────────────────────────────────────────────────
const API_BASE = "https://tailer-connect-backened.vercel.app";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
];

export default function CustomerProfile() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  const [customer, setCustomer] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    gender: "",
    profilePic: null as File | null,
  });

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setCustomer((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d1f0a"/>
      <stop offset="100%" stop-color="#1a1230"/>
    </radialGradient>
    <radialGradient id="skinGrad" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#f5cba7"/>
      <stop offset="100%" stop-color="#e59866"/>
    </radialGradient>
    <radialGradient id="shirtGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#c49a2c"/>
      <stop offset="100%" stop-color="#92400e"/>
    </radialGradient>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde68a" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#c49a2c" stop-opacity="0.2"/>
    </linearGradient>
    <clipPath id="circle">
      <circle cx="100" cy="100" r="100"/>
    </clipPath>
  </defs>
  <circle cx="100" cy="100" r="100" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(196,154,44,0.08)" stroke-width="1"/>
  <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(196,154,44,0.06)" stroke-width="1"/>
  <ellipse cx="100" cy="175" rx="52" ry="38" fill="url(#shirtGrad)" clip-path="url(#circle)"/>
  <ellipse cx="100" cy="168" rx="40" ry="30" fill="url(#shirtGrad)" clip-path="url(#circle)"/>
  <path d="M82 148 Q100 158 118 148 L114 162 Q100 170 86 162 Z" fill="#78350f" clip-path="url(#circle)"/>
  <path d="M100 150 L94 165 L100 162 L106 165 Z" fill="#92400e" clip-path="url(#circle)"/>
  <rect x="91" y="128" width="18" height="24" rx="9" fill="url(#skinGrad)"/>
  <ellipse cx="100" cy="112" rx="34" ry="36" fill="url(#skinGrad)"/>
  <ellipse cx="100" cy="82" rx="34" ry="16" fill="#3d2008"/>
  <ellipse cx="68" cy="100" rx="8" ry="14" fill="#3d2008"/>
  <ellipse cx="132" cy="100" rx="8" ry="14" fill="#3d2008"/>
  <path d="M66 94 Q68 78 100 76 Q132 78 134 94 Q130 80 100 78 Q70 80 66 94Z" fill="#4a2810"/>
  <ellipse cx="88" cy="110" rx="6" ry="7" fill="white"/>
  <ellipse cx="112" cy="110" rx="6" ry="7" fill="white"/>
  <ellipse cx="89" cy="111" rx="4" ry="4.5" fill="#3d2008"/>
  <ellipse cx="113" cy="111" rx="4" ry="4.5" fill="#3d2008"/>
  <circle cx="90" cy="109" r="1.5" fill="white" opacity="0.9"/>
  <circle cx="114" cy="109" r="1.5" fill="white" opacity="0.9"/>
  <path d="M82 103 Q88 100 94 102" stroke="#3d2008" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M106 102 Q112 100 118 103" stroke="#3d2008" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M98 114 Q96 121 100 122 Q104 121 102 114" stroke="#d4956a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M91 127 Q100 134 109 127" stroke="#c0734a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="80" cy="122" rx="7" ry="4" fill="#f0a07a" opacity="0.35"/>
  <ellipse cx="120" cy="122" rx="7" ry="4" fill="#f0a07a" opacity="0.35"/>
  <circle cx="100" cy="158" r="2" fill="rgba(255,255,255,0.4)"/>
  <circle cx="100" cy="167" r="2" fill="rgba(255,255,255,0.3)"/>
  <circle cx="100" cy="100" r="100" fill="url(#shimmer)" opacity="0.15"/>
  <circle cx="100" cy="100" r="97" fill="none" stroke="url(#shimmer)" stroke-width="2" opacity="0.5">
    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="r" values="95;98;95" dur="3s" repeatCount="indefinite"/>
  </circle>
  <g opacity="0.7">
    <path d="M28 40 L30 34 L32 40 L38 42 L32 44 L30 50 L28 44 L22 42 Z" fill="#fbbf24">
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite"/>
    </path>
    <path d="M162 30 L164 25 L166 30 L171 32 L166 34 L164 39 L162 34 L157 32 Z" fill="#fde68a">
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="3.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;1;0.5" dur="3.2s" repeatCount="indefinite"/>
    </path>
    <circle cx="168" cy="65" r="3" fill="#c49a2c">
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="32" cy="150" r="2.5" fill="#fbbf24">
      <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.8s" repeatCount="indefinite"/>
      <animate attributeName="r" values="1.5;3.5;1.5" dur="2.8s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>
`)}`;

  const [prev, setPrev] = useState<string | null>(defaultAvatar);

  const validateFields = () => {
    if (!customer.email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(customer.email)) return "Invalid email format";
    if (!customer.name) return "Name is required";
    if (!customer.city) return "City is required";
    if (!customer.state) return "State is required";
    if (!customer.gender) return "Gender is required";
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const updatePicAndSetPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selFileObj = event.target.files?.[0];
    if (selFileObj) {
      setCustomer((prev) => ({ ...prev, profilePic: selFileObj }));
      setPrev(URL.createObjectURL(selFileObj));
    }
  };

  const handleSave = async () => {
    const error = validateFields();
    if (error) return alert(error);
    const frmData = new FormData();
    frmData.append("email", customer.email);
    frmData.append("name", customer.name);
    frmData.append("address", customer.address);
    frmData.append("city", customer.city);
    frmData.append("state", customer.state);
    frmData.append("gender", customer.gender);
    if (customer.profilePic) frmData.append("profilepic", customer.profilePic);
    try {
      const response = await axios.post(`${API_BASE}/customer/create`, frmData, {
        headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" },
      });
      alert(response.data.msg);
      setIsExistingCustomer(true);
    } catch { alert("Error saving profile"); }
  };

  const handleFind = async () => {
    if (!customer.email) return alert("Enter email to search");
    try {
      const response = await axios.post(`${API_BASE}/customer/find`, { email: customer.email }, authHeader());
      if (response.data.status) {
        const data = response.data.doc;
        setCustomer({ email: data.email, name: data.name, address: data.address, city: data.city, state: data.state, gender: data.gender, profilePic: null });
        setPrev(data.profilePic);
        setIsExistingCustomer(true);
        alert("Customer Found");
      } else {
        alert("Customer not found");
        setIsExistingCustomer(false);
      }
    } catch { alert("Error finding customer"); }
  };

  const handleUpdate = async () => {
    const error = validateFields();
    if (error) return alert(error);
    const frmData = new FormData();
    frmData.append("email", customer.email);
    frmData.append("name", customer.name);
    frmData.append("address", customer.address);
    frmData.append("city", customer.city);
    frmData.append("state", customer.state);
    frmData.append("gender", customer.gender);
    if (customer.profilePic) frmData.append("profilepic", customer.profilePic);
    try {
      const response = await axios.post(`${API_BASE}/customer/update`, frmData, {
        headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" },
      });
      alert(response.data.msg);
    } catch { alert("Error updating profile"); }
  };

  const handleDelete = async () => {
    if (!customer.email) return alert("Enter email to delete");
    try {
      const response = await axios.post(`${API_BASE}/customer/delete`, { email: customer.email }, authHeader());
      alert(response.data.msg);
      setCustomer({ email: "", name: "", address: "", city: "", state: "", gender: "", profilePic: null });
      setPrev(defaultAvatar);
      setIsExistingCustomer(false);
    } catch { alert("Error deleting profile"); }
  };

  const dm = darkMode;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
      style={{
        background: dm
          ? "linear-gradient(135deg, #0d0d1a 0%, #1a1230 50%, #0d1a0d 100%)"
          : "linear-gradient(135deg, #fef3c7 0%, #fff7ed 40%, #fdf4ff 100%)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(8deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-16px) rotate(-6deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(196,154,44,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(196,154,44,0); }
          100% { box-shadow: 0 0 0 0 rgba(196,154,44,0); }
        }

        .float-a { animation: floatA 4s ease-in-out infinite; }
        .float-b { animation: floatB 5.5s ease-in-out infinite; }
        .float-c { animation: floatC 3.5s ease-in-out infinite; }
        .cut-spin { animation: spinSlow 8s linear infinite; display: inline-block; }

        .cp-input {
          width: 100%;
          padding: 11px 14px 11px 42px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.25s ease;
          outline: none;
        }
        .cp-input:focus { transform: translateY(-1px); }
        .cp-input-bare {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.25s ease;
          outline: none;
        }
        .cp-input-bare:focus { transform: translateY(-1px); }

        .lbl {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .action-btn {
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          border-radius: 10px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .action-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s ease;
        }
        .action-btn:hover::after { left: 100%; }
        .action-btn:hover { transform: translateY(-2px); }
        .action-btn:active { transform: translateY(0); }

        .mode-btn {
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          border: none;
        }
        .mode-btn:hover { transform: scale(1.15) rotate(15deg); }

        .feat-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 8px;
          margin: 3px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.82);
        }

        .avatar-ring { animation: pulseRing 2.5s ease infinite; }

        .section-divider {
          height: 1px;
          margin: 20px 0;
        }
      `}</style>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row transition-colors duration-500"
        style={{
          background: dm ? "rgba(15,12,30,0.96)" : "rgba(255,255,255,0.97)",
          border: dm ? "1px solid rgba(196,154,44,0.2)" : "1px solid rgba(196,154,44,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: dm
            ? "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(196,154,44,0.1)"
            : "0 40px 80px rgba(196,154,44,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >

        {/* ════════ LEFT PANEL ════════ */}
        <div
          className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center relative overflow-hidden p-10"
          style={{
            background: dm
              ? "linear-gradient(145deg, #1a1230 0%, #2d1f0a 50%, #1a1230 100%)"
              : "linear-gradient(145deg, #92400e 0%, #c49a2c 40%, #78350f 100%)",
          }}
        >
          <div className="float-a absolute top-12 left-8" style={{ opacity: 0.2 }}>
            <GiSewingMachine size={38} color={dm ? "#fbbf24" : "white"} />
          </div>
          <div className="float-b absolute top-20 right-8" style={{ opacity: 0.15 }}>
            <FaCut size={30} color={dm ? "#fbbf24" : "white"} className="cut-spin" />
          </div>
          <div className="float-c absolute bottom-24 left-10" style={{ opacity: 0.18 }}>
            <FaUser size={26} color={dm ? "#fbbf24" : "white"} />
          </div>
          <div className="float-a absolute bottom-14 right-10" style={{ opacity: 0.15, animationDelay: "1.2s" }}>
            <GiSewingMachine size={32} color={dm ? "#fbbf24" : "white"} />
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 rounded-full"
            style={{ background: dm ? "#fbbf24" : "white", opacity: 0.07, transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
            style={{ background: dm ? "#fbbf24" : "white", opacity: 0.07, transform: "translate(-30%,30%)" }} />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(10px)" }}>
              <FaUser size={10} color="#fde68a" />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>
                Customer Profile
              </span>
            </div>

            <div className="relative mb-4">
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="avatar-ring w-36 h-36 rounded-full overflow-hidden"
                style={{ border: "3px solid rgba(251,191,36,0.6)" }}
              >
                <img src={prev || ""} alt="profile" className="w-full h-full object-cover" />
              </motion.div>
              <label
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)", border: "2px solid rgba(255,255,255,0.3)" }}
              >
                <FaCamera size={13} color="white" />
                <input type="file" name="profilePic" onChange={updatePicAndSetPreview} className="hidden" accept="image/*" />
              </label>
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 700, color: "white", textAlign: "center", marginBottom: "6px" }}>
              {customer.name || "Customer Name"}
            </h3>

            <div className="flex flex-col items-center gap-1 mb-4">
              {(customer.city || customer.state) && (
                <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  <FaMapMarker size={10} color="#fbbf24" />
                  {customer.city}{customer.city && customer.state ? ", " : ""}{customer.state}
                </div>
              )}
              {customer.gender && (
                <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  <FaVenusMars size={10} color="#fbbf24" />
                  {customer.gender}
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                  <FaEnvelope size={9} color="#fbbf24" />
                  {customer.email}
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: isExistingCustomer ? "#4ade80" : "#fbbf24" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: isExistingCustomer ? "#4ade80" : "#fbbf24", letterSpacing: "0.06em" }}>
                {isExistingCustomer ? "Existing Client" : "New Client"}
              </span>
            </div>

            <div className="mt-5">
              {["🛍️ Client", "✂️ Tailoring", "⭐ Premium"].map((f, i) => (
                <span key={i} className="feat-pill">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ════════ RIGHT PANEL ════════ */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-10 relative overflow-y-auto" style={{ maxHeight: "100vh" }}>

          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={() => setDarkMode(!dm)}
              className="mode-btn w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: dm ? "rgba(196,154,44,0.14)" : "rgba(146,64,14,0.07)",
                border: dm ? "1px solid rgba(196,154,44,0.28)" : "1px solid rgba(146,64,14,0.14)",
                color: dm ? "#fbbf24" : "#92400e",
                fontSize: "16px",
              }}
            >
              {dm ? <BsSun /> : <BsMoon />}
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-4 mb-6">
            <div className="relative">
              <motion.div whileHover={{ scale: 1.06 }} className="w-16 h-16 rounded-full overflow-hidden"
                style={{ border: "2px solid rgba(196,154,44,0.5)" }}>
                <img src={prev || ""} alt="profile" className="w-full h-full object-cover" />
              </motion.div>
              <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "linear-gradient(135deg,#c49a2c,#92400e)" }}>
                <FaCamera size={9} color="white" />
                <input type="file" name="profilePic" onChange={updatePicAndSetPreview} className="hidden" accept="image/*" />
              </label>
            </div>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 700, color: dm ? "white" : "#1c0a00" }}>
                {customer.name || "Customer Name"}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mt-1"
                style={{ background: "rgba(196,154,44,0.1)", border: "1px solid rgba(196,154,44,0.25)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: isExistingCustomer ? "#4ade80" : "#fbbf24" }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: isExistingCustomer ? "#4ade80" : "#fbbf24" }}>
                  {isExistingCustomer ? "Existing" : "New"}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <p className="lbl" style={{ color: "#c49a2c" }}>Manage Profile</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", fontWeight: 700, lineHeight: 1.1, color: dm ? "white" : "#1c0a00", marginBottom: "4px" }}>
              Customer Profile
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.36)" }}>
              Search existing or create a new customer record
            </p>
          </motion.div>

          <div className="section-divider" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(196,154,44,0.12)" }} />

          {/* ── Email + Search ── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
            <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.42)" }}>Email Address</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2" size={13}
                  style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                <input
                  type="email" name="email" value={customer.email}
                  onChange={handleChange} placeholder="customer@example.com"
                  className="cp-input"
                  style={{
                    background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)",
                    border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                    color: dm ? "white" : "#1c0a00",
                  }}
                />
              </div>
              <motion.button
                onClick={handleFind}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="action-btn px-5"
                style={{
                  background: "linear-gradient(135deg,#c49a2c,#92400e)",
                  color: "white",
                  minWidth: "100px",
                  boxShadow: "0 6px 20px rgba(196,154,44,0.35)",
                }}
              >
                <FaSearch size={12} /> Search
              </motion.button>
            </div>
          </motion.div>

          {/* ── Name ── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-4">
            <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.42)" }}>Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2" size={12}
                style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
              <input
                type="text" name="name" value={customer.name}
                onChange={handleChange} placeholder="Enter full name"
                className="cp-input"
                style={{
                  background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)",
                  border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                  color: dm ? "white" : "#1c0a00",
                }}
              />
            </div>
          </motion.div>

          {/* ── Address ── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
            <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.42)" }}>Address</label>
            <div className="relative">
              <FaHome className="absolute left-3.5 top-1/2 -translate-y-1/2" size={12}
                style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
              <input
                type="text" name="address" value={customer.address}
                onChange={handleChange} placeholder="Street address"
                className="cp-input"
                style={{
                  background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)",
                  border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                  color: dm ? "white" : "#1c0a00",
                }}
              />
            </div>
          </motion.div>

          {/* ── City + State ── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.42)" }}>City</label>
                <div className="relative">
                  <FaCity className="absolute left-3.5 top-1/2 -translate-y-1/2" size={12}
                    style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
                  <input
                    type="text" name="city" value={customer.city}
                    onChange={handleChange} placeholder="City"
                    className="cp-input"
                    style={{
                      background: dm ? "rgba(255,255,255,0.05)" : "rgba(146,64,14,0.04)",
                      border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                      color: dm ? "white" : "#1c0a00",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.42)" }}>State</label>
                <select
                  name="state" value={customer.state} onChange={handleChange}
                  className="cp-input-bare"
                  style={{
                    appearance: "none",
                    cursor: "pointer",
                    background: dm ? "#1e1630" : "rgba(146,64,14,0.04)",
                    border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                    color: customer.state ? (dm ? "white" : "#1c0a00") : (dm ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)"),
                  }}
                >
                  <option value="" style={{ background: dm ? "#1e1630" : "white", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                    Select State
                  </option>
                  {STATES.map((s) => (
                    <option key={s} value={s} style={{ background: dm ? "#1e1630" : "white", color: dm ? "white" : "#1c0a00" }}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* ── Gender ── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
            <label className="lbl" style={{ color: dm ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.42)" }}>Gender</label>
            <div className="relative">
              <FaVenusMars className="absolute left-3.5 top-1/2 -translate-y-1/2" size={13}
                style={{ color: dm ? "rgba(196,154,44,0.6)" : "#c49a2c" }} />
              <select
                name="gender" value={customer.gender} onChange={handleChange}
                className="cp-input"
                style={{
                  appearance: "none",
                  cursor: "pointer",
                  background: dm ? "#1e1630" : "rgba(146,64,14,0.04)",
                  border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,154,44,0.2)",
                  color: customer.gender ? (dm ? "white" : "#1c0a00") : (dm ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)"),
                }}
              >
                <option value="" style={{ background: dm ? "#1e1630" : "white", color: dm ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                  Select Gender
                </option>
                <option value="Male" style={{ background: dm ? "#1e1630" : "white", color: dm ? "white" : "#1c0a00" }}>Male</option>
                <option value="Female" style={{ background: dm ? "#1e1630" : "white", color: dm ? "white" : "#1c0a00" }}>Female</option>
                <option value="Other" style={{ background: dm ? "#1e1630" : "white", color: dm ? "white" : "#1c0a00" }}>Other</option>
              </select>
            </div>
          </motion.div>

          {/* ── Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {!isExistingCustomer ? (
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="action-btn sm:col-span-3"
                style={{
                  background: "linear-gradient(135deg,#c49a2c 0%,#92400e 100%)",
                  color: "white",
                  boxShadow: "0 8px 24px rgba(196,154,44,0.35)",
                }}
              >
                <FaSave size={13} /> Save Profile
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={handleUpdate}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="action-btn"
                  style={{
                    background: "linear-gradient(135deg,#c49a2c 0%,#92400e 100%)",
                    color: "white",
                    boxShadow: "0 6px 18px rgba(196,154,44,0.3)",
                  }}
                >
                  <FaEdit size={13} /> Update
                </motion.button>

                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="action-btn"
                  style={{
                    background: dm ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.35)",
                    color: "#f87171",
                  }}
                >
                  <FaTrash size={12} /> Delete
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Footer brand */}
          <div className="flex items-center gap-3 mt-7">
            <div className="flex-1 h-px" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
            <div className="flex items-center gap-1.5">
              <FaCut size={9} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)" }} />
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "11px", color: dm ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)", letterSpacing: "0.12em" }}>
                TAILORCONNECT
              </span>
              <FaCut size={9} style={{ color: dm ? "rgba(196,154,44,0.4)" : "rgba(196,154,44,0.5)", transform: "scaleX(-1)" }} />
            </div>
            <div className="flex-1 h-px" style={{ background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
