import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminUsersAPI, isAllowedAdminUser, messagesAPI } from '../api/apiService';

const AdminUsers = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyUserId, setBusyUserId] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMsg, setChatMsg] = useState('');
  const [chatSending, setChatSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAllowedAdminUser(user)) { navigate('/admin'); return; }
    loadUsers();
  }, [isAuthenticated, user, navigate]);

  const loadUsers = async () => {
    try {
      const data = await adminUsersAPI.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (targetUser) => {
    const isAdmin = Number(targetUser.admin) === 1;
    if (!window.confirm(isAdmin ? `Elveszed az admin jogot "${targetUser.felhasznalonev}" felhasznalotol?` : `Admin jogot adsz "${targetUser.felhasznalonev}" felhasznalonak?`)) return;
    setError('');
    setBusyUserId(targetUser.id);
    try {
      await adminUsersAPI.toggleAdmin(targetUser.id, !isAdmin);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Muvelet sikertelen');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDelete = async (targetUser) => {
    if (!window.confirm(`Biztosan torlod "${targetUser.felhasznalonev}" felhasznalot? Ez torol minden hozzatartozo bejegyzest es velemenyt is!`)) return;
    setError('');
    setBusyUserId(targetUser.id);
    try {
      await adminUsersAPI.deleteUser(targetUser.id);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Torles sikertelen');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleBanToggle = async (targetUser) => {
    const isBanned = Number(targetUser.tiltva) === 1;
    let reason = '';
    if (!isBanned) {
      reason = window.prompt('Kitiltas oka (opcionalis):', targetUser.tiltas_oka || '') || '';
    }
    setError('');
    setBusyUserId(targetUser.id);
    try {
      await adminUsersAPI.setBanStatus(targetUser.id, !isBanned, reason.trim());
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Muvelet sikertelen');
    } finally {
      setBusyUserId(null);
    }
  };

  const openChat = async (targetUser) => {
    setChatUser(targetUser);
    try {
      const data = await messagesAPI.getConversation(targetUser.id);
      setChatMessages(Array.isArray(data) ? data : []);
    } catch { setChatMessages([]); }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !chatUser) return;
    setChatSending(true);
    try {
      await messagesAPI.send(chatUser.id, chatMsg.trim());
      setChatMsg('');
      const data = await messagesAPI.getConversation(chatUser.id);
      setChatMessages(Array.isArray(data) ? data : []);
    } catch {}
    finally { setChatSending(false); }
  };

  const handleViewOrders = async (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      setUserOrders([]);
      return;
    }
    setExpandedUser(userId);
    setOrdersLoading(true);
    try {
      const data = await adminUsersAPI.getUserOrders(userId);
      setUserOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setUserOrders([]);
      setError('Rendelesek betoltese sikertelen: ' + (err.message || ''));
    } finally {
      setOrdersLoading(false);
    }
  };

  const statusColors = {
    uj: '#3b82f6', feldolgozas: '#f59e0b', fizetve: '#8b5cf6', kesz: '#10b981', storno: '#ef4444'
  };
  const statusLabels = {
    uj: 'Uj', feldolgozas: 'Feldolgozas alatt', fizetve: 'Fizetve', kesz: 'Kesz', storno: 'Stornozva'
  };

  return (
    <main className="admin-page container page">
      <h1 className="page-title">Admin - Felhasznalok</h1>
      {error && <div style={{ color: '#ef4444', marginBottom: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

      {loading ? <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Betoltes...</p> : (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <table className="admin-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Felhasznalonev</th>
                <th>Email</th>
                <th>Nev</th>
                <th style={{ textAlign: 'center' }}>Admin</th>
                <th style={{ textAlign: 'center' }}>Tiltva</th>
                <th>Regisztralt</th>
                <th style={{ textAlign: 'center' }}>Muvelet</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <>
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.felhasznalonev}</td>
                    <td>{u.email}</td>
                    <td>{u.vezeteknev} {u.keresztnev}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700,
                        background: Number(u.admin) === 1 ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(100,116,139,0.15)',
                        color: Number(u.admin) === 1 ? '#fff' : 'var(--text-muted)'
                      }}>
                        {Number(u.admin) === 1 ? 'Igen' : 'Nem'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700,
                        background: Number(u.tiltva) === 1 ? '#ef4444' : '#dcfce7',
                        color: Number(u.tiltva) === 1 ? '#fff' : '#166534'
                      }}>
                        {Number(u.tiltva) === 1 ? 'Igen' : 'Nem'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(u.regisztralt).toLocaleDateString('hu-HU')}</td>
                    <td style={{ textAlign: 'center' }}>
                      {String(u.id) === String(user?.id) ? (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Sajat fiok</span>
                      ) : (
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => openChat(u)}
                            style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, background: '#6366f1', color: '#fff' }}
                          >
                            Uzenet
                          </button>
                          <button
                            onClick={() => handleViewOrders(u.id)}
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.8rem', background: expandedUser === u.id ? '#3b82f6' : undefined, color: expandedUser === u.id ? '#fff' : undefined }}
                          >
                            {expandedUser === u.id ? 'Bezar' : 'Rendelesek'}
                          </button>
                          <button
                            onClick={() => handleBanToggle(u)}
                            disabled={busyUserId === u.id}
                            className={Number(u.tiltva) === 1 ? 'btn-secondary' : 'btn-danger'}
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          >
                            {busyUserId === u.id ? 'Ment...' : Number(u.tiltva) === 1 ? 'Visszaenged' : 'Kitilt'}
                          </button>
                          <button
                            onClick={() => handleToggleAdmin(u)}
                            disabled={busyUserId === u.id}
                            className={Number(u.admin) === 1 ? 'btn-secondary' : 'btn-primary'}
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          >
                            {Number(u.admin) === 1 ? 'Admin elvesz' : 'Admin ad'}
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={busyUserId === u.id}
                            className="btn-danger"
                            style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#7f1d1d' }}
                          >
                            Torles
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedUser === u.id && (
                    <tr key={`orders-${u.id}`}>
                      <td colSpan={8} style={{ padding: 0, background: 'rgba(59,130,246,0.03)' }}>
                        <div style={{ padding: '16px 20px' }}>
                          <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700 }}>
                            {u.felhasznalonev} vasarlasi elozmenyei
                          </h4>
                          {ordersLoading ? (
                            <p style={{ color: 'var(--text-secondary)' }}>Betoltes...</p>
                          ) : userOrders.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nincs rendeles</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {userOrders.map(order => (
                                <div key={order.id} style={{
                                  background: 'var(--card, #fff)', borderRadius: 12, padding: '14px 18px',
                                  border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                                    <div>
                                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.rendeles_szam}</span>
                                      <span style={{ marginLeft: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {new Date(order.letrehozva).toLocaleDateString('hu-HU')}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                      <span style={{
                                        display: 'inline-block', padding: '2px 10px', borderRadius: 999,
                                        fontSize: '0.75rem', fontWeight: 700,
                                        background: statusColors[order.statusz] || '#94a3b8', color: '#fff'
                                      }}>
                                        {statusLabels[order.statusz] || order.statusz}
                                      </span>
                                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-primary, #3b82f6)' }}>
                                        {Number(order.osszeg).toLocaleString('hu-HU')} Ft
                                      </span>
                                    </div>
                                  </div>
                                  {/* Tételek */}
                                  {order.tetelek && order.tetelek.length > 0 && (
                                    <div style={{ marginTop: 6 }}>
                                      {order.tetelek.map((t, i) => (
                                        <div key={i} style={{
                                          display: 'flex', justifyContent: 'space-between', padding: '4px 0',
                                          fontSize: '0.85rem', color: 'var(--text-secondary)',
                                          borderTop: i > 0 ? '1px solid rgba(15,23,42,0.05)' : 'none'
                                        }}>
                                          <span>{t.termek_nev} x{t.mennyiseg}</span>
                                          <span style={{ fontWeight: 600 }}>{(Number(t.ar) * Number(t.mennyiseg)).toLocaleString('hu-HU')} Ft</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {/* Szállítási info */}
                                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                    <span>{order.szallitasi_mod}</span>
                                    <span>{order.fizetesi_mod}</span>
                                    {order.szallitasi_nev && <span>{order.szallitasi_nev}, {order.szallitasi_irsz} {order.szallitasi_varos}, {order.szallitasi_cim}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Chat modal */}
      {chatUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setChatUser(null)}>
          <div style={{ background: 'var(--surface-bg, #fff)', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))' }}>
              <div>
                <strong style={{ fontSize: '1rem' }}>{chatUser.felhasznalonev}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chatUser.email}</div>
              </div>
              <button onClick={() => setChatUser(null)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', width: 32, height: 32, borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 250, maxHeight: 400 }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, fontSize: '0.9rem' }}>Meg nincs uzenet. Irj elsokent!</div>
              )}
              {chatMessages.map(msg => {
                const isMe = Number(msg.kuldo_id) === Number(user?.id);
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '75%', padding: '10px 14px',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
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
            </div>

            {/* Send */}
            <form onSubmit={handleSendChat} style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8 }}>
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Irj uzenetet..." style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '2px solid rgba(0,0,0,0.08)', fontSize: '0.9rem', outline: 'none' }} />
              <button type="submit" disabled={chatSending || !chatMsg.trim()} style={{
                padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700,
                opacity: chatSending || !chatMsg.trim() ? 0.5 : 1,
              }}>{chatSending ? '...' : 'Kuldes'}</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminUsers;