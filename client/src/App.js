import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [theme, setTheme] = useState('light');
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi there! Tell me your mood, and I’ll suggest a book and a song just for you."
    }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Setup SpeechRecognition instance
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = event => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

async function handleSend() {
  if (!input.trim()) return;
  const userMessage = input;
  setInput("");

  // Add user's message and "bot is thinking..."
  setMessages(msgs => [
    ...msgs,
    { sender: "user", text: userMessage },
    { sender: "bot", text: "🤔 Thinking..." }
  ]);

  try {
    const res = await fetch("http://localhost:5000/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();

    // Replace "bot is thinking..." with actual reply
    setMessages(msgs => [
      ...msgs.slice(0, -1),
      { sender: "bot", text: data.reply }
    ]);
  } catch (err) {
    setMessages(msgs => [
      ...msgs.slice(0, -1),
      { sender: "bot", text: "⚠️ Sorry, server error!" }
    ]);
  }
}


  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  function handleMic() {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    } else if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }

  return (
    <div className={`container ${theme}`}>
      <div className="chatbox">
        <div className="header">
          <div className="title">Feelsync</div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="avatar-bounce">
          <span className="avatar">🤖</span>
        </div>
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.sender === "user" ? "user" : "bot"}`}>
              <span>{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area flex-bar">
          <button
            className={`mic-btn${listening ? " listening" : ""}`}
            onClick={handleMic}
            aria-label={listening ? "Stop recording" : "Start recording"}
            tabIndex="0"
            type="button"
          >
            <span role="img" aria-label="mic">
              {listening ? "🎤" : "🎙️"}
            </span>
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Type your mood or speak…"
            className="chat-input"
            autoFocus
          />
          <button className="send-btn" onClick={handleSend} aria-label="Send" tabIndex="0" type="button">
            ➤
          </button>
        </div>

        <div className="subtle-tip">
          Try saying <span className="hint">"I'm on top of the world!"</span> or <span className="hint">"Feeling mellow"</span>
        </div>
      </div>
    </div>
  );
}

export default App;
