import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are AgriMedha AI, an expert agricultural assistant for Indian farmers. 
You help with:
- Crop selection based on soil type, pH, NPK values, season, and location
- Fertilizer recommendations and application schedules
- Pest and disease identification and treatment
- Irrigation advice and water management
- Weather impact on farming decisions
- Market price trends and selling strategies
- Organic farming practices
- Government schemes and MSP information
- Soil health improvement techniques

Always give practical, actionable advice. Keep responses concise and farmer-friendly.
Support queries in English, Hindi, Kannada, Punjabi, Telugu, and Marathi.
When answering, use simple language that a farmer can understand.`;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const QUICK_QUESTIONS = [
  'Best crops for black soil?',
  'Yellow leaves on tomato?',
  'Urea dose for wheat?',
  'How to improve soil health?',
];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! 🌾 I\'m AgriMedha AI. Ask me anything about crops, soil, fertilizers, pests, or farming practices. I support Hindi, Kannada, Punjabi, Telugu, and Marathi too!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function sendMessage(text?: string) {
    const userText = text ?? input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    if (!apiKey || apiKey === 'your_gemini_api_key') {
      setMessages([...newMessages, {
        role: 'assistant',
        content: '⚠️ Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.\n\nGet a free key at: https://aistudio.google.com/app/apikey'
      }]);
      setLoading(false);
      return;
    }

    try {
      // Build conversation history for Gemini
      const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUser: ' + userText }] },
        ...newMessages.slice(1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      ];

      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT }]
            },
            ...newMessages.slice(1).map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: userText }] }
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      });

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?? 'Sorry, I could not get a response. Please try again.';

      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.'
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', transition: 'transform 0.2s',
        }}
        title="AgriMedha AI Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 999,
          width: 360, height: 520, background: '#fff',
          borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
            padding: '12px 16px', color: '#fff',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: '1.4rem' }}>🌿</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AgriMedha AI</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Powered by Gemini 1.5 Flash</div>
            </div>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#69f0ae' }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '85%', padding: '8px 12px', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? '#1b5e20' : '#f1f8e9',
                  color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                  fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f1f8e9', borderRadius: '12px 12px 12px 2px', padding: '8px 14px', fontSize: '1.2rem' }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>⏳</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  style={{
                    background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 20,
                    padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', color: '#1b5e20',
                  }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about crops, soil, pests…"
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid #ddd',
                fontSize: '0.85rem', outline: 'none',
              }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{
                background: '#1b5e20', color: '#fff', border: 'none', borderRadius: '50%',
                width: 36, height: 36, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
