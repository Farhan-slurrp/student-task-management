import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import Accordion from "../components/Accordion";
import AccordionNoExpand from "./AccordionNoExpand";
import photoURL from "../src/profileImagePlaceholder";
import Link from "next/link";
import { useUserStore } from "../stores/User/UserContext";

export interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  const { userData } = useUserStore();
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <div className="sticky top-0 flex flex-col items-center w-1/4 h-screen gap-4 py-8 overflow-y-auto bg-gray-800 shadow-md">
      <Link href="/">
        <img
          src={user.photoURL ? user.photoURL : photoURL}
          alt="profile"
          sizes="1rem"
          className="border-2 border-gray-300 rounded-full cursor-pointer"
        />
      </Link>
      <div className="grid pt-2 overflow-hidden place-items-center">
        <h2 className="text-xl text-white font-lg">{user.displayName}</h2>
        <h3 className="text-gray-300">{user.email}</h3>
      </div>
      <div className="flex flex-col w-full mt-8">
        <Accordion
          title="Task Sections"
          type="addTaskSection"
          content={
            userData
              ? userData.user
                ? userData.user.taskSections
                : null
              : null
          }
        />
        <Accordion
          title="Note Sections"
          type="addNoteSection"
          content={
            userData
              ? userData.user
                ? userData.user.noteSections
                : null
              : null
          }
        />
        <Accordion
          title="Rooms"
          type="rooms"
          content={
            userData ? (userData.user ? userData.user.rooms : null) : null
          }
        />
        <AccordionNoExpand link={`/calendar`} title="Calendar" />
        <AccordionNoExpand link={`/stats`} title="Stats" />
      </div>
    </div>
  );
};

export default Sidebar;
