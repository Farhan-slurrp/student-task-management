import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useAppStore } from "../../../../stores/AppContext";
import { useUserStore } from "../../../../stores/User/UserContext";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Head from "next/head";

interface SingleNoteProps {}

export default function SingleNote({}: SingleNoteProps): ReactElement {
  const { user } = useAppStore();
  const { userData } = useUserStore();
  const router = useRouter();
  const noteId = router.query["note-id"];
  const sectionId = router.query["section-id"];
  const { refreshData } = useAppStore();

  React.useEffect(() => {
    refreshData();
  }, []);

  const getUserNotes = () => {
    if (!userData) return [];
    return userData.user.noteSections
      .find((section) => section.id === sectionId)
      .notes.find((note) => note.id == noteId);
  };

  const noteData = getUserNotes();

  console.log(noteData);

  return (
    <>
      <Head>
        <title>Student Task Management | Single Note</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Single Note"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="mx-12 my-8">
        <button
          className="px-4 py-2 font-semibold text-white bg-gray-700 rounded-md"
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
              router.replace(`/note-sections/${sectionId}/edit/${noteId}`)
            }
            className="p-2 font-semibold text-white bg-green-500 border-b-2 border-green-700 rounded-md focus:bg-green-600"
          >
            Edit Note
          </button>
        </div>
        <div className="p-3 mt-16 border border-gray-300 rounded-md">
          <ReactMarkdown remarkPlugins={[gfm]}>
            {noteData.content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
}
