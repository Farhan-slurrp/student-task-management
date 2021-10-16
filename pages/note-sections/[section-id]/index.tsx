import React, { ReactElement } from "react";
import Head from "next/head";
import AddIcon from "@material-ui/icons/Add";
import { useUserStore } from "../../../stores/User/UserContext";
import { useRouter } from "next/router";
import { useAppStore } from "../../../stores/AppContext";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { format } from "date-fns";
import NoteMenu from "../../../components/note/NoteMenu";
import Link from "next/link";

interface NoteSectionProps {}

export default function NoteSection({}: NoteSectionProps): ReactElement {
  const { user } = useAppStore();
  const { userData } = useUserStore();
  const router = useRouter();
  const sectionId = router.query["section-id"];
  const { refreshData } = useAppStore();

  React.useEffect(() => {
    refreshData();
  }, []);

  const getUserNotes = () => {
    if (!userData) return [];
    return userData.user.noteSections.find(
      (section) => section.id === sectionId
    ).notes;
  };

  const notesData = getUserNotes();

  return (
    <>
      <Head>
        <title>Student Task Management | Note Section</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Note Section"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col h-auto gap-6 px-10 pt-12 pb-6 md:px-12">
        <h1 className="text-4xl font-bold text-gray-800">All Notes</h1>
        <p className="w-full text-justify md:w-1/2">
          Create or Read your personal Notes here.
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
        <button className="flex justify-start pt-6 cursor-default">
          <p
            onClick={() => router.push(`/note-sections/${sectionId}/create`)}
            className="p-2 font-semibold text-white align-middle bg-blue-500 rounded-md shadow-sm cursor-pointer"
          >
            <AddIcon fontSize="small" /> New Note
          </p>
        </button>
        {notesData.length > 0 ? (
          <div className="border-t border-l border-r border-gray-300">
            {notesData.map((note) => (
              <Link
                href={`/note-sections/${sectionId}/note/${note.id}`}
                key={note.id}
              >
                <div className="flex items-center p-3 border-b border-gray-300 cursor-pointer group hover:bg-gray-100">
                  <div className="justify-between w-full">
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-xs text-gray-500">
                      Created at:{" "}
                      {format(new Date(note.createdAt), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="invisible group-hover:visible">
                    <NoteMenu id={note.id} type="personal" />
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
            <h2 className="pt-4 text-3xl font-semibold text-gray-700">
              Hi, {user.displayName.split(" ")[0]}!
            </h2>
            <p className="text-base font-medium text-gray-700">
              You currently have no note. Start to make one
            </p>
          </div>
        )}
      </div>
    </>
  );
}
