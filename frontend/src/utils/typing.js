import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const setTyping = async (chatId, uid, isTyping) => {
  await updateDoc(doc(db, "chats", chatId), {
    [`typing.${uid}`]: isTyping
  });
};
