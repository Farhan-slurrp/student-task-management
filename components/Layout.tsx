import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from "react";
import RoomSidebar from "./room/RoomSidebar";
import { useRouter } from "next/router";
import { useAppStore } from "../stores/AppContext";
import { useTaskStore } from "../stores/Task/TaskContext";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

export interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { activeTask, setActiveTask, isSidebarOpen } = useAppStore();
  const { updatePersonalTask } = useTaskStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!activeTask || !activeTask.estimatedTime) return;
    const onePercent: number = (activeTask.estimatedTime * 60 * 1000) / 100;
    let currProgress = activeTask.progress;
    const updateProgress = setInterval(async () => {
      currProgress += 1;
      if (currProgress <= 100) {
        await updatePersonalTask(
          activeTask.id,
          activeTask.content,
          activeTask.status,
          currProgress,
          activeTask.sectionId,
          new Date(Date.now()),
          activeTask.dueDate,
          activeTask.priority,
          activeTask.estimated
        );
      } else {
        setActiveTask(null);
        return;
      }
    }, onePercent * 1);
    return () => clearInterval(updateProgress);
  }, [activeTask]);

  const getSidebar = () => {
    if (router.route.includes("/rooms/[room-id]")) return <RoomSidebar />;
    return <Sidebar />;
  };

  return (
    <div
      className={`flex items-stretch w-auto font-opensans ${
        isSidebarOpen ? "overflow-y-hidden h-screen" : "h-auto"
      }`}
    >
      <div
        className={`${
          isSidebarOpen ? "absolute w-full h-screen" : "hidden"
        } md:w-1/4 md:flex`}
      >
        {getSidebar()}
      </div>
      <div className={`flex flex-col w-full`}>
        <NotificationContainer />
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
