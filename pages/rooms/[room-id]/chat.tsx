import React, { ReactElement } from "react";
import firebase from "../../../firebase/clientApp";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter, NextRouter } from "next/router";
import SendIcon from "@material-ui/icons/Send";
import { useChatRoomStore } from "../../../stores/ChatContext";
import { useAppStore } from "../../../stores/AppContext";
import format from "date-fns/format";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Tooltip from "@material-ui/core/Tooltip";
import Head from "next/head";

interface Props {}

function ChatRoom({}: Props): ReactElement {
  const router: NextRouter = useRouter();
  const roomID = router.query["room-id"];
  const { user } = useAppStore();
  const [inputMessage, setInputMessage] = React.useState<string>("");
  const { sendMessage, deleteMessage } = useChatRoomStore();
  const [roomChats, roomChatsLoading, roomChatsError] = useCollection(
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomID.toString())
      .collection("chats")
      .orderBy("createdAt", "asc"),
    {}
  );
  const [chatData, setChatData] = React.useState([]);
  const messagesEndRef = React.useRef(null);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }

  React.useEffect(() => {
    if (!roomChatsLoading && !roomChatsError) {
      setChatData(
        roomChats.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    }
  }, [roomChats]);

  React.useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  // console.log(chatData.map((chat) => chat));

  const handleSend = async () => {
    // roomId: string,
    // content: string,
    // createdAt: Date
    if (inputMessage !== "") {
      await sendMessage(roomID, inputMessage, new Date(Date.now()));
      setInputMessage("");
    }
  };

  const handleDelete = async (id) => {
    const isConfirm = confirm("Are you sure to delete the message?");
    if (confirm) {
      await deleteMessage(roomID, id);
    }
  };

  return (
    <>
      <Head>
        <title>Student Task Management | Room Chat</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Room Chat"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="h-full bg-gray-200">
        <div className="flex flex-col h-full gap-4 p-4 bg-gray-300">
          {chatData &&
            chatData.map((chat) => {
              return (
                <div
                  key={chat.id}
                  className={`flex items-start gap-2 group ${
                    user.email == chat.createdBy.email ? "flex-row-reverse" : ""
                  }`}
                >
                  <img
                    src={chat.createdBy.profPict}
                    className="w-8 h-8 mt-1 rounded-full"
                    alt=""
                  />
                  <div
                    className={`flex items-center w-full gap-2 ${
                      user.email == chat.createdBy.email
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-1/2 p-2 rounded-md ${
                        user.email == chat.createdBy.email
                          ? "bg-yellow-200"
                          : "bg-white"
                      }`}
                    >
                      <h5 className="mb-3 font-semibold text-blue-600">
                        {user.email == chat.createdBy.email
                          ? "Me"
                          : chat.createdBy.name}
                      </h5>
                      <p>{chat.content}</p>
                      <p className="mt-3 text-gray-600">
                        <small>
                          {format(
                            chat.createdAt.toDate(),
                            "dd MMM yyyy | hh:ss aa"
                          )}
                        </small>
                      </p>
                    </div>
                    {user.email == chat.createdBy.email && (
                      <Tooltip
                        title="Delete Message"
                        className="invisible text-red-500 bg-white rounded-full cursor-pointer group-hover:visible"
                        onClick={() => handleDelete(chat.id)}
                      >
                        <DeleteOutlineIcon />
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} className="h-20"></div>
        </div>
        <div className="fixed bottom-0 w-4/5 h-auto px-4 py-6 bg-white border-t border-gray-400 shadow-lg">
          <div className="flex justify-between gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Your message goes here..."
              className="w-full p-2 border border-gray-400 rounded-md outline-none"
            />
            <button
              className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-blue-500 rounded-md"
              onClick={() => handleSend()}
            >
              <SendIcon fontSize={"small"} />
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;
