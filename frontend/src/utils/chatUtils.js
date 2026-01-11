import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const createChatId = (uid1, uid2) =>
  [uid1, uid2].sort().join("_");

export const ensureChat = async (uid1, uid2) => {
  const chatId = createChatId(uid1, uid2);
  await setDoc(
    doc(db, "chats", chatId),
    {
      users: [uid1, uid2],
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return chatId;
};
