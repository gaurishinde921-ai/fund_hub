import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { setTyping } from "../utils/typing";
import "./Chat.css";

export default function Chat() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(false);

  /* ===============================
     REAL-TIME MESSAGES + READ RECEIPTS
  =============================== */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);

      // ✅ MARK MESSAGES AS READ
      for (const m of msgs) {
        if (
          m.senderId !== user.uid &&
          !m.readBy?.includes(user.uid)
        ) {
          await updateDoc(
            doc(db, "chats", chatId, "messages", m.id),
            {
              readBy: [...(m.readBy || []), user.uid],
            }
          );
        }
      }
    });

    return () => unsub();
  }, [chatId, user]);

  /* ===============================
     TYPING INDICATOR LISTENER
  =============================== */
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      const typing = snap.data()?.typing || {};
      setTypingUser(
        Object.entries(typing).some(
          ([uid, val]) => uid !== user.uid && val === true
        )
      );
    });

    return () => unsub();
  }, [chatId, user]);

  /* ===============================
     SEND MESSAGE
  =============================== */
  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: user.uid,
      text,
      createdAt: serverTimestamp(),
      readBy: [user.uid], // sender has read it
    });

    await updateDoc(doc(db, "chats", chatId), {
      updatedAt: serverTimestamp(),
      [`typing.${user.uid}`]: false,
    });

    setText("");
  };

  /* ===============================
     HANDLE TYPING
  =============================== */
  const handleTyping = (e) => {
    setText(e.target.value);
    setTyping(chatId, user.uid, true);
    setTimeout(() => setTyping(chatId, user.uid, false), 1200);
  };

  return (
    <div className="chat-wrap">
      <div className="chat-box">
        <div className="msgs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`msg ${m.senderId === user.uid ? "me" : "them"}`}
            >
              {m.text}

              {/* ✅ READ RECEIPT UI */}
              {m.senderId === user.uid && (
                <span className="read">
                  {m.readBy?.length > 1 ? "✓✓" : "✓"}
                </span>
              )}
            </div>
          ))}

          {typingUser && <div className="typing">typing…</div>}
        </div>

        <form className="send" onSubmit={send}>
          <input
            value={text}
            onChange={handleTyping}
            placeholder="Type a message…"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
