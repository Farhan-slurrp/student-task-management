import React, { Dispatch, SetStateAction } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../firebase/clientApp";
import AccordionNoExpand from "../AccordionNoExpand";
import Accordion from "../Accordion";
import photoURL from "../../src/profileImagePlaceholder";
import Link from "next/link";
import { useUserStore } from "../../stores/User/UserContext";
import { useRouter } from "next/router";
import CloseIcon from "@material-ui/icons/Close";

export interface RoomSidebarProps {
  payload: {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  };
}

const RoomSidebar: React.FunctionComponent<RoomSidebarProps> = ({
  payload,
}) => {
  const { userData } = useUserStore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const router = useRouter();
  const linkValue = `stm/joinroom/${router.query["room-id"]}`;

  const handleSignOut = async () => {
    await firebase.auth().signOut();
    return router.replace("/login");
  };

  const members =
    userData &&
    userData.user.rooms.find((room) => room.id === router.query["room-id"])
      .members;

  return (
    <div className="sticky top-0 z-50 flex flex-col items-center w-full h-screen gap-4 py-8 overflow-y-auto bg-gray-800 shadow-md">
      <div
        className="flex justify-end w-full px-4 py-2 -mt-6 text-white md:hidden"
        onClick={() => payload.setIsSidebarOpen(!payload.isSidebarOpen)}
      >
        <CloseIcon />
      </div>
      <Link href="/">
        <img
          src={user.photoURL ? user.photoURL : photoURL}
          alt="profile"
          sizes="1rem"
          className="border-2 border-gray-300 rounded-full cursor-pointer"
        />
      </Link>
      <div className="grid px-6 pt-2 place-items-center">
        <h2 className="text-lg text-white font-lg">{user.displayName}</h2>
        <h3 className="text-gray-300">{user.email}</h3>
      </div>
      <div className="flex flex-col w-full mt-8">
        <AccordionNoExpand
          link={`/rooms/${router.query["room-id"]}/tasks`}
          path={`/rooms/[room-id]/tasks`}
          title="Tasks"
        />
        <AccordionNoExpand
          link={`/rooms/${router.query["room-id"]}/notes`}
          path={`/rooms/[room-id]/notes`}
          title="Notes"
        />
        <AccordionNoExpand
          link={`/rooms/${router.query["room-id"]}/files`}
          path={`/rooms/[room-id]/files`}
          title="Files"
        />
        <AccordionNoExpand
          link={`/rooms/${router.query["room-id"]}/timeline`}
          path={`/rooms/[room-id]/timeline`}
          title="Timeline"
        />
        <AccordionNoExpand
          link={`/rooms/${router.query["room-id"]}/chat`}
          path={`/rooms/[room-id]/chat`}
          title="Room Chat"
        />
        <Accordion
          title="Members"
          type="roomMembers"
          content={members}
          payload={linkValue}
        />
      </div>
      <div className="flex flex-col gap-4 py-12 md:hidden">
        <button
          onClick={handleSignOut}
          className="px-4 py-1.5 font-semibold text-white bg-red-500 border border-red-500 rounded-md align-center"
        >
          Logout
        </button>
        {router.route.includes("/rooms/[room-id]") && (
          <Link href="/">
            <button className="bg-white px-4 py-1.5 font-semibold text-gray-900 border border-gray-700 rounded-md hover:text-white hover:bg-gray-700 align-center">
              🏠 Back To Home
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RoomSidebar;
