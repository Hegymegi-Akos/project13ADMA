import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messagesAPI } from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    loadConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Frissites 5 masodpercenkent
  useEffect(() => {
    if (!activeChat) return;
    const interval = setInterval(() => loadMessages(activeChat.id), 5000);
    return () => clearInterval(interval);
  }, [activeChat]);

  const loadConversations = async () => {
    try {
      const data = await messagesAPI.getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  const loadMessages = async (userId) => {
    try {
      const data = await messagesAPI.getConversation(userId);
      setMessages(Array.isArray(data) ? data : []);
    } catch {}
  };

  const openChat = async (conv) => {
    setActiveChat(conv);
    await loadMessages(conv.id);
    // Frissitsd a listat (olvasatlan szam)
    loadConversations();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeChat) return;
    setSending(true);
    try {
      await messagesAPI.send(activeChat.id, newMsg.trim());
      setNewMsg('');
      await loadMessages(activeChat.id);
      loadConversations();
    } catch {}
    finally { setSending(false); }
  };

  if (loading) return <div className="container page" style={{ textAlign: 'center', padding: 60 }}>Betoltes...</div>;

  return (
    <main className="container page">
      <h1 className="page-title">Uzeneteim</h1>

      <div style={{ display: 'grid', gridTemplateColumns: activeChat ? '280px 1fr' : '1fr', gap: 16, minHeight: 500 }}>
        {/* Beszelgetesek lista */}
        <div className="ui-card" style={{ padding: 0, overflow: 'hidden', display: activeChat && window.innerWidth < 700 ? 'none' : 'block' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', fontWeight: 700, fontSize: '0.95rem' }}>
            Beszelgetesek
          </div>
          {conversations.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Meg nincs beszelgetesed.
            </div>
          ) : (
            conversations.map(conv => (
              <div key={conv.id} onClick={() => openChat(conv)} style={{
                padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)',
                background: activeChat?.id === conv.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                transition: 'background 150ms',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{conv.felhasznalonev}</strong>
                  {Number(conv.olvasatlan) > 0 && (
                    <span style={{ background: '#ef4444', color: '#fff', borderRadius: 999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700 }}>{conv.olvasatlan}</span>
                  )}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.utolso_uzenet}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Chat ablak */}
        {activeChat && (
          <div className="ui-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Chat header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))' }}>
              <button onClick={() => setActiveChat(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: 4 }}>←</button>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{activeChat.felhasznalonev}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeChat.email}</div>
              </div>
            </div>

            {/* Uzenetek */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 300, maxHeight: 400 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, fontSize: '0.9rem' }}>
                  Kezdj el beszelgetni!
                </div>
              )}
              {messages.map(msg => {
                const isMe = Number(msg.kuldo_id) === Number(user?.id);
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '75%', padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMe ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(0,0,0,0.05)',
                      color: isMe ? '#fff' : 'var(--text-primary)',
                    }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{msg.uzenet}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.65rem', opacity: 0.7, textAlign: 'right' }}>
                        {new Date(msg.letrehozva).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Uzenet kuldes */}
            <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8 }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Irj uzenetet..." style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '2px solid rgba(0,0,0,0.08)', fontSize: '0.9rem', outline: 'none' }} />
              <button type="submit" disabled={sending || !newMsg.trim()} style={{
                padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                opacity: sending || !newMsg.trim() ? 0.5 : 1,
              }}>Kuldes</button>
            </form>
          </div>
        )}

        {!activeChat && conversations.length > 0 && (
          <div className="ui-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Valassz egy beszelgetest a bal oldalon.
          </div>
        )}
      </div>
    </main>
  );
};

export default Messages;