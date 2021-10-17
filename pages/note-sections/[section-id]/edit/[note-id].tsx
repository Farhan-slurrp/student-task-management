import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import "easymde/dist/easymde.min.css";
import { useNoteStore } from "../../../../stores/Note/NoteContext";
import { useUserStore } from "../../../../stores/User/UserContext";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface EditNoteProps {}

export default function EditNote({}: EditNoteProps): ReactElement {
  const router = useRouter();
  const { userData } = useUserStore();
  const noteId = router.query["note-id"];
  const sectionId = router.query["section-id"];
  const { updatePersonalNote } = useNoteStore();

  const getUserNotes = () => {
    if (!userData) return [];
    return userData.user.noteSections
      .find((section) => section.id === sectionId)
      .notes.find((note) => note.id == noteId);
  };

  const noteData = getUserNotes();
  const [content, setContent] = React.useState(noteData.content);

  //   id,
  //   title,
  //   content,
  //   updatedAt,
  //   sectionId,
  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target["title"].value;
    const updatedDate = new Date(Date.now());
    await updatePersonalNote(noteId, title, content, updatedDate, sectionId);
    router.replace(`/note-sections/${sectionId}/note/${noteId}`);
  };

  return (
    <>
      <Head>
        <title>Student Task Management | Note Section (Edit New Note)</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Note Section (Edit New Note)"
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
        <form className="flex flex-col gap-2 mt-12" onSubmit={handleSubmit}>
          <label htmlFor="title" className="text-base">
            Title:
          </label>
          <input
            className="p-2 border border-gray-400 rounded-md outline-none"
            type="text"
            placeholder="Title here..."
            name="title"
            required
            autoComplete="off"
            defaultValue={noteData.title}
          />
          <label htmlFor="title" className="mt-8 text-base">
            Content:
          </label>
          <SimpleMDE
            className=""
            value={content}
            onChange={(value) => setContent(value)}
          />
          <div className="flex justify-center">
            <button className="w-full py-2 mt-8 text-base font-semibold text-white bg-green-500 rounded-md md:w-1/3">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
