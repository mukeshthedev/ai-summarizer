import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
 
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [file, setFile] = useState(null);
  const [summaryType, setSummaryType] = useState("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
 
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);
 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
 
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setError(null); setSummary(""); setChat([]); }
  };
 
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setError(null); setSummary(""); setChat([]); }
  };
 
  const handleSummarize = async () => {
    if (!file) return;
    setLoading(true); setError(null); setSummary("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const summaryRes = await axios.post("http://localhost:5000/summarize", {
        text: uploadRes.data.text,
        type: summaryType,
      });
      setSummary(summaryRes.data.message);
      setActiveTab("summary");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  const handleAsk = async () => {
    if (!question.trim()) return;
    const q = question; setQuestion("");
    setChat((prev) => [...prev, { question: q, answer: null }]);
    setAskLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/ask", { question: q, context: summary });
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = res.data.answer;
        return updated;
      });
    } catch {
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = "Failed to get an answer.";
        return updated;
      });
    } finally { setAskLoading(false); }
  };
 
  return (
    <div className="app">
      <div className="bg-grid"></div>
 
      {/* HEADER */}
      <header className="header">
        <div className="header-logo">Study<em>Mate</em></div>
        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill="currentColor"/>
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </g>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
          {darkMode ? "Light" : "Dark"}
        </button>
      </header>
 
      {/* MAIN */}
      <main className="main">
 
        {/* LEFT */}
        <div className="left">
 
          <div
            className={`dropzone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} style={{ display: "none" }} />
            <div className="dz-icon">
              {file ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <p className="dz-title">{file ? file.name : "Drop file here"}</p>
            <p className="dz-sub">{file ? "Click to change" : "PDF · DOCX · TXT"}</p>
          </div>
 
          <div className="field">
            <p className="field-label">Summary Length</p>
            <div className="tabs">
              {["short", "medium", "detailed"].map((t) => (
                <button key={t} className={`tab ${summaryType === t ? "active" : ""}`} onClick={() => setSummaryType(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
 
          <button className="sum-btn" onClick={handleSummarize} disabled={!file || loading}>
            {loading ? <><span className="spinner"></span> Summarizing...</> : "Summarize"}
          </button>
 
          {error && <p className="error">{error}</p>}
        </div>
 
        {/* RIGHT */}
        <div className="right">
          <div className="result-tabs">
            <button className={`rtab ${activeTab === "summary" ? "active" : ""}`} onClick={() => setActiveTab("summary")}>Summary</button>
            <button className={`rtab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>Q&amp;A Chat</button>
          </div>
 
          {/* SUMMARY TAB */}
          {activeTab === "summary" && (
            <div className="tab-body">
              {loading ? (
                <div className="center-state">
                  <div className="ring"><div/><div/><div/><div/></div>
                  <p className="loading-text">Summarizing your document...</p>
                </div>
              ) : summary ? (
                <div className="summary-card">
                  <div className="sc-top">
                    <span className="sc-label">AI Summary</span>
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(summary)}>
                      Copy
                    </button>
                  </div>
                  <p className="sc-body">{summary}</p>
                </div>
              ) : (
                <div className="center-state">
                  <span className="empty-icon">📄</span>
                  <p className="empty-title">No summary yet</p>
                  <p className="empty-sub">Upload a file and click Summarize</p>
                </div>
              )}
            </div>
          )}
 
          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div className="chat-wrap">
              <div className="messages">
                {chat.length === 0 ? (
                  <div className="center-state">
                    <span className="empty-icon">💬</span>
                    <p className="empty-title">No messages yet</p>
                    <p className="empty-sub">Summarize a document first, then ask questions</p>
                  </div>
                ) : (
                  chat.map((entry, i) => (
                    <div key={i} className="pair">
                      <div className="bubble user">{entry.question}</div>
                      <div className="bubble ai">
                        {entry.answer === null
                          ? <span className="dots"><span/><span/><span/></span>
                          : entry.answer}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef}/>
              </div>
              <div className="chat-bar">
                <input
                  className="chat-input"
                  type="text"
                  value={question}
                  placeholder="Ask about your document..."
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && question.trim() && !askLoading && handleAsk()}
                />
                <button className="send-btn" onClick={handleAsk} disabled={!question.trim() || askLoading}>
                  {askLoading ? <span className="spinner sm"/> : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
 
export default App;