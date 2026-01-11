import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import useSubscription from "../utils/useSubscription";
import { ensureChat } from "../utils/chatUtils";
import "./Requests.css";

export default function Requests() {
  const { user } = useAuth();
  const subscription = useSubscription();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "requests", user.uid, "items"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  // 🔒 Subscription lock
  if (subscription !== "premium") {
    return (
      <div className="lock-wrap">
        <div className="lock-card">
          <h2>🔒 Unlock Inbox</h2>
          <p>Subscribe to view & reply to messages</p>
          <a href="/subscription">Upgrade Now</a>
        </div>
      </div>
    );
  }

  // ✅ Accept request → create chat → navigate
  const acceptRequest = async (req) => {
    const chatId = await ensureChat(user.uid, req.senderId);

    await updateDoc(doc(db, "requests", user.uid, "items", req.id), {
      status: "accepted",
      unread: false,
    });

    navigate(`/chat/${chatId}`);
  };

  const declineRequest = async (id) => {
    await updateDoc(doc(db, "requests", user.uid, "items", id), {
      status: "declined",
    });
  };

  return (
    <div className="req-wrap">
      <h2>Message Requests</h2>

      {requests.length === 0 && <p>No new requests</p>}

      {requests.map((r) => (
        <div
          key={r.id}
          className={`req-card ${r.unread ? "unread" : ""}`}
        >
          <div className="info">
            <strong>{r.senderName}</strong>
            <p>{r.message}</p>
          </div>

          <div className="actions">
            <button className="accept" onClick={() => acceptRequest(r)}>
              Accept
            </button>
            <button className="decline" onClick={() => declineRequest(r.id)}>
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
