import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi there! Tell me your mood, and I’ll suggest a book and a song just for you."
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { sender: "user", text: input }
    ]);
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        {
          sender: "bot",
          text: "✨ Great mood! (We'll connect the backend soon for real suggestions!)"
        }
      ]);
    }, 750);
    setInput("");
  }

  return (
    <div className="container">
      <div className="chatbox">
        <div className="avatar-bounce">
          <span className="avatar">🤖</span>
        </div>
        <div className="title">Feelsync</div>
        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`msg ${msg.sender === "user" ? "user" : "bot"}`}
            >
              <span>{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Type your mood (or use the mic)..."
            className="chat-input"
            autoFocus
          />
          <button className="send-btn" onClick={handleSend}>
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
