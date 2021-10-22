import { useRouter } from "next/router";
import React from "react";
import { UserStoreProvider } from "./User/UserContext";
import { TaskStoreProvider } from "./Task/TaskContext";
import { RoomStoreProvider } from "./Room/RoomContext";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import Loading from "../components/Loading";
import { NoteStoreProvider } from "./Note/NoteContext";
import useLocalStorage from "../utils/hooks/useLocalStorage";

const AppStore = React.createContext(null);
AppStore.displayName = "AppStore";

export const useAppStore = () => React.useContext(AppStore);

export const AppStoreProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false);
  const [activeTask, setActiveTask] = useLocalStorage<any | null>(
    "activeTask",
    null
  );
  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  };

  React.useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/login");
  }, []);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [router]);

  // React.useEffect(() => {
  //   if (!user) {
  //     // go to login page if not logged in
  //     router.replace("/login");
  //   }
  // }, [user]);

  if (loading) return <Loading />;
  if (error) return <div>Error</div>;
  if (!user) {
    // go to login page if not logged in
    router.replace("/login");
  }

  const getTaskType = () => {
    if (router.route.includes("/rooms/[room-id")) return "room";
    if (router.route.includes("/task-sections/[section-id")) return "personal";
    return "";
  };

  return (
    <AppStore.Provider
      value={{
        refreshData,
        user,
        getTaskType,
        activeTask,
        setActiveTask,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      <UserStoreProvider>
        <TaskStoreProvider>
          <NoteStoreProvider>
            <RoomStoreProvider>{children}</RoomStoreProvider>
          </NoteStoreProvider>
        </TaskStoreProvider>
      </UserStoreProvider>
    </AppStore.Provider>
  );
};
