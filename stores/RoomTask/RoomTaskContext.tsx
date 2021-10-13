import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAppStore } from "../AppContext";
import { useUserStore } from "../User/UserContext";
import firebase from "../../firebase/clientApp";
// import {
//   ADD_TASK,
//   EDIT_TASK,
//   DELETE_TASK,
//   STOP_WORKING_ON_TASK,
// } from "./RoomTaskSchema";

const RoomTaskStore = React.createContext(null);
RoomTaskStore.displayName = "RoomTaskStore";

export const useRoomTaskStore = () => React.useContext(RoomTaskStore);

export const RoomTaskStoreProvider = ({ children }) => {
  const { user } = useAppStore();
  const { checkUser } = useUserStore();
  // const [createRoomTask] = useMutation(ADD_TASK);
  // const [deleteRoomTask] = useMutation(DELETE_TASK);
  // const [editRoomTask] = useMutation(EDIT_TASK);
  // const [stopWorking] = useMutation(STOP_WORKING_ON_TASK);

  const db = firebase.firestore();

  const addRoomTask = async (
    content: string,
    status: string,
    progress: number,
    roomId: string,
    createdAt: Date,
    dueDate: Date,
    priority: string
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      await db
        .collection("rooms")
        .doc(roomId)
        .collection("tasks")
        .doc()
        .set({
          content,
          status,
          progress,
          roomId,
          createdAt,
          createdBy: {
            email: user.email,
            profPict: user.photoURL,
            name: user.displayName,
          },
          dueDate,
          priority,
        });
    }
  };

  // edit Room task
  const updateRoomTask = async ({
    id,
    content,
    status,
    progress,
    roomId,
    createdAt,
    updatedAt,
    dueDate,
    priority,
  }) => {
    const isUser = await checkUser();
    if (isUser) {
      await db.collection("rooms").doc(roomId).collection("tasks").doc(id).set(
        {
          content,
          status,
          progress,
          roomId,
          createdAt,
          updatedAt,
          dueDate,
          priority,
        },
        { merge: true }
      );
    }
  };

  // edit Room task
  const updateTaskByMoving = async ({
    roomId,
    id,
    status,
    updatedAt,
    workingOn,
    completedBy,
  }) => {
    const isUser = await checkUser();
    if (isUser) {
      await db.collection("rooms").doc(roomId).collection("tasks").doc(id).set(
        {
          status,
          updatedAt,
          workingOn,
          completedBy,
        },
        { merge: true }
      );
    }
  };

  // delete room task
  const removeRoomTask = async (roomId: string, id: string) => {
    const isUser = await checkUser();
    if (isUser) {
      await db
        .collection("rooms")
        .doc(roomId)
        .collection("tasks")
        .doc(id)
        .delete();
    }
  };

  // stop working on task
  const updateWorkingOnTask = async ({ roomId, id, updatedAt, workingOn }) => {
    const isUser = await checkUser();
    if (isUser) {
      await db.collection("rooms").doc(roomId).collection("tasks").doc(id).set(
        {
          roomId,
          updatedAt,
          workingOn,
        },
        { merge: true }
      );
    }
  };

  return (
    <RoomTaskStore.Provider
      value={{
        addRoomTask,
        updateRoomTask,
        updateTaskByMoving,
        removeRoomTask,
        updateWorkingOnTask,
      }}
    >
      {children}
    </RoomTaskStore.Provider>
  );
};
