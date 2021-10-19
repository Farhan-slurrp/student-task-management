import React, { ReactElement } from "react";
import Head from "next/head";
import AddIcon from "@material-ui/icons/Add";
import { useUserStore } from "../../../../stores/User/UserContext";
import { useRouter } from "next/router";
import { useAppStore } from "../../../../stores/AppContext";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { format } from "date-fns";
import NoteMenu from "../../../../components/note/NoteMenu";
import Link from "next/link";
import Tooltip from "@material-ui/core/Tooltip";

interface Props {}

export default function RoomNotes({}: Props): ReactElement {
  const { user } = useAppStore();
  const { userData } = useUserStore();
  const router = useRouter();
  const roomId = router.query["room-id"];
  const { refreshData } = useAppStore();

  React.useEffect(() => {
    refreshData();
  }, []);

  const getUserNotes = () => {
    if (!userData) return [];
    return userData.user.rooms.find((room) => room.id == roomId).notes;
  };

  const isCurrentUserAdmin = () => {
    return userData.user.rooms
      .find((room) => room.id == roomId)
      .members.find((member) => member.userData.email == userData.user.email)
      .isAdmin;
  };

  const notesData = getUserNotes();

  return (
    <>
      <Head>
        <title>Student Task Management | Room Note</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Room Note"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col h-auto gap-6 px-4 pt-12 pb-6 md:px-12">
        <h1 className="text-4xl font-bold text-gray-800">All Notes</h1>
        <p className="w-full text-justify md:w-1/2">
          Create or Read room notes here.
          <br />
          Click
          <span className="px-1 m-1 font-semibold text-gray-700 bg-gray-100">
            <AddIcon fontSize="small" /> New Note
          </span>
          {"  "}
          to create a new note.
          <br />
          Click menu icon in an existing note to update or edit note.
        </p>
        <button className="justify-start hidden pt-6 cursor-default md:flex">
          <p
            onClick={() => router.push(`/rooms/${roomId}/notes/create`)}
            className="p-2 font-semibold text-white align-middle bg-blue-500 rounded-md shadow-sm cursor-pointer"
          >
            <AddIcon fontSize="small" /> New Note
          </p>
        </button>
        {notesData.length > 0 ? (
          <div className="border-t border-l border-r border-gray-300">
            {notesData.map((note) => (
              <Link href={`/rooms/${roomId}/note/${note.id}`} key={note.id}>
                <div className="flex items-center justify-between p-3 border-b border-gray-300 cursor-pointer group hover:bg-gray-100">
                  <div className="flex flex-col justify-between w-full gap-2 md:items-center md:flex-row">
                    <p className="font-semibold">{note.title}</p>
                    <div className="flex flex-row-reverse items-center justify-end gap-2 md:justify-start md:flex-row">
                      <Tooltip
                        title={note.createdBy.email}
                        className="cursor-pointer"
                      >
                        <img
                          className="border border-white rounded-full"
                          width="20"
                          height="20"
                          src={`${note.createdBy.profPict}`}
                          alt="profPict"
                        />
                      </Tooltip>
                      <p className="text-gray-500">
                        Created at:{" "}
                        {format(new Date(note.createdAt), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`invisible ${
                      note.createdBy.email == userData.user.email ||
                      isCurrentUserAdmin()
                        ? "group-hover:visible"
                        : ""
                    }`}
                  >
                    <NoteMenu
                      id={note.id}
                      type="room"
                      isAdmin={isCurrentUserAdmin()}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-6">
            <DescriptionOutlinedIcon
              fontSize="large"
              className="text-gray-700 transform scale-150"
            />
            <p className="mt-4 font-medium text-center text-gray-700 md:text-base">
              The room currently have no note. <br />
              Start to make one to helps other members.
            </p>
          </div>
        )}
        <div className="block h-12 md:hidden"></div>
        <div className={`flex justify-end md:hidden bottom-5 right-5 fixed`}>
          <button
            onClick={() => router.push(`/rooms/${roomId}/notes/create`)}
            className="p-4 text-white bg-blue-500 rounded-full"
          >
            <AddIcon />
          </button>
        </div>
      </div>
    </>
  );
}
