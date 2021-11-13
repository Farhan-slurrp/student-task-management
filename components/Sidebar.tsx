import React, { Dispatch, SetStateAction } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import Accordion from "../components/Accordion";
import AccordionNoExpand from "./AccordionNoExpand";
import photoURL from "../src/profileImagePlaceholder";
import Link from "next/link";
import { useUserStore } from "../stores/User/UserContext";
import CloseIcon from "@material-ui/icons/Close";
import { useRouter } from "next/router";
import { useAppStore } from "../stores/AppContext";

export interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  const { userData } = useUserStore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useAppStore();

  const handleSignOut = async () => {
    await firebase.auth().signOut();
    return router.replace("/login");
  };

  return (
    <div className="sticky top-0 z-50 flex flex-col items-center w-full h-screen gap-4 py-8 overflow-y-auto bg-gray-800 shadow-md">
      <div
        className="flex justify-end w-full px-4 py-2 -mt-6 text-white md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <CloseIcon />
      </div>
      <Link href="/">
        <img
          src={user?.photoURL ? user.photoURL : photoURL}
          alt="profile"
          sizes="1rem"
          className="border-2 border-gray-300 rounded-full cursor-pointer"
        />
      </Link>
      <div className="grid pt-2 overflow-hidden place-items-center">
        <h2 className="text-lg text-white font-lg">{user?.displayName}</h2>
        <h3 className="text-gray-300">{user?.email}</h3>
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
      <div className="flex flex-col py-12 md:hidden">
        <button
          onClick={handleSignOut}
          className="px-4 py-1.5 font-semibold text-white bg-red-500 border border-red-500 rounded-md align-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
