import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAppStore } from "../AppContext";
import { useUserStore } from "../User/UserContext";
import { ADD_NOTE, EDIT_NOTE, DELETE_NOTE } from "./RoomNoteSchema";

const RoomNoteStore = React.createContext(null);
RoomNoteStore.displayName = "RoomNoteStore";

export const useRoomNoteStore = () => React.useContext(RoomNoteStore);

export const RoomNoteStoreProvider = ({ children }) => {
  const { user } = useAppStore();
  const { userData, refetchUser, checkUser } = useUserStore();

  const [createRoomNote] = useMutation(ADD_NOTE);
  const [editRoomNote] = useMutation(EDIT_NOTE);
  const [deleteRoomNote] = useMutation(DELETE_NOTE);

  // add room task
  const saveRoomNote = async (
    title: string,
    content: string,
    createdAt: Date,
    roomId: string
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await createRoomNote({
        variables: {
          title,
          content,
          createdAt,
          createdBy: user.email,
          roomId,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // edit room Note
  const updateRoomNote = async (
    id: string,
    title?: string,
    content?: string,
    isAdmin?: boolean,
    updatedAt?: Date,
    updatedBy?: string,
    roomId?: string
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await editRoomNote({
        variables: {
          id,
          title,
          content,
          isAdmin,
          updatedAt,
          updatedBy,
          roomId,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // delete room note
  const removeRoomNote = async (id: string, isAdmin: boolean) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await deleteRoomNote({
        variables: {
          id,
          isAdmin,
          deletedBy: user.email,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  return (
    <RoomNoteStore.Provider
      value={{
        saveRoomNote,
        updateRoomNote,
        removeRoomNote,
      }}
    >
      {children}
    </RoomNoteStore.Provider>
  );
};
