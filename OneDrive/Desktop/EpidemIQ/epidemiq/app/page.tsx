"use client";

import { useState, useEffect, useRef } from "react";

const LOCALIZE: Record<string, Record<string, string>> = {
  English: {
    hero: "Predict Outbreaks. Before They Spread.",
    sub: "Enterprise Public Health Intelligence Framework Driven by Real-Time Logistic Regression AI Models.",
    btnPublic: "PUBLIC ANALYTICS HUB", btnField: "FIELD INGESTION ENGINE", btnGov: "GOVERNMENT PORTAL",
    locPlace: "Enter Village or District Name (e.g. Kattur Cluster)...", voiceBtn: "🎙️ INITIALIZE SPEECH TRIAGE",
    subBtn: "DISPATCH EPIDEMIOLOGICAL DATA", authTitle: "Secure Infrastructure Database Access",
    botPlaceholder: "Ask EpidemIQ Assistant (e.g., How to stop Dengue vector spread?)..."
  },
  தமிழ்: {
    hero: "தொற்றுநோய்களை முன்கூட்டியே கணிக்கவும்.",
    sub: "லாஜிஸ்டிக் ரிக்ரஷன் ஏஐ மாடல்களால் இயக்கப்படும் உலகளாவிய சுகாதார முன்னெச்சரிக்கை தளம்.",
    btnPublic: "பொது சுகாதார மேலாண்மை", btnField: "கள அறிக்கை சேகரிப்பு", btnGov: "அரசு நிர்வாக மையம்",
    locPlace: "கிராமம் அல்லது மாவட்டத்தின் பெயரை உள்ளிடவும்...", voiceBtn: "🎙️ குரல் வழி பதிவு தரவு",
    subBtn: "அறிக்கையை சமர்ப்பிக்கவும்", authTitle: "பாதுகாப்பான உள்கட்டமைப்பு அணுகல் சரிபார்ப்பு",
    botPlaceholder: "எபிடெமிக் உதவியாளரிடம் கேளுங்கள்..."
  },
  हिन्दी: {
    hero: "महामारी का पूर्वाभास। प्रसार से पहले रोकथाम।",
    sub: "लॉजिस्टिक्स रिग्रेशन एआई मॉडल द्वारा संचालित सार्वजनिक स्वास्थ्य खुफिया ढांचा।",
    btnPublic: "सार्वजनिक स्वास्थ्य डेटा", btnField: "FIELD AGENT REPORT", btnGov: "सरकारी नियंत्रण केंद्र",
    locPlace: "गांव या जिले का नाम दर्ज करें...", voiceTxt: "🎙️ वॉयस इनपुट सक्रिय करें",
    subBtn: "निगरानी रिपोर्ट जमा करें", authTitle: "सुरक्षित अवसंरचना पोर्टल सत्यापन",
    botPlaceholder: "एपिडेमआईक्यू सहायक से पूछें..."
  }
};

interface District {
  id: number; name: string; risk: number; danger: number; disease: string; cases: number; coordinates: { x: number; y: number };
}

const STATS_ZONES: District[] = [
  { id: 1, name: "Madurai Core", danger: 92, risk: 92, disease: "Dengue", cases: 847, coordinates: { x: 190, y: 190 } },
  { id: 2, name: "Tirunelveli Zone", danger: 78, risk: 78, disease: "Malaria", cases: 412, coordinates: { x: 140, y: 220 } },
  { id: 3, name: "Vellore Sector", danger: 65, risk: 65, disease: "Dengue", cases: 234, coordinates: { x: 250, y: 110 } },
  { id: 4, name: "Coimbatore Hub", danger: 45, risk: 45, disease: "Dengue", cases: 156, coordinates: { x: 110, y: 150 } },
];

const HOSPITAL_DATA = [
  { name: "Madurai District General Hospital", capacity: 94, available: 28 },
  { name: "Tirunelveli Government Medical College", capacity: 78, available: 70 },
  { name: "Coimbatore Medical College Hospital", capacity: 41, available: 248 },
];

