import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRoomNoteStore } from "../../../../stores/RoomNote/RoomNoteContext";
import React, { ReactElement } from "react";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface CreateNoteProps {}

function CreateNote({}: CreateNoteProps): ReactElement {
  const router = useRouter();
  const [content, setContent] = React.useState("");
  const { saveRoomNote } = useRoomNoteStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target["title"].value;
    const roomId = router.query["room-id"];
    const createdDate = new Date(Date.now());
    await saveRoomNote(title, content, createdDate, roomId);
    router.replace(`/rooms/${roomId}/notes`);
  };

  return (
    <>
      <Head>
        <title>Student Task Management | Note Section (Create New Note)</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Note Section (Create New Note)"
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
            <button className="w-full py-2 mt-8 text-base font-semibold text-white bg-green-500 rounded-sm md:w-1/3">
              Save Note
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateNote;
