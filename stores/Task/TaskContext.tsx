import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAppStore } from "../AppContext";
import { useUserStore } from "../User/UserContext";
import {
  ADD_TASK_SECTION,
  DELETE_TASK_SECTION,
  EDIT_TASK_SECTION,
  ADD_TASK,
  EDIT_TASK,
  DELETE_TASK,
} from "./TaskSchema";

const TaskStore = React.createContext(null);
TaskStore.displayName = "TaskStore";

export const useTaskStore = () => React.useContext(TaskStore);

export const TaskStoreProvider = ({ children }) => {
  const { user } = useAppStore();
  const { userData, refetchUser, checkUser } = useUserStore();

  const [createTaskSection] = useMutation(ADD_TASK_SECTION);
  const [deleteTaskSection] = useMutation(DELETE_TASK_SECTION);
  const [editTaskSection] = useMutation(EDIT_TASK_SECTION);
  const [createPersonalTask] = useMutation(ADD_TASK);
  const [editPersonalTask] = useMutation(EDIT_TASK);
  const [deletePersonalTask] = useMutation(DELETE_TASK);

  // create new task section
  const saveTaskSection = async (title: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await createTaskSection({
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

  // delete task section
  const removeTaskSection = async (id: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await deleteTaskSection({
        variables: {
          userEmail: user.email,
          id,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // edit task section
  const editTaskSectionTitle = async (id: string, title: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await editTaskSection({
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
  const savePersonalTask = async (
    content: string,
    status: string,
    progress: number,
    sectionId: string,
    createdAt: Date,
    dueDate: Date,
    priority: string,
    estimatedTime: number
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await createPersonalTask({
        variables: {
          content,
          status,
          progress,
          sectionId,
          createdAt,
          dueDate,
          priority,
          estimatedTime,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // edit personal task
  const updatePersonalTask = async (
    id: string,
    content?: string,
    status?: string,
    progress?: number,
    sectionId?: string,
    updatedAt?: Date,
    dueDate?: Date,
    priority?: string,
    estimatedTime?: number
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await editPersonalTask({
        variables: {
          id,
          content,
          status,
          progress,
          sectionId,
          updatedAt,
          dueDate,
          priority,
          estimatedTime,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // delete personal task
  const removePersonalTask = async (id: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await deletePersonalTask({
        variables: {
          id,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  return (
    <TaskStore.Provider
      value={{
        saveTaskSection,
        removeTaskSection,
        editTaskSectionTitle,
        savePersonalTask,
        updatePersonalTask,
        removePersonalTask,
      }}
    >
      {children}
    </TaskStore.Provider>
  );
};
