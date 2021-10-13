import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAppStore } from "../AppContext";
import { useUserStore } from "../User/UserContext";
import { CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM } from "./RoomSchema";
import { RoomTaskStoreProvider } from "../RoomTask/RoomTaskContext";
import { RoomNoteStoreProvider } from "../RoomNote/RoomNoteContext";
import { ChatRoomStoreProvider } from "../ChatContext";

const RoomStore = React.createContext(null);
RoomStore.displayName = "RoomStore";

export const useRoomStore = () => React.useContext(RoomStore);

export const RoomStoreProvider = ({ children }) => {
  const { user, refreshData } = useAppStore();
  const { userData, refetchUser, checkUser } = useUserStore();

  const [createRoom] = useMutation(CREATE_ROOM);
  const [enterRoom] = useMutation(JOIN_ROOM);
  const [leaveRoom] = useMutation(LEAVE_ROOM);

  // create new room
  const createNewRoom = async (roomName: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await createRoom({
        variables: {
          roomName,
          userEmail: user.email,
        },
      });
      console.log(data);
      refetchUser({ email: user.email });
      return data;
    }
  };

  // join room
  const joinRoom = async (roomID: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await enterRoom({
        variables: {
          roomID,
          userEmail: user.email,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // leave room
  const quitRoom = async (roomID: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await leaveRoom({
        variables: {
          roomID,
          userEmail: user.email,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  return (
    <RoomStore.Provider value={{ createNewRoom, joinRoom, quitRoom }}>
      <RoomTaskStoreProvider>
        <RoomNoteStoreProvider>
          <ChatRoomStoreProvider>{children}</ChatRoomStoreProvider>
        </RoomNoteStoreProvider>
      </RoomTaskStoreProvider>
    </RoomStore.Provider>
  );
};
