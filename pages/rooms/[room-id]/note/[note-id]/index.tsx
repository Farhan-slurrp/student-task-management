import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useAppStore } from "../../../../../stores/AppContext";
import { useUserStore } from "../../../../../stores/User/UserContext";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Head from "next/head";
import EditIcon from "@material-ui/icons/Edit";

interface SingleRoomNoteProps {}

export default function SingleRoomNote({}: SingleRoomNoteProps): ReactElement {
  const { user } = useAppStore();
  const { userData } = useUserStore();
  const router = useRouter();
  const noteId = router.query["note-id"];
  const roomId = router.query["room-id"];
  const { refreshData } = useAppStore();

  React.useEffect(() => {
    refreshData();
  }, []);

  const getUserNotes = () => {
    if (!userData) return [];
    return userData.user.rooms
      .find((room) => room.id === roomId)
      .notes.find((note) => note.id == noteId);
  };

  const noteData = getUserNotes();

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

      <div className="mx-4 my-8 md:mx-12">
        <button
          className="px-4 py-2 font-semibold text-white bg-gray-700 rounded-sm"
          onClick={() => router.back()}
        >
          Go Back
        </button>
        <div className="flex items-center justify-between mt-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-semibold">{noteData.title}</h1>
            {noteData.updatedAt && (
              <p className="text-gray-500">
                Updated at:{" "}
                {format(
                  new Date(noteData.updatedAt || Date.now()),
                  "dd/MM/yyyy"
                )}
              </p>
            )}
            {!noteData.updatedAt && (
              <p className="text-gray-500">
                Created at:{" "}
                {format(
                  new Date(noteData.createdAt || Date.now()),
                  "dd/MM/yyyy"
                )}
              </p>
            )}
          </div>
          <button
            onClick={() =>
              router.replace(`/rooms/${roomId}/note/${noteId}/edit`)
            }
            className="hidden p-2 font-semibold text-white bg-green-500 rounded-md md:block focus:bg-green-600"
          >
            Edit Note
          </button>
        </div>
        <div className="p-3 mt-16 border border-gray-200 rounded-md">
          <ReactMarkdown remarkPlugins={[gfm]}>
            {noteData.content}
          </ReactMarkdown>
        </div>
        <div className="block h-12 md:hidden"></div>
        <div className="fixed flex justify-end md:hidden bottom-5 right-5">
          <button
            onClick={() =>
              router.replace(`/rooms/${roomId}/note/${noteId}/edit`)
            }
            className="p-4 text-white bg-green-500 rounded-full"
          >
            <EditIcon />
          </button>
        </div>
      </div>
    </>
  );
}
