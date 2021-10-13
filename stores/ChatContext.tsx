import React from "react";
import { useAppStore } from "./AppContext";
import { useUserStore } from "./User/UserContext";
import firebase from "../firebase/clientApp";

/**
 * chat schema
 * {
 * roomId: ID
 * id: ID
 * content: string
 * user: {
 *      email
 *      displayname
 *      photoURL
 * }
 * }
 */

const ChatRoomStore = React.createContext(null);
ChatRoomStore.displayName = "ChatRoomStore";

export const useChatRoomStore = () => React.useContext(ChatRoomStore);

export const ChatRoomStoreProvider = ({ children }) => {
  const { user } = useAppStore();
  const { checkUser } = useUserStore();
  const db = firebase.firestore();

  // send new message
  const sendMessage = async (
    roomId: string,
    content: string,
    createdAt: Date
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      await db
        .collection("rooms")
        .doc(roomId)
        .collection("chats")
        .doc()
        .set({
          content,
          createdAt,
          createdBy: {
            email: user.email,
            profPict: user.photoURL,
            name: user.displayName,
          },
        });
    }
  };

  // delete message
  const deleteMessage = async (roomId: string, id: string) => {
    const isUser = await checkUser();
    if (isUser) {
      await db
        .collection("rooms")
        .doc(roomId)
        .collection("chats")
        .doc(id)
        .delete();
    }
  };

  return (
    <ChatRoomStore.Provider
      value={{
        sendMessage,
        deleteMessage,
      }}
    >
      {children}
    </ChatRoomStore.Provider>
  );
};
