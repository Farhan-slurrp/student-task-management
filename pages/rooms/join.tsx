import React, { ReactElement } from "react";
import { useRoomStore } from "../../stores/Room/RoomContext";
import Alert from "@material-ui/lab/Alert";
import router from "next/router";
import Head from "next/head";

interface JoinRoomProps {}

export default function JoinRoom({}: JoinRoomProps): ReactElement {
  const { joinRoom } = useRoomStore();
  const [returnedData, setReturnedData] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomID: string = e.target["roomID"].value.split("/")[2];
    const payload = await joinRoom(roomID);
    setReturnedData(payload.data.joinRoom);
    if (returnedData && returnedData.success === true) {
      setTimeout(() => {
        return router.replace(`/rooms/${roomID}/tasks`);
      }, 3000);
    }
  };

  React.useEffect(() => {
    if (returnedData && returnedData.success === false) {
      setTimeout(() => {
        setReturnedData(null);
      }, 3000);
    }
  }, [returnedData]);

  return (
    <>
      <Head>
        <title>Student Task Management | Join Room</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Join Room"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col items-center justify-center gap-6 h-5/6 md:px-60">
        <p className="text-base">
          Enter invite link in the form below and click{" "}
          <span className="font-semibold">(Join)</span>
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-end w-full p-4 mt-2 border-2 border-blue-100 rounded-lg bg-blue-50"
        >
          <div className="flex flex-col w-full gap-4">
            <label htmlFor="roomID" className="text-base font-semibold">
              Room Invite Link:
            </label>
            <input
              className="w-full px-2 py-3 bg-transparent border border-gray-400 rounded-md outline-none"
              type="text"
              id="roomID"
              name="roomID"
              autoFocus={true}
              autoComplete="off"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 mt-8 font-semibold text-white bg-blue-500 rounded-md"
          >
            Join
          </button>
        </form>
        {returnedData ? (
          <Alert
            className="w-full"
            severity={`${returnedData.success ? "success" : "error"}`}
          >
            {returnedData.message}
          </Alert>
        ) : (
          <div className="h-12"></div>
        )}
      </div>
    </>
  );
}
