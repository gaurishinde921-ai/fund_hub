import React, { useState, useEffect, useRef } from 'react';
import { 
  Paperclip, Send, MoreVertical, Copy, Trash2, 
  CheckCheck, X, Play, Lock, ShieldAlert, 
  CheckCircle2, MessageSquare, Pin, Reply, Trash, 
  Unlock, MoreHorizontal, Star
} from 'lucide-react';
import './Requests.css';

const INITIAL_CHATS = [
  { id: 1, user: 'Investor_Alpha', important: true, unread: true, img: 'https://i.pravatar.cc/150?u=1', isAccepted: false, isBlocked: false, messages: [{ id: 101, text: "I saw your pitch deck. Interested in the Series A.", sender: 'them', time: '10:42 AM', status: 'delivered', pinned: false, reactions: [] }] },
  { id: 2, user: 'Capital_Ventures', important: false, unread: false, img: 'https://i.pravatar.cc/150?u=2', isAccepted: true, isBlocked: false, messages: [{ id: 102, text: "Let's schedule a call for Monday.", sender: 'them', time: '09:15 AM', status: 'seen', pinned: false, reactions: [{ emoji: '👍', users: ['them'] }] }] },
  { id: 3, user: 'Sarah_Angel', important: true, unread: false, img: 'https://i.pravatar.cc/150?u=3', isAccepted: false, isBlocked: false, messages: [{ id: 103, text: "Do you have financial projections for Q4?", sender: 'them', time: 'Yesterday', status: 'seen', pinned: false, reactions: [] }] },
];

