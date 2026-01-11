
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function useSubscription() {
  const { user } = useAuth();
  const [status, setStatus] = useState("free");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setStatus(snap.data().subscription || "free");
    };
    load();
  }, [user]);

  return status;
}
