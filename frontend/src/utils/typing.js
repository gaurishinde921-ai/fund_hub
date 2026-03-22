import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const setTyping = async (chatId, uid, isTyping) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      [`typing.${uid}`]: isTyping
    });
  } catch (error) {
    console.error("Error setting typing status:", error);
  }
};