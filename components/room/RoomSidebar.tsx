import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../firebase/clientApp";
import AccordionNoExpand from "../AccordionNoExpand";
import Accordion from "../Accordion";
import photoURL from "../../src/profileImagePlaceholder";
import Link from "next/link";
import { useUserStore } from "../../stores/User/UserContext";
import { useRouter } from "next/router";

export interface RoomSidebarProps {}

const RoomSidebar: React.FunctionComponent<RoomSidebarProps> = () => {
  const { userData } = useUserStore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const router = useRouter();
  const linkValue = `stm/joinroom/${router.query["room-id"]}`;

  const members =
    userData &&
    userData.user.rooms.find((room) => room.id === router.query["room-id"])
      .members;

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
      <div className="grid px-6 pt-2 place-items-center">
        <h2 className="text-xl text-white font-lg">{user.displayName}</h2>
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
    </div>
  );
};

export default RoomSidebar;