const Requests = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [modal, setModal] = useState({ show: false, type: '', title: '', targetId: null });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, msg: null });
  const [replyingTo, setReplyingTo] = useState(null);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const activeChat = chats.find(c => c.id === selectedId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isTyping, replyingTo]);

  const filteredChats = chats.filter(c => {
    if (filter === 'unread') return c.unread;
    if (filter === 'important') return c.important;
    return true;
  });

  const triggerModal = (type, title, targetId = null) => {
    setModal({ show: true, type, title, targetId });
  };

  const handleConfirm = () => {
    const { type, targetId } = modal;
    if (type === 'accept') {
      setChats(prev => prev.map(c => c.id === selectedId ? { ...c, isAccepted: true } : c));
    } else if (type === 'block') {
      setChats(prev => prev.map(c => c.id === selectedId ? { ...c, isBlocked: true } : c));
    } else if (type === 'unblock') {
      setChats(prev => prev.map(c => c.id === selectedId ? { ...c, isBlocked: false } : c));
    } else if (type === 'delete_chat') {
      setChats(prev => prev.filter(c => c.id !== selectedId));
      setSelectedId(null);
    } else if (type === 'delete_msg') {
      setChats(prev => prev.map(c => c.id === selectedId ? { 
        ...c, messages: c.messages.filter(m => m.id !== targetId) 
      } : c));
    }
    setModal({ show: false, type: '', title: '', targetId: null });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || !activeChat.isAccepted || activeChat.isBlocked) return;

    const newMsg = {
      id: Date.now(),
      text: inputValue,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      replyTo: replyingTo ? replyingTo.text : null,
      pinned: false,
      reactions: []
    };

    setChats(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, newMsg] } : c));
    setInputValue("");
    setReplyingTo(null);
  };

  // --- 🛠 FIX 2: Pin Logic ---
  const togglePin = (msgId) => {
    setChats(prev => prev.map(c => c.id === selectedId ? {
      ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, pinned: !m.pinned } : m)
    } : c));
    setContextMenu({ show: false });
  };

  // --- 🛠 FIX 3: Reaction Logic ---
  const handleReaction = (msgId, emoji) => {
    setChats(prev => prev.map(c => c.id === selectedId ? {
      ...c, messages: c.messages.map(m => {
        if (m.id !== msgId) return m;
        const reactions = [...(m.reactions || [])];
        const existingIdx = reactions.findIndex(r => r.emoji === emoji);
        
        if (existingIdx > -1) {
          const hasMe = reactions[existingIdx].users.includes('me');
          if (hasMe) {
            reactions[existingIdx].users = reactions[existingIdx].users.filter(u => u !== 'me');
            if (reactions[existingIdx].users.length === 0) reactions.splice(existingIdx, 1);
          } else {
            reactions[existingIdx].users.push('me');
          }
        } else {
          reactions.push({ emoji, users: ['me'] });
        }
        return { ...m, reactions };
      })
    } : c));
    setContextMenu({ show: false });
  };

  const pinnedMessages = activeChat?.messages.filter(m => m.pinned) || [];

  return (
    <div className="fundhub-dm-container" onClick={() => setContextMenu({ show: false })}>
      
      {isLocked && (
        <div className="unlock-screen">
          <div className="unlock-card">
            <div className="lock-icon-bg"><Lock size={40} /></div>
            <h2>Unlock Investor Inbox</h2>
            <p>Access direct communication with verified FundHub investors.</p>
            <button className="upgrade-confirm-btn" onClick={() => setIsLocked(false)}>Upgrade Now</button>
          </div>
        </div>
      )}

      {modal.show && (
        <div className="modal-overlay">
          <div className="v-modal">
            <h3>{modal.title}</h3>
            <p>Are you sure you want to proceed with this action?</p>
            <div className="v-modal-actions">
              <button className="v-cancel" onClick={() => setModal({ show: false })}>Cancel</button>
              <button className="v-proceed" onClick={handleConfirm}>Proceed</button>
            </div>
          </div>
        </div>
      )}

      <div className="dm-layout">
        <aside className="dm-sidebar">
          <div className="sidebar-header">
            <h3>Requests</h3>
            <div className="filter-tabs">
              <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
              <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button>
              <button className={filter === 'important' ? 'active' : ''} onClick={() => setFilter('important')}>Important</button>
            </div>
          </div>
          <div className="sidebar-scroll">
            {filteredChats.map(chat => (
              <div key={chat.id} className={`chat-row-item ${selectedId === chat.id ? 'selected' : ''}`} onClick={() => setSelectedId(chat.id)}>
                <div className="avatar-wrapper">
                  <img src={chat.img} alt="" />
                  {chat.unread && <span className="unread-dot" />}
                </div>
                <div className="row-body">
                  <div className="row-top">
                    <strong>{chat.user}</strong>
                    <span>{chat.messages[chat.messages.length - 1].time}</span>
                  </div>
                  <p>{chat.messages[chat.messages.length - 1].text || "Attachment"}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="dm-viewport">
          {activeChat ? (
            <div className="chat-engine">
              <header className="chat-nav">
                <div className="nav-user">
                  <img src={activeChat.img} alt="" />
                  <div>
                    <h4>{activeChat.user}</h4>
                    <span className="online-tag">Active now</span>
                  </div>
                </div>

                <div className="nav-actions">
                  {/* 🛠 FIX 1: Show Block/Delete even after Acceptance */}
                  <div className="logic-btns">
                    {!activeChat.isAccepted && !activeChat.isBlocked && (
                      <button className="btn-acc" onClick={() => triggerModal('accept', 'Accept Request')}><CheckCircle2 size={16}/> Accept</button>
                    )}
                    <button className="btn-blk" onClick={() => triggerModal(activeChat.isBlocked ? 'unblock' : 'block', activeChat.isBlocked ? 'Unblock Contact' : 'Block Contact')}><ShieldAlert size={16}/> {activeChat.isBlocked ? 'Unblock' : 'Block'}</button>
                    <button className="btn-del" onClick={() => triggerModal('delete_chat', 'Delete Conversation')}><Trash size={16}/> Delete</button>
                  </div>
                </div>
              </header>

              {/* 🛠 FIX 2: Pinned Section Display */}
              {pinnedMessages.length > 0 && (
                <div className="pinned-header-bar">
                  <Pin size={14} className="pin-icon-main" />
                  <div className="pinned-msg-text">
                    Pinned: {pinnedMessages[pinnedMessages.length - 1].text || "Attachment"}
                  </div>
                  <X size={14} onClick={() => togglePin(pinnedMessages[pinnedMessages.length - 1].id)} style={{cursor: 'pointer'}} />
                </div>
              )}

              {activeChat.isBlocked && (
                <div className="block-banner">
                  <ShieldAlert size={16} /> <span>You have blocked this contact.</span>
                </div>
              )}

              <div className="message-container">
                {activeChat.messages.map(m => (
                  <div key={m.id} className={`msg-bubble-wrapper ${m.sender} ${m.pinned ? 'is-pinned' : ''}`} onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ show: true, x: e.pageX, y: e.pageY, msg: m });
                  }}>
                    <div className="msg-bubble">
                      {m.pinned && <Pin size={12} className="bubble-pin-indicator" />}
                      {m.replyTo && <div className="reply-quote">{m.replyTo}</div>}
                      {m.type === 'image' && <img src={m.content} className="attachment-img" alt="" />}
                      {m.type === 'video' && <video src={m.content} className="attachment-vid" controls />}
                      {m.text && <p>{m.text}</p>}
                      <div className="bubble-footer">
                        {m.time}
                        {m.sender === 'me' && <div className={`status-ticks ${m.status}`}><CheckCheck size={14} /></div>}
                      </div>

                      {/* 🛠 FIX 3: WhatsApp Style Reaction Pills */}
                      {m.reactions?.length > 0 && (
                        <div className="reactions-pill-row">
                          {m.reactions.map(r => (
                            <div key={r.emoji} className={`reaction-pill ${r.users.includes('me') ? 'reacted' : ''}`} onClick={() => handleReaction(m.id, r.emoji)}>
                              {r.emoji} <span>{r.users.length > 1 ? r.users.length : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="msg-bubble-wrapper them">
                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <footer className="chat-footer">
                {replyingTo && (
                  <div className="reply-preview-bar">
                    <div className="reply-info">
                      <Reply size={14} /> <span>Replying to: {replyingTo.text}</span>
                    </div>
                    <X size={16} onClick={() => setReplyingTo(null)} style={{cursor:'pointer'}}/>
                  </div>
                )}
                
                <div className="input-row">
                  <button className="tool-btn" onClick={() => fileInputRef.current.click()}><Paperclip size={22}/></button>
                  <input type="file" hidden ref={fileInputRef} onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                      const url = URL.createObjectURL(file);
                      const newMsg = {
                        id: Date.now() + Math.random(),
                        type: file.type.startsWith('video') ? 'video' : 'image',
                        content: url,
                        sender: 'me',
                        time: 'Just now',
                        status: 'sent',
                        pinned: false,
                        reactions: []
                      };
                      setChats(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, newMsg] } : c));
                    });
                  }} multiple accept="image/*,video/*" />
                  
                  <div className="input-capsule">
                    {!activeChat.isAccepted ? (
                      <div className="locked-input-msg">Accept request to start chatting</div>
                    ) : activeChat.isBlocked ? (
                      <div className="locked-input-msg">Unblock contact to message</div>
                    ) : (
                      <input 
                        placeholder="Type your message..." 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                    )}
                  </div>

                  {inputValue.trim() && activeChat.isAccepted && !activeChat.isBlocked && (
                    <button className="send-action-btn" onClick={handleSendMessage}><Send size={20}/></button>
                  )}
                </div>
              </footer>
            </div>
          ) : (
            <div className="no-selection">
              <MessageSquare size={80} opacity={0.1}/>
              <p>Select an investor request to view history</p>
            </div>
          )}
        </main>
      </div>

      {contextMenu.show && (
        <div className="float-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <div className="emoji-reactions">
            {['❤️','🔥','👍','😂','💯'].map(emo => (
              <span key={emo} onClick={() => handleReaction(contextMenu.msg.id, emo)}>{emo}</span>
            ))}
          </div>
          <button onClick={() => {navigator.clipboard.writeText(contextMenu.msg.text); setContextMenu({show:false})}}><Copy size={16}/> Copy Message</button>
          <button onClick={() => {setReplyingTo(contextMenu.msg); setContextMenu({show:false})}}><Reply size={16}/> Reply</button>
          <button onClick={() => togglePin(contextMenu.msg.id)}><Pin size={16}/> {contextMenu.msg.pinned ? 'Unpin' : 'Pin'} Message</button>
          <button className="danger" onClick={() => triggerModal('delete_msg', 'Delete for Me', contextMenu.msg.id)}><Trash2 size={16}/> Delete for Me</button>
          <button className="danger" onClick={() => triggerModal('delete_msg', 'Delete for Everyone', contextMenu.msg.id)}><Trash2 size={16}/> Delete for Everyone</button>
        </div>
      )}
    </div>
  );
};

export default Requests;