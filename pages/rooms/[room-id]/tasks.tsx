import React, { ReactElement } from "react";
import AddIcon from "@material-ui/icons/Add";
import { useRouter, NextRouter } from "next/router";
import { useUserStore } from "../../../stores/User/UserContext";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ProgressBar from "../../../components/ProgressBar";
import ModalComp from "../../../components/Modal";
import Tooltip from "@material-ui/core/Tooltip";
import TaskMenu from "../../../components/task/TaskMenu";
import Head from "next/head";
import { NotificationManager } from "react-notifications";
import format from "date-fns/format";
import addNotification from "react-push-notification";
import "react-push-notification/dist/notifications/Notification.css";
import { useAppStore } from "../../../stores/AppContext";
import { GetStaticPaths } from "next";
import firebase from "../../../firebase/clientApp";
import { useCollection } from "react-firebase-hooks/firestore";

interface RoomProps {
  params: any;
}

export async function getStaticProps({ params }) {
  return {
    props: {
      params,
    }, // will be passed to the page component as props
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default function RoomPage({ params }: RoomProps): ReactElement {
  const router: NextRouter = useRouter();
  const [openModal, setModalOpen] = React.useState<boolean>(false);
  const roomID = params["room-id"];
  const { userData } = useUserStore();
  const [roomTasks, roomTasksLoading, roomTasksError] = useCollection(
    firebase.firestore().collection("rooms").doc(roomID).collection("tasks"),
    {}
  );
  const [allTasks, setAllTasks] = React.useState([]);

  React.useEffect(() => {
    if (!roomTasksLoading && !roomTasksError) {
      setAllTasks(
        roomTasks.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    }
  }, [roomTasks]);

  const createNotification = (content: string, due: Date) => {
    NotificationManager.info(
      `${content} (Due: ${format(due, "dd/MM/yyyy")})`,
      "Task Notification",
      5000
    );
    addNotification({
      title: "Task Notification",
      subtitle: "Today",
      message: `${content} (Due: ${format(due, "dd/MM/yyyy")})`,
      native: true, // when using native, your OS will handle theming.
    });
  };

  React.useEffect(() => {
    if (allTasks) {
      const tasks = allTasks
        .filter((task) => task.status !== "DONE")
        .filter(
          (task) =>
            format(task.dueDate.toDate(), "dd/MM/yyyy") ===
            format(new Date(Date.now()), "dd/MM/yyyy")
        );

      tasks.forEach((task) => {
        return createNotification(task.content, task.dueDate.toDate());
      });
    }
  }, []);

  const getColumnTasks = (status: string) => {
    if (!allTasks) return [];
    return allTasks.filter((task) => task.status === status);
  };

  const getCriticality = (task, column) => {
    if (!task.dueDate) return null;
    if (column == "DONE") return null;
    const today = new Date(Date.now());
    const due = new Date(task.dueDate.toDate());
    if (format(today, "dd/MM/yyyy") == format(due, "dd/MM/yyyy"))
      return "Today";
    if (due < today) return "Overdue";
    return null;
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const columns = [
    {
      title: "TO DO",
      tasks: getColumnTasks("TO DO"),
    },
    {
      title: "IN PROGRESS",
      tasks: getColumnTasks("IN PROGRESS"),
    },
    {
      title: "DONE",
      tasks: getColumnTasks("DONE"),
    },
  ];

  enum priorityColors {
    LOW = "text-green-600 bg-green-100",
    MEDIUM = "text-yellow-600 bg-yellow-100",
    HIGH = "text-red-600 bg-red-100",
  }

  return (
    <>
      <Head>
        <title>Student Task Management | Room Task</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Room Task"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col h-auto gap-6 px-4 pt-12 pb-6 md:px-12">
        <h1 className="text-4xl font-bold text-gray-800">All Tasks</h1>
        <p className="w-full text-justify md:w-1/2">
          Use this board to track the group tasks.
          <br />
          Click
          <span className="px-1 m-1 font-semibold text-gray-700 bg-gray-100">
            <AddIcon fontSize="small" /> New Task
          </span>
          {"  "}
          to create a new task directly on this board.
          <br />
          Click menu icon in an existing task to update or edit task info.
        </p>
        <button className="flex flex-col gap-6 pt-6 cursor-default">
          <p
            className="hidden p-2 font-semibold text-white align-middle bg-blue-500 rounded-md shadow-sm cursor-pointer md:block"
            onClick={handleModalOpen}
          >
            <AddIcon fontSize="small" /> New Task
          </p>
          <div className="flex border border-gray-700 rounded-md md:hidden">
            <a href="#0" className="p-2 border-r border-gray-700">
              TO DO
            </a>
            <a href="#1" className="p-2 border-r border-gray-700">
              IN PROGRESS
            </a>
            <a href="#2" className="p-2">
              DONE
            </a>
          </div>
        </button>
        <ModalComp
          open={openModal}
          type="addRoomTask"
          handleClose={handleModalClose}
        />
        <div className="flex flex-col items-stretch grid-cols-3 gap-6 md:grid md:gap-2">
          {columns.map((column, idx) => (
            <div className="flex flex-col" key={idx} id={idx.toString()}>
              <div
                className={`border-b border-gray-400 flex items-center justify-between py-2 px-4 font-semibold text-gray-700 bg-gray-100`}
              >
                <h2>{column.title}</h2>
              </div>
              <div className="h-full bg-gray-100 min-h-1/4">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    id={task.id}
                    className="m-3 bg-white rounded-md shadow-md group"
                  >
                    <div
                      className={`px-4 py-2 flex items-center justify-between ${
                        getCriticality(task, column.title)
                          ? " bg-yellow-100"
                          : ""
                      }`}
                    >
                      <div
                        className={`${
                          getCriticality(task, column.title)
                            ? "text-yellow-600 font-semibold"
                            : ""
                        }`}
                      >
                        {getCriticality(task, column.title) && (
                          <div className="flex items-center gap-2">
                            <CalendarTodayIcon fontSize="small" />
                            <p>{getCriticality(task, column.title)}</p>
                          </div>
                        )}
                      </div>
                      <div className="invisible group-hover:visible">
                        <TaskMenu
                          currentColumn={column.title}
                          task={{
                            ...task,
                            dueDate: task.dueDate.toDate(),
                            createdAt: task.createdAt.toDate(),
                          }}
                        />
                      </div>
                    </div>
                    <div className="px-4 py-2">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 ">
                        <h1 className="text-base font-semibold">
                          {task.content}
                        </h1>
                        {task.dueDate ? (
                          <p className="text-xs text-gray-500">
                            Due: {format(task.dueDate.toDate(), "dd/MM/yyyy")}
                          </p>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      {column.title !== "DONE" && (
                        <ProgressBar value={task.progress} />
                      )}
                      <p
                        className={`w-3/5 px-2 py-1 mt-6 mb-3 text-xs font-bold text-center rounded-2xl ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority} PRIORITY
                      </p>
                      {/* If column is TO DO shows who create the task */}
                      {column.title == "TO DO" && (
                        <div className="flex items-center gap-2 pt-2 pb-2">
                          <span className="text-xs font-semibold text-gray-500">
                            Created By:
                          </span>{" "}
                          <Tooltip
                            title={task.createdBy.email}
                            className="cursor-pointer"
                          >
                            <img
                              className="border border-white rounded-full"
                              width="23"
                              height="23"
                              src={`${task.createdBy.profPict}`}
                              alt="profPict"
                            />
                          </Tooltip>
                        </div>
                      )}
                      {/* If column is IN PROGRESS shows who working on the task */}
                      {column.title == "IN PROGRESS" && (
                        <div className="flex items-center gap-2 pt-2 pb-2">
                          <span className="pr-2 text-xs font-semibold text-gray-500">
                            Working on:
                          </span>{" "}
                          {task.workingOn &&
                            task.workingOn.map((member) => (
                              <Tooltip
                                title={member.email}
                                className="-m-2 cursor-pointer"
                              >
                                <img
                                  className="border border-white rounded-full"
                                  width="23"
                                  height="23"
                                  src={`${member.profPict}`}
                                  alt="profPict"
                                />
                              </Tooltip>
                            ))}
                        </div>
                      )}
                      {/* If column is DONE shows who marked the task as complete */}
                      {column.title == "DONE" && (
                        <div className="flex items-center gap-2 pt-2 pb-2">
                          <span className="text-xs font-semibold text-gray-500">
                            Completed By:
                          </span>{" "}
                          <Tooltip
                            title={task.completedBy.email}
                            className="cursor-pointer"
                          >
                            <img
                              className="border border-white rounded-full"
                              width="23"
                              height="23"
                              src={`${task.completedBy.profPict}`}
                              alt="profPict"
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="block h-12 md:hidden"></div>
        <div className="fixed flex justify-end md:hidden bottom-5 right-5">
          <button
            onClick={handleModalOpen}
            className="p-4 text-white bg-blue-500 rounded-full"
          >
            <AddIcon />
          </button>
        </div>
      </div>
    </>
  );
}
