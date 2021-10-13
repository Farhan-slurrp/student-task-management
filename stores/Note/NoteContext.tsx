import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAppStore } from "../AppContext";
import { useUserStore } from "../User/UserContext";
import {
  ADD_NOTE_SECTION,
  DELETE_NOTE_SECTION,
  EDIT_NOTE_SECTION,
  ADD_NOTE,
  DELETE_NOTE,
  EDIT_NOTE,
} from "./NoteSchema";

const NoteStore = React.createContext(null);
NoteStore.displayName = "NoteStore";

export const useNoteStore = () => React.useContext(NoteStore);

export const NoteStoreProvider = ({ children }) => {
  const { user } = useAppStore();
  const { userData, refetchUser, checkUser } = useUserStore();

  const [createNoteSection] = useMutation(ADD_NOTE_SECTION);
  const [deleteNoteSection] = useMutation(DELETE_NOTE_SECTION);
  const [editNoteSection] = useMutation(EDIT_NOTE_SECTION);
  const [createPersonalNote] = useMutation(ADD_NOTE);
  const [deletePersonalNote] = useMutation(DELETE_NOTE);
  const [editPersonalNote] = useMutation(EDIT_NOTE);

  // create new task section
  const saveNoteSection = async (title: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await createNoteSection({
        variables: {
          title,
          userEmail: user.email,
        },
      });
      console.log(data);
      refetchUser({ email: user.email });
      return data;
    }
  };

  // remove note section
  const removeNoteSection = async (id: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await deleteNoteSection({
        variables: {
          userEmail: user.email,
          id,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // edit note section
  const editNoteSectionTitle = async (id: string, title: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await editNoteSection({
        variables: {
          userEmail: user.email,
          id,
          title,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // add personal task
  const savePersonalNote = async (
    title: string,
    content: string,
    createdAt: Date,
    sectionId: string
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await createPersonalNote({
        variables: {
          title,
          content,
          createdAt,
          sectionId,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // delete personal note
  const removePersonalNote = async (id: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await deletePersonalNote({
        variables: {
          id,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // edit personal Note
  const updatePersonalNote = async (
    id: string,
    title?: string,
    content?: string,
    updatedAt?: Date,
    sectionId?: string
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await editPersonalNote({
        variables: {
          id,
          title,
          content,
          updatedAt,
          sectionId,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  return (
    <NoteStore.Provider
      value={{
        saveNoteSection,
        removeNoteSection,
        editNoteSectionTitle,
        savePersonalNote,
        removePersonalNote,
        updatePersonalNote,
      }}
    >
      {children}
    </NoteStore.Provider>
  );
};
