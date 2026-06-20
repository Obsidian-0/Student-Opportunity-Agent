import { useState, useEffect } from "react";

const C = {
  bg: "#070B14", surface: "#0D1525", card: "#111927", border: "#1C2E45",
  accent: "#3B82F6", accentLo: "rgba(59,130,246,0.12)", cyan: "#22D3EE",
  green: "#10B981", amber: "#F59E0B", red: "#EF4444",
  text: "#E2E8F0", muted: "#64748B", dim: "#334155",
};
const BASE = "http://127.0.0.1:5000";
const STEPS = ["Profile", "Skills", "Matches", "Apply"];

const Tag = ({ children, color = C.accent }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11,
    fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
    background: `${color}20`, border: `1px solid ${color}40`, color
  }}>{children}</span>
);

const Spinner = () => (
  <span style={{
    display: "inline-block", width: 16, height: 16,
    border: `2px solid ${C.border}`, borderTopColor: C.accent,
    borderRadius: "50%", animation: "spin 0.7s linear infinite"
  }} />
);

const MatchBar = ({ pct }) => {
  const color = pct >= 75 ? C.green : pct >= 50 ? C.amber : C.red;
  return (
    <div style={{ width: "100%", height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`, borderRadius: 2, background: color,
        transition: "width 1s ease", boxShadow: `0 0 8px ${color}80`
      }} />
    </div>
  );
};

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    marginBottom: 20, padding: "8px 18px", borderRadius: 20,
    border: `1px solid ${C.border}`, background: "transparent", color: C.muted,
    fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6
  }}
    onMouseOver={e => e.currentTarget.style.borderColor = C.accent}
    onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
    ← Back
  </button>
);

function StepBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      {STEPS.map((s, i) => {
        const done = i < step, active = i === step;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700,
                fontFamily: "'Space Mono',monospace",
                background: done ? C.green : active ? C.accent : C.surface,
                border: `2px solid ${done ? C.green : active ? C.accent : C.border}`,
                color: done || active ? "#fff" : C.muted,
                boxShadow: active ? `0 0 16px ${C.accent}60` : "none", transition: "all 0.3s"
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase",
                color: active ? C.accent : done ? C.green : C.muted
              }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 20,
                background: done ? C.green : C.border, transition: "background 0.3s"
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}


function ProfileStep({ onNext }) {
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("CS");
  const [sem, setSem] = useState("4th");
  const [type, setType] = useState("Internship");

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>
        Student Profile
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Basic info so the agent knows who you are.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{
            fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "1px",
            textTransform: "uppercase", display: "block", marginBottom: 6
          }}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Muhammad Zain"
            style={{
              width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: "12px 16px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box"
            }}
            onFocus={e => e.target.style.border = `1px solid ${C.accent}`}
            onBlur={e => e.target.style.border = `1px solid ${C.border}`} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Degree", val: degree, set: setDegree, opts: ["CS", "SE", "IT", "AI", "EE"] },
            { label: "Semester", val: sem, set: setSem, opts: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"] },
            { label: "Looking For", val: type, set: setType, opts: ["Internship", "Part-time", "Full-time", "Remote"] },
          ].map(({ label, val, set, opts }) => (
            <div key={label}>
              <label style={{
                fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "1px",
                textTransform: "uppercase", display: "block", marginBottom: 6
              }}>{label}</label>
              <select value={val} onChange={e => set(e.target.value)}
                style={{
                  width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box", cursor: "pointer"
                }}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
      <button onClick={async () => {
        if (!name.trim()) return;
        const res = await fetch(`${BASE}/api/student/create`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, degree, sem, type })
        }); const data = await res.json(); if (data.student_id) { onNext({ name, degree, sem, type, student_id: data.student_id }); }
      }} disabled={!name.trim()}
        style={{
          marginTop: 28, width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: name.trim() ? `linear-gradient(135deg,${C.accent},${C.cyan})` : C.surface,
          color: name.trim() ? "#fff" : C.muted, fontSize: 15, fontWeight: 700,
          cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit",
          boxShadow: name.trim() ? `0 4px 24px ${C.accent}40` : "none", transition: "all 0.2s"
        }}>
        Continue →
      </button>
    </div>
  );
}

// ── Step 1: Skills ────────────────────────────────────────
function SkillStep({ profile, onNext, onBack }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(null);
  const [error, setError] = useState(null);
  const examples = [
    { label: "Web Dev Beginner", text: "I know React well and have done 3 projects, SQL is decent, Python is beginner level" },
    { label: "Java OOP Background", text: "Strong in Java, done OOP course, a bit of HTML/CSS, zero experience in deployment" },
    { label: "Competitive Programmer", text: "C++ expert, competitive programming, started learning web dev recently" },
    { label: "Data Analyst Track", text: "SQL is my strongest skill from database courses, Python intermediate for data analysis, learning Power BI" },
    { label: "Full Stack Learner", text: "MERN stack — MongoDB, Express, React, Node all intermediate level, deployed 2 projects on Vercel" },
    { label: "AI/ML Beginner", text: "Basics of Python and machine learning from coursework, familiar with pandas and numpy, no deployment experience" },
    { label: "Backend Focused", text: "Strong in PHP and MySQL, built a complete CRUD application, beginner in JavaScript and frontend frameworks" },
  ];
  const levelColor = { Beginner: C.red, Intermediate: C.amber, Advanced: C.cyan, Expert: C.green };

  const extractSkills = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(null); setSkills(null);
    try {
      const res = await fetch(`${BASE}/api/skills/extract`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, student_id: profile.student_id })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSkills(data);
    } catch { setError("Backend se connect nahi ho saka. Flask chal raha hai?"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <BackBtn onClick={onBack} />
      <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>
        Tell Me Your Skills
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Describe naturally — no checkboxes, no dropdowns. Just talk.</p>
      <textarea value={input} onChange={e => setInput(e.target.value)}
        placeholder="e.g. I've been doing React for 6 months, made 2 projects. SQL is decent from DB course..."
        rows={5} style={{
          width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: "16px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit",
          resize: "vertical", boxSizing: "border-box", lineHeight: 1.7
        }}
        onFocus={e => e.target.style.border = `1px solid ${C.accent}`}
        onBlur={e => e.target.style.border = `1px solid ${C.border}`} />
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 11, color: C.muted, marginRight: 8 }}>Try:</span>
        {examples.map((ex, i) => (
          <button key={i} onClick={() => setInput(ex.text)}
            style={{
              marginRight: 6, marginBottom: 6, padding: "4px 10px", borderRadius: 20,
              border: `1px solid ${C.border}`, background: "transparent", color: C.muted,
              fontSize: 11, cursor: "pointer", fontFamily: "inherit"
            }}>
            {ex.label}
          </button>
        ))}
      </div>
      {error && <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>⚠ {error}</div>}
      {!skills ? (
        <button onClick={extractSkills} disabled={loading || !input.trim()}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: !loading && input.trim() ? `linear-gradient(135deg,${C.accent},${C.cyan})` : C.surface,
            color: !loading && input.trim() ? "#fff" : C.muted, fontSize: 15, fontWeight: 700,
            cursor: !loading && input.trim() ? "pointer" : "not-allowed", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s"
          }}>
          {loading ? <><Spinner /> Groq Analyzing...</> : "Extract My Skills →"}
        </button>
      ) : (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>
              Extracted Skill Profile
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {skills.skills?.map(s => (
                <div key={s.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", minWidth: 120 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: levelColor[s.level] || C.muted, fontWeight: 600, marginBottom: 4 }}>{s.level}</div>
                  <MatchBar pct={s.score * 10} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>{skills.summary}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {skills.recommended_roles?.map(r => <Tag key={r}>{r}</Tag>)}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.green}30`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>✦ Strengths</div>
              {skills.strengths?.map(s => <div key={s} style={{ fontSize: 12, color: C.text, marginBottom: 4 }}>• {s}</div>)}
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.amber}30`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>⚑ Gaps</div>
              {skills.gaps?.map(g => <div key={g} style={{ fontSize: 12, color: C.text, marginBottom: 4 }}>• {g}</div>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setSkills(null)}
              style={{
                flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.border}`,
                background: "transparent", color: C.muted, fontSize: 14, cursor: "pointer", fontFamily: "inherit"
              }}>
              ← Re-analyze
            </button>
            <button onClick={() => onNext({ ...profile, skills, rawInput: input })}
              style={{
                flex: 2, padding: "12px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg,${C.accent},${C.cyan})`,
                color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                boxShadow: `0 4px 24px ${C.accent}40`
              }}>
              Find Matching Jobs →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function MatchStep({ profile, onNext, onBack }) {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/jobs/match`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: profile.skills?.skills || [], opp_type: profile.type || "internship" })
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  const platforms = ["All", "Rozee.pk", "Internshala"];
  const filtered = filter === "All" ? jobs : jobs.filter(j => j.platform === filter);
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const matchColor = m => m >= 75 ? C.green : m >= 55 ? C.amber : C.red;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <BackBtn onClick={onBack} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, fontFamily: "'Space Mono',monospace" }}>
            Matched Opportunities
          </h2>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>Ranked by profile match score</p>
        </div>
        {!loading && <Tag color={C.cyan}>{jobs.length} found</Tag>}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, marginTop: 16 }}>
        {platforms.map(p => (
          <button key={p} onClick={() => setFilter(p)}
            style={{
              padding: "6px 16px", borderRadius: 20,
              border: `1px solid ${filter === p ? C.accent : C.border}`,
              background: filter === p ? C.accentLo : "transparent",
              color: filter === p ? C.accent : C.muted,
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
            }}>
            {p}
          </button>
        ))}
        {!loading && (
          <button onClick={fetchJobs}
            style={{
              marginLeft: "auto", padding: "6px 14px", borderRadius: 20, border: `1px solid ${C.border}`,
              background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit"
            }}>
            ↻ Refresh
          </button>
        )}
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ marginBottom: 12 }}><Spinner /></div>
          <div style={{ fontSize: 13 }}>Scanning opportunities...</div>
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div>Koi job nahi mili — Refresh try karo</div>
        </div>
      ) : (
        <>
          <div style={{
            display: "flex", flexDirection: "column", gap: 12, maxHeight: 400, overflowY: "auto",
            paddingRight: 4, scrollbarWidth: "thin", scrollbarColor: `${C.dim} transparent`
          }}>
            {filtered.map((job, idx) => {
              const jobId = job.id || String(idx);
              const isSel = selected.includes(jobId);
              return (
                <div key={jobId} onClick={() => toggle(jobId)}
                  style={{
                    background: isSel ? C.accentLo : C.card,
                    border: `1px solid ${isSel ? C.accent : C.border}`,
                    borderRadius: 14, padding: 16, cursor: "pointer", transition: "all 0.2s",
                    boxShadow: isSel ? `0 0 20px ${C.accent}20` : "none"
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{job.title}</span>
                        {isSel && <Tag color={C.accent}>✓ Shortlisted</Tag>}
                      </div>
                      <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>
                        {job.company} · {job.location} · {job.platform}
                      </div>
                      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 10 }}>{job.description}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Tag color={C.green}>{job.stipend || job.type}</Tag>
                        <Tag color={C.cyan}>{job.type}</Tag>
                      </div>
                    </div>
                    {job.match && (
                      <div style={{ textAlign: "center", minWidth: 70 }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: matchColor(job.match), fontFamily: "'Space Mono',monospace" }}>
                          {job.match}%
                        </div>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>MATCH</div>
                        <MatchBar pct={job.match} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <div style={{
              flex: 1, background: C.surface, borderRadius: 12, padding: "12px 16px",
              border: `1px solid ${C.border}`, fontSize: 13, color: C.muted, display: "flex", alignItems: "center"
            }}>
              {selected.length === 0 ? "Tap listings to shortlist" : `${selected.length} shortlisted`}
            </div>
            <button
              onClick={() => selected.length && onNext({ ...profile, shortlisted: jobs.filter(j => selected.includes(j.id || String(jobs.indexOf(j)))) })}
              disabled={selected.length === 0}
              style={{
                padding: "12px 24px", borderRadius: 12, border: "none",
                background: selected.length ? `linear-gradient(135deg,${C.accent},${C.cyan})` : C.surface,
                color: selected.length ? "#fff" : C.muted, fontSize: 14, fontWeight: 700,
                cursor: selected.length ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s"
              }}>
              Apply to {selected.length || ""} Selected →
            </button>
          </div>
        </>
      )}
    </div>
  );
}


function ApplyStep({ profile, onBack }) {
  const jobs = profile.shortlisted || [];

  const [current, setCurrent] = useState(0);
  const [sessionValid, setSessionValid] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState([]);

  const job = jobs[current];

  // Component load hone pe session check karo
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch(`${BASE}/api/internshala/session?student_id=${profile.student_id}`);
      const data = await res.json();
      setSessionValid(data.logged_in);
    } catch {
      setSessionValid(false);
    }
  };

  // Internshala login — user khud browser mein login karega
  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch(`${BASE}/api/internshala/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: profile.student_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionValid(true);
      } else {
        setLoginError(data.message || "Login fail ho gaya — dobara try karo");
      }
    } catch {
      setLoginError("Backend se connect nahi ho saka");
    } finally {
      setLoginLoading(false);
    }
  };

  // Apply preview lo
  const handlePreview = async () => {
    setApplyLoading(true);
    setApplyError(null);
    setPreview(null);
    try {
      const res = await fetch(`${BASE}/api/internshala/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: profile.student_id,
          apply_link: job.apply_link,
          job_title: job.title,
          company: job.company,
          confirmed: false,
        }),
      });
      const data = await res.json();

      // Session expire ho gaya
      if (data.session_expired) {
        setSessionValid(false);
        return;
      }

      if (data.success) {
        setPreview(data.preview);
      } else {
        setApplyError(data.message);
      }
    } catch {
      setApplyError("Kuch ghalat hua — dobara try karo");
    } finally {
      setApplyLoading(false);
    }
  };

  // Final apply
  const handleConfirmApply = async () => {
    setApplyLoading(true);
    setApplyError(null);
    try {
      const res = await fetch(`${BASE}/api/internshala/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: profile.student_id,
          apply_link: job.apply_link,
          job_title: job.title,
          company: job.company,
          confirmed: true,
        }),
      });
      const data = await res.json();

      if (data.session_expired) {
        setSessionValid(false);
        return;
      }

      if (data.success) {
        setSubmitted((s) => [...s, current]);
        setPreview(null);
        setConfirmed(false);
        if (current < jobs.length - 1) {
          setCurrent((c) => c + 1);
        }
      } else {
        setApplyError(data.message);
      }
    } catch {
      setApplyError("Apply fail ho gaya — dobara try karo");
    } finally {
      setApplyLoading(false);
    }
  };

  // Sab submit ho gaye
  if (submitted.length === jobs.length && jobs.length > 0) {
    return (
      <div style={{ animation: "fadeUp 0.4s ease", textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>
          Sab Applications Submit Ho Gayi!
        </h2>
        <p style={{ color: C.muted, fontSize: 14 }}>
          {jobs.length} jobs pe apply kar diya — fingers crossed! 🤞
        </p>
        <button
          onClick={onBack}
          style={{
            marginTop: 28, padding: "12px 24px", borderRadius: 12,
            border: `1px solid ${C.border}`, background: "transparent",
            color: C.muted, fontSize: 14, cursor: "pointer", fontFamily: "inherit"
          }}>
          ← Back to Matches
        </button>
      </div>
    );
  }

  // Session check ho raha hai
  if (sessionValid === null) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
        <Spinner />
        <div style={{ marginTop: 12, fontSize: 13 }}>Session check ho raha hai...</div>
      </div>
    );
  }

  // Session nahi hai — login form dikhao
  if (!sessionValid) {
    return (
      <div style={{ animation: "fadeUp 0.4s ease" }}>
        <BackBtn onClick={onBack} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>
          Internshala Login
        </h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
          Apply karne ke liye pehle Internshala account se login karo.
        </p>

        <p style={{ color: C.muted, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
          Click karne pe ek browser window khulega — wahan apna email/password khud daal kar login karo (CAPTCHA aaye toh woh bhi khud solve karo). Login hote hi yahan automatically agla step khul jayega.
        </p>

        {loginError && (
          <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>⚠ {loginError}</div>
        )}

        <button
          onClick={handleLogin}
          disabled={loginLoading}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: !loginLoading ? `linear-gradient(135deg,${C.accent},${C.cyan})` : C.surface,
            color: !loginLoading ? "#fff" : C.muted,
            fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10
          }}>
          {loginLoading ? <><Spinner /> Waiting for login (browser khula hai)...</> : "Open Internshala Login →"}
        </button>
      </div>
    );
  }

  // Logged in — apply flow
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <BackBtn onClick={onBack} />

      {/* Progress */}
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
        Job {current + 1} of {jobs.length}
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4, fontFamily: "'Space Mono',monospace" }}>
        {job.title}
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>
        {job.company} · {job.location} · {job.platform}
      </p>

      {/* Job details card */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: 16, marginBottom: 20
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <Tag color={C.green}>{job.stipend || "See listing"}</Tag>
          <Tag color={C.cyan}>{job.type}</Tag>
          {job.match && <Tag color={C.accent}>{job.match}% Match</Tag>}
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{job.description}</p>
      </div>

      {/* Preview section */}
      {preview && (
        <div style={{
          background: C.surface, border: `1px solid ${C.amber}40`,
          borderRadius: 12, padding: 16, marginBottom: 16
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: C.amber,
            letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8
          }}>
            Application Preview
          </div>
          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {preview}
          </p>
        </div>
      )}

      {applyError && (
        <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>⚠ {applyError}</div>
      )}

      {/* Buttons */}
      {!preview ? (
        <button
          onClick={handlePreview}
          disabled={applyLoading}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: !applyLoading ? `linear-gradient(135deg,${C.accent},${C.cyan})` : C.surface,
            color: !applyLoading ? "#fff" : C.muted, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10
          }}>
          {applyLoading ? <><Spinner /> Opening Application...</> : "Preview Application →"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => { setPreview(null); setApplyError(null); }}
            style={{
              flex: 1, padding: "12px", borderRadius: 12,
              border: `1px solid ${C.border}`, background: "transparent",
              color: C.muted, fontSize: 14, cursor: "pointer", fontFamily: "inherit"
            }}>
            ← Cancel
          </button>
          <button
            onClick={handleConfirmApply}
            disabled={applyLoading}
            style={{
              flex: 2, padding: "12px", borderRadius: 12, border: "none",
              background: !applyLoading ? `linear-gradient(135deg,${C.green},${C.cyan})` : C.surface,
              color: !applyLoading ? "#fff" : C.muted, fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}>
            {applyLoading ? <><Spinner /> Applying...</> : "✓ Confirm & Apply"}
          </button>
        </div>
      )}

      {/* Skip button */}
      {!applyLoading && current < jobs.length - 1 && (
        <button
          onClick={() => { setCurrent((c) => c + 1); setPreview(null); setApplyError(null); }}
          style={{
            marginTop: 12, width: "100%", padding: "10px", borderRadius: 12,
            border: `1px solid ${C.border}`, background: "transparent",
            color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit"
          }}>
          Skip this job →
        </button>
      )}
    </div>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({});

  const next = (data) => { setProfile(p => ({ ...p, ...data })); setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, padding: "40px 20px", boxSizing: "border-box",
      display: "flex", justifyContent: "center", alignItems: "flex-start"
    }}>
      <div style={{ width: 480, background: C.surface, borderRadius: 20, padding: 30, boxShadow: `0 8px 32px ${C.accent}40` }}>
        <StepBar step={step} />
        {step === 0 && <ProfileStep onNext={next} />}
        {step === 1 && <SkillStep profile={profile} onNext={next} onBack={back} />}
        {step === 2 && <MatchStep profile={profile} onNext={next} onBack={back} />}
        {step === 3 && <ApplyStep profile={profile} onBack={back} />}
      </div>
    </div>
  );
}

export default App;