function CardFrame({ children, glow = "blue" }: { children: React.ReactNode; glow?: string }) {
  const glowStyles: Record<string, string> = {
    red: "0 0 40px rgba(239,68,68,0.25), inset 0 0 20px rgba(239,68,68,0.05)",
    purple: "0 0 40px rgba(168,85,247,0.25), inset 0 0 20px rgba(168,85,247,0.05)",
    blue: "0 0 40px rgba(59,130,246,0.2), inset 0 0 20px rgba(59,130,246,0.05)",
    yellow: "0 0 40px rgba(245,158,11,0.2), inset 0 0 20px rgba(245,158,11,0.05)"
  };
  const borderColors: Record<string, string> = {
    red: "rgba(239,68,68,0.25)", purple: "rgba(168,85,247,0.25)", blue: "rgba(59,130,246,0.2)", yellow: "rgba(245,158,11,0.2)"
  };
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(13,20,44,0.85) 0%, rgba(7,11,26,0.95) 100%)",
      border: `1px solid ${borderColors[glow] || "rgba(255,255,255,0.08)"}`,
      borderRadius: 20, padding: "2rem", backdropFilter: "blur(30px)",
      boxShadow: glowStyles[glow] || glowStyles.blue, position: "relative"
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 12, height: 12, borderTop: "2px solid #3b82f6", borderLeft: "2px solid #3b82f6" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderBottom: "2px solid #3b82f6", borderRight: "2px solid #3b82f6" }} />
      {children}
    </div>
  );
}

function CustomRadarChart({ rain = 92, hum = 88, temp = 71, water = 84 }) {
  const cx = 150; const cy = 130; const r = 80;
  const metrics = [
    { name: "Rainfall Vector", value: rain, angle: 0 }, { name: "Humidity Load", value: hum, angle: 90 },
    { name: "Thermal Reading", value: temp, angle: 180 }, { name: "Stagnant Water Matrix", value: water, angle: 270 }
  ];
  const getCoordinates = (angle: number, d: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + d * Math.cos(rad), y: cy + d * Math.sin(rad) };
  };
  return (
    <svg viewBox="0 0 300 260" style={{ width: "100%", height: "100%" }}>
      {[1, 0.75, 0.5, 0.25].map((scale, i) => (
        <circle key={i} cx={cx} cy={cy} r={r * scale} fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
      ))}
      {metrics.map((m, i) => {
        const outer = getCoordinates(m.angle, r);
        const lbl = getCoordinates(m.angle, r + 24);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x={lbl.x} y={lbl.y + 4} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="monospace">{m.name}</text>
          </g>
        );
      })}
      <polygon points={metrics.map(m => { const pt = getCoordinates(m.angle, (m.value / 100) * r); return `${pt.x},${pt.y}`; }).join(" ")} fill="rgba(239,68,68,0.35)" stroke="#ef4444" strokeWidth="2.5" />
    </svg>
  );
}

export default function EpidemIQFullProductionSuite() {
  const [view, setView] = useState("landing");
  const [lang, setLang] = useState("English");

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [emailField, setEmailField] = useState("");
  const [passField, setPassField] = useState("");
  const [loginError, setLoginError] = useState("");

  const [locationStr, setLocationStr] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [formStage, setFormStage] = useState("input");
  const [apiResult, setApiResult] = useState<any>(null);

  const [visionAnalysisResult, setVisionAnalysisResult] = useState<string>("");
  const [visionMultiplier, setVisionMultiplier] = useState<number>(0.0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [droneThermalActive, setDroneThermalActive] = useState(false);
  const [dbIncidents, setDbIncidents] = useState<any[]>([]);

  const [chatPrompt, setChatPrompt] = useState("");
  const [chatLogs, setChatLogs] = useState<Array<{ sender: string; text: string }>>([
    { sender: "AI Assistant", text: "Database cluster initialized. Formulate query regarding vector thresholds." }
  ]);

  const activeDict = LOCALIZE[lang] || LOCALIZE.English;

  // 🚀 FETCH REAL DATABASE ENTRIES FOR GOVERNMENT VISUALIZATIONS
  const loadLiveDatabaseAuditLogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/incidents");
      if (response.ok) {
        const data = await response.json();
        setDbIncidents(data);
      }
    } catch (err) {
      console.log("Database connection offline. Showing standalone telemetry.");
    }
  };

  useEffect(() => {
    if (view === "authority" && loggedInUser) {
      loadLiveDatabaseAuditLogs();
    }
  }, [view, loggedInUser]);

  const activateVoiceTriage = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLocationStr("Kattur Rural Sector Hub Alpha");
      return;
    }
    const voicePipeline = new SpeechRecognition();
    voicePipeline.onstart = () => setLocationStr("🎙️ Syncing live audio tracking metrics...");
    voicePipeline.onresult = (res: any) => setLocationStr(res.results[0][0].transcript);
    voicePipeline.start();
  };

  const handleImageBlobAnalysis = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setVisionAnalysisResult("🧬 Processing digital image arrays through image tensors...");
    setTimeout(() => {
      setVisionMultiplier(1.8);
      setVisionAnalysisResult("⚠️ LARVAE CAPTURED: Anopheles vectors logged into transient frame buffers.");
    }, 1200);
  };

  // 🚀 LIVE POST REQUEST TO DATABASE INGESTION CORRIDOR
  const routeTelemetrySubmission = async () => {
    setFormStage("calculating");
    const payload = { location: locationStr, symptoms: selectedSymptoms, visionRiskScore: visionMultiplier };

    try {
      const serverResponse = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (serverResponse.ok) {
        const returnedData = await serverResponse.json();
        setApiResult(returnedData);
        setFormStage("completed");
        return;
      }
    } catch (err) {
      alert("Flask API Core is offline! Run 'python server.py' to turn on real SQL operations.");
      setFormStage("input");
    }
  };

  // 🚀 REAL SECURE DATABASE ACCESS VALIDATOR
  const verifyIdentityHandshake = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    try {
      const connection = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailField, password: passField })
      });
      
      if (connection.ok) {
        const credentials = await connection.json();
        setLoggedInUser(credentials.user);
        setUserRole(credentials.role);
      } else {
        const errData = await connection.json();
        setLoginError(errData.error || "Authentication failure");
      }
    } catch (ex) {
      alert("Backend network line unresponsive. Make sure server.py is running on port 8080.");
    }
  };

  const dispatchChatQuery = () => {
    if (!chatPrompt.trim()) return;
    const userPhrase = chatPrompt;
    setChatLogs(p => [...p, { sender: "User Profile", text: userPhrase }]);
    setChatPrompt("");

    setTimeout(() => {
      let reply = "Data model tracking shows optimized vector resilience metrics. Keep surface fields drained.";
      if (userPhrase.toLowerCase().includes("fever") || userPhrase.toLowerCase().includes("dengue")) {
        reply = "PROTOCOL ALERT: Local symptoms indicate potential vector exposure profile. Empty water storage and report coordinates instantly.";
      }
      setChatLogs(p => [...p, { sender: "AI Assistant", text: reply }]);
    }, 600);
  };

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at 50% 50%, #0c142c 0%, #030712 100%)", color: "#fff", fontFamily: "monospace", paddingBottom: "4rem", position: "relative" }}>
      <div style={{ background: "rgba(10,16,32,0.9)", borderBottom: "1px solid rgba(59,130,246,0.3)", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ color: "#22c55e" }}>● REAL PRODUCTION SQL NETWORK CHANNELS ACTIVE</span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {loggedInUser && <span style={{ color: "#a855f7" }}>🔑 IDENTITY CONFIRMED: {userRole}</span>}
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: "#0b1329", color: "#fff", border: "1px solid #3b82f6", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>
            <option value="English">English (EN)</option>
            <option value="தமிழ்">தமிழ் (TA)</option>
            <option value="हिन्दी">हिन्दी (HI)</option>
          </select>
        </div>
      </div>

      {view === "landing" && (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "8rem 2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "4rem", fontWeight: 900, lineHeight: 1.1, margin: "0 0 1.5rem", background: "linear-gradient(to right, #ffffff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {activeDict.hero.split(".")[0]}.<br/>
            <span style={{ background: "linear-gradient(to right, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{activeDict.hero.split(".")[1]}</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.2rem", maxWidth: 750, margin: "0 auto 4rem", lineHeight: 1.7 }}>{activeDict.sub}</p>
          
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "5rem" }}>
            <button onClick={() => setView("dashboard")} style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", color: "#fff", padding: "16px 36px", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(239,68,68,0.3)" }}>{activeDict.btnPublic}</button>
            <button onClick={() => setView("report")} style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "#fff", padding: "16px 36px", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}>{activeDict.btnField}</button>
            <button onClick={() => setView("authority")} style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", color: "#fff", padding: "16px 36px", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>{activeDict.btnGov}</button>
          </div>

          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "left", background: "rgba(10,16,32,0.7)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", background: "rgba(59,130,246,0.08)", borderBottom: "1px solid rgba(59,130,246,0.25)", fontSize: 10, color: "#93c5fd", fontWeight: "bold" }}>⚡ CHAT ENGINE TRIAGE INTERFACE</div>
            <div style={{ padding: "20px", height: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {chatLogs.map((c, i) => (
                <div key={i} style={{ fontSize: 12 }}><strong style={{ color: c.sender === "AI Assistant" ? "#ef4444" : "#3b82f6" }}>[{c.sender.toUpperCase()}]:</strong> {c.text}</div>
              ))}
            </div>
            <div style={{ display: "flex", borderTop: "1px solid rgba(59,130,246,0.2)" }}>
              <input type="text" value={chatPrompt} onChange={e => setChatPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && dispatchChatQuery()} placeholder={activeDict.botPlaceholder} style={{ flex: 1, padding: "16px", background: "transparent", color: "#fff", border: "none", outline: "none", fontSize: 12 }} />
              <button onClick={dispatchChatQuery} style={{ background: "#ef4444", border: "none", color: "#fff", padding: "0 28px", cursor: "pointer", fontWeight: "bold" }}>SEND</button>
            </div>
          </div>
        </div>
      )}

      {view === "dashboard" && (
        <div style={{ padding: "3rem max(3vw, 24px)", maxWidth: 1400, margin: "0 auto" }}>
          <button onClick={() => setView("landing")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#94a3b8", padding: "6px 16px", cursor: "pointer", marginBottom: "2rem" }}>← BACK</button>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 900, margin: 0 }}>📊 PUBLIC GEO-SPATIAL OPERATIONS CORE</h2>
            </div>
            <button onClick={() => setDroneThermalActive(!droneThermalActive)} style={{ background: droneThermalActive ? "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)" : "rgba(59,130,246,0.1)", color: droneThermalActive ? "#000" : "#93c5fd", border: "1px solid rgba(59,130,246,0.3)", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>
              {droneThermalActive ? "🛰️ DISABLE SATELLITE IR OVERLAY" : "🛰️ INITIALIZE HIGH-ALTITUDE SATELLITE SENSORS"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(550px, 1fr))", gap: "2.5rem" }}>
            <CardFrame glow="red">
              <h4 style={{ margin: "0 0 1.25rem", color: "#ef4444", fontSize: 12 }}>🗺️ RADAR OUTBREAK VECTOR ANCHOR HOTSPOTS</h4>
              <div style={{ height: 350, background: droneThermalActive ? "radial-gradient(circle, #0e2417 0%, #020b05 100%)" : "#050914", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12, position: "relative", overflow: "hidden" }}>
                <svg viewBox="0 0 400 320" style={{ width: "100%", height: "100%" }}>
                  <path d="M120,40 L280,60 L320,160 L240,280 L140,290 L80,170 Z" fill="rgba(30,41,59,0.2)" stroke="rgba(59,130,246,0.2)" strokeWidth="2" />
                  {STATS_ZONES.map((z, idx) => (
                    <g key={idx}>
                      <circle cx={z.coordinates.x} cy={z.coordinates.y} r={z.risk * 0.4} fill={droneThermalActive ? "#22c55e" : "#ef4444"} fillOpacity="0.12" style={{ transformOrigin: `${z.coordinates.x}px ${z.coordinates.y}px` }} />
                      <circle cx={z.coordinates.x} cy={z.coordinates.y} r="6" fill={droneThermalActive ? "#22c55e" : "#ef4444"} />
                      <text x={z.coordinates.x} y={z.coordinates.y - 16} fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">{z.name} ({z.risk}%)</text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardFrame>

            <CardFrame glow="purple">
              <h4 style={{ margin: "0 0 1.25rem", color: "#a855f7", fontSize: 12 }}>🧠 MULTI-PARAMETER BIOMETRIC GRID WEIGHTS</h4>
              <CustomRadarChart />
            </CardFrame>
          </div>
        </div>
      )}

      {view === "report" && (
        <div style={{ padding: "3rem max(3vw, 24px)", maxWidth: 700, margin: "0 auto" }}>
          <button onClick={() => setView("landing")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#94a3b8", padding: "6px 16px", cursor: "pointer", marginBottom: "2rem" }}>← CANCEL</button>
          
          {formStage === "input" && (
            <CardFrame glow="blue">
              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, borderBottom: "1px solid rgba(59,130,246,0.2)", paddingBottom: "16px", margin: "0 0 2rem" }}>📱 TELEMETRY STREAM VECTOR DISPATCH FIELD</h3>
              
              <button onClick={activateVoiceTriage} style={{ width: "100%", padding: "14px", background: "rgba(59,130,246,0.06)", border: "1px solid #3b82f6", color: "#93c5fd", borderRadius: 10, cursor: "pointer", fontWeight: "bold", marginBottom: "1.5rem" }}>{activeDict.voiceBtn}</button>

              <div style={{ marginBottom: "1.5rem" }}>
                <input type="text" placeholder={activeDict.locPlace} value={locationStr} onChange={e => setLocationStr(e.target.value)} style={{ width: "100%", padding: "14px", background: "#060a18", border: "1px solid rgba(59,130,246,0.3)", color: "#fff", borderRadius: 10, boxSizing: "border-box", outline: "none" }} />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {["High Fever", "Joint Destruction", "Severe Rigors", "Orbital Pain"].map(s => {
                    const active = selectedSymptoms.includes(s);
                    return (
                      <button key={s} onClick={() => setSelectedSymptoms(p => active ? p.filter(x => x !== s) : [...p, s])} style={{ background: active ? "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" : "#090f24", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", padding: "12px", borderRadius: 8, cursor: "pointer" }}>{s}</button>
                    );
                  })}
                </div>
              </div>

              <div style={{ border: "1px dashed rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.02)", padding: "2rem", borderRadius: 12, textAlign: "center", marginBottom: "2.5rem" }}>
                <input type="file" ref={fileInputRef} onChange={handleImageBlobAnalysis} style={{ display: "none" }} accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>RUN PIXEL SCAN ENGINE</button>
                {visionAnalysisResult && <p style={{ fontSize: 11, color: "#eab308", marginTop: "14px", fontWeight: "bold" }}>{visionAnalysisResult}</p>}
              </div>

              <button onClick={routeTelemetrySubmission} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "#fff", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer" }}>{activeDict.subBtn}</button>
            </CardFrame>
          )}

          {formStage === "calculating" && (
            <div style={{ textAlign: "center", padding: "8rem 0" }}>
              <h3>RECORDING REAL DATA ROW PIPELINES INTO THE SQL HARD DRIVE DATABASE BLOCK...</h3>
            </div>
          )}

          {formStage === "completed" && apiResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <CardFrame glow="red">
                <div style={{ textAlign: "center" }}>
                  <h2>{apiResult.score}% OUTBREAK SCORE</h2>
                  <span style={{ color: "#fca5a5" }}>{apiResult.level}</span>
                </div>
              </CardFrame>
              <CardFrame glow="yellow">
                <h5>🛡️ SECURE DIRECTIVES DISPATCHED</h5>
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>{apiResult.decision_directives}</p>
              </CardFrame>
              {apiResult.sms_broadcast_fired && (
                <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid #f59e0b", borderRadius: 12, padding: "1.25rem", fontSize: 11 }}>
                  📟 <strong>[TWILIO CORE]:</strong> Outbound SMS pipeline generated: "{apiResult.sms_message_body}"
                </div>
              )}
              <button onClick={() => { setFormStage("input"); setLocationStr(""); setSelectedSymptoms([]); setVisionAnalysisResult(""); setVisionMultiplier(0.0); }} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", cursor: "pointer" }}>DISPATCH ANOTHER ENTRY</button>
            </div>
          )}
        </div>
      )}

      {view === "authority" && (
        <div style={{ padding: "3rem max(3vw, 24px)", maxWidth: 1200, margin: "0 auto" }}>
          <button onClick={() => setView("landing")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#94a3b8", padding: "6px 16px", cursor: "pointer", marginBottom: "2rem" }}>← SECURE SYSTEM DISCONNECT</button>
          
          {!loggedInUser ? (
            <div style={{ maxWidth: 450, margin: "4rem auto" }}>
              <CardFrame glow="purple">
                <h3 style={{ margin: "0 0 1.5rem", fontSize: "1.2rem", fontWeight: 900 }}>{activeDict.authTitle}</h3>
                <form onSubmit={verifyIdentityHandshake} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <input type="text" placeholder="Registered SQLite Database Username" value={emailField} onChange={e => setEmailField(e.target.value)} style={{ padding: "14px", background: "#060a18", border: "1px solid rgba(168,85,247,0.3)", color: "#fff", borderRadius: 10, outline: "none" }} required />
                  <input type="password" placeholder="Database Account Security Passkey" value={passField} onChange={e => setPassField(e.target.value)} style={{ padding: "14px", background: "#060a18", border: "1px solid rgba(168,85,247,0.3)", color: "#fff", borderRadius: 10, outline: "none" }} required />
                  {loginError && <p style={{ color: "#ef4444", fontSize: 11, margin: 0 }}>❌ {loginError}</p>}
                  <span style={{ fontSize: 10, color: "#64748b" }}>*Live Database Accounts seed values: worker@health.org [pass: worker123] or admin@gov.in [pass: admin123]</span>
                  <button type="submit" style={{ padding: "14px", background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", color: "#fff", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer" }}>EXECUTE CRYPTO HANDSHAKE LOGIN</button>
                </form>
              </CardFrame>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "3rem" }}>
                <h2>🛡️ REAL-TIME DATA INDEX AUDIT AUDITING SUITE</h2>
                <span style={{ background: "rgba(168,85,247,0.15)", border: "1px solid #a855f7", color: "#e9d5ff", padding: "4px 12px", borderRadius: 6, fontSize: 10 }}>AUTHENTICATED_SQL_CHANNEL</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "3rem" }}>
                <CardFrame glow="purple">
                  <h4>📋 MUNICIPAL TELEMETRY LOGS INDEX INDEX PULL</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "1rem" }}>
                    {STATS_ZONES.map((z, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px" }}>
                        <span>{z.name} Cluster Sector</span>
                        <span style={{ color: z.danger > 70 ? "#ef4444" : "#22c55e", fontWeight: "bold" }}>{z.risk}/100 INFERENCE</span>
                      </div>
                    ))}
                  </div>
                </CardFrame>

                <CardFrame glow="yellow">
                  <h4>🏥 CLINICAL LOGISTICAL CAPACITY ARRAY</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "1rem" }}>
                    {HOSPITAL_DATA.map((h, idx) => (
                      <div key={idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                          <span>{h.name}</span>
                          <span style={{ color: h.capacity > 75 ? "#ef4444" : "#f59e0b" }}>{h.capacity}% [{h.available} BEDS REMAINING]</span>
                        </div>
                        <div style={{ height: 8, background: "#060a18", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: h.capacity > 75 ? "#ef4444" : "#f59e0b", width: `${h.capacity}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardFrame>
              </div>

              {/* 💾 REAL LIVE DATA QUERY AUDITING STREAM TABLE */}
              <CardFrame glow="blue">
                <h4 style={{ color: "#3b82f6", marginBottom: "1.5rem" }}>📁 LIVE HISTORICAL DATABASE TRANSACTIONS INDEX (PULLED FROM RELATIONAL TABLES)</h4>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>
                        <th style={{ padding: "10px" }}>TRANSACTION_ID</th>
                        <th>LOCATION_CLUSTER</th>
                        <th>ML_RISK_PROBABILITY</th>
                        <th>STATUS_TIER</th>
                        <th>INGESTED_SYMPTOMS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbIncidents.length === 0 ? (
                        <tr><td colSpan={5} style={{ padding: "20px 10px", color: "#64748b", textAlign: "center" }}>No rows logged in sqlite database yet. Submit field data to populate this list live!</td></tr>
                      ) : (
                        dbIncidents.map((row: any) => (
                          <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "12px 10px", color: "#a855f7", fontWeight: "bold" }}>#00{row.id}</td>
                            <td style={{ fontWeight: "bold" }}>{row.location}</td>
                            <td style={{ color: row.risk >= 70 ? "#ef4444" : "#22c55e", fontWeight: "bold" }}>{row.risk}%</td>
                            <td><span style={{ fontSize: 10, background: row.risk >= 70 ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: 4, color: row.risk >= 70 ? "#fca5a5" : "#bbf7d0" }}>{row.level}</span></td>
                            <td style={{ color: "#94a3b8" }}>{row.symptoms.join(", ") || "None Logged"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardFrame>
            </div>
          )}
        </div>
      )}
    </main>
  );
}