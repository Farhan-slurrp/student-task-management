import React from "react";
import { useUserStore } from "../../stores/User/UserContext";
import AddIcon from "@material-ui/icons/Add";
import { useRouter } from "next/router";
import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";
import ProgressBar from "../../components/ProgressBar";
import LinearProgress from "@material-ui/core/LinearProgress";
import WorkIcon from "@material-ui/icons/Work";
import ModalComp from "../../components/Modal";
import Head from "next/head";
import TaskMenu from "../../components/task/TaskMenu";
import getTaskRecomendation from "../../utils/taskRecommendation";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { useTaskStore } from "../../stores/Task/TaskContext";
import { useAppStore } from "../../stores/AppContext";
import "react-push-notification/dist/notifications/Notification.css";

export interface TaskSectionProps {}

const TaskSection: React.FunctionComponent<TaskSectionProps> = () => {
  const { userData } = useUserStore();
  const router = useRouter();
  const { refreshData, activeTask, setActiveTask, isSidebarOpen } =
    useAppStore();
  const [openModal, setModalOpen] = React.useState(false);
  const sectionId = router.query["section-id"];

  const getColumnTasks = (status: string) => {
    if (!userData) return [];
    return userData.user.taskSections
      .find((section) => section.id === sectionId)
      .tasks.filter((task) => task.status === status);
  };

  const getCriticality = (task, column) => {
    if (!task.dueDate) return null;
    if (column == "DONE") return null;
    const today = new Date(Date.now());
    const due = new Date(task.dueDate);
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
      tasks: getColumnTasks("TO DO").sort((a, b) =>
        a.updatedAt > b.updatedAt ? 1 : b.updatedAt > a.updatedAt ? -1 : 0
      ),
    },
    {
      title: "IN PROGRESS",
      tasks: getColumnTasks("IN PROGRESS").sort((a, b) =>
        a.updatedAt > b.updatedAt ? 1 : b.updatedAt > a.updatedAt ? -1 : 0
      ),
    },
    {
      title: "DONE",
      tasks: getColumnTasks("DONE").sort((a, b) =>
        a.updatedAt > b.updatedAt ? 1 : b.updatedAt > a.updatedAt ? -1 : 0
      ),
    },
  ];

  enum priorityColors {
    LOW = "text-green-600 bg-green-100",
    MEDIUM = "text-yellow-600 bg-yellow-100",
    HIGH = "text-red-600 bg-red-100",
  }

  const recommendTaskFrom = [...columns[0].tasks, ...columns[1].tasks];

  const recommendedTask = getTaskRecomendation(recommendTaskFrom) || null;

  return (
    <>
      <Head>
        <title>Student Task Management | Task Section</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Task Section"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={`flex flex-col h-auto gap-6 px-4 md:px-12 pt-12 pb-6`}>
        <h1 className="text-4xl font-bold text-gray-800">All Tasks</h1>
        <p className="w-full text-justify md:w-1/2">
          Use this board to track your personal tasks.
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
        {recommendedTask && !activeTask && (
          <div>
            <h3 className="font-semibold">
              You have some tasks here. <br />
              We recommend you to do this task👇
            </h3>
            <div
              id={recommendedTask.id}
              className="w-full px-4 py-2 mt-3 border border-blue-300 rounded-md md:w-3/5 bg-blue-50 group"
            >
              <div className="invisible group-hover:visible">
                <TaskMenu
                  currentColumn={
                    columns.find((column) =>
                      column.tasks.includes(recommendedTask)
                    ).title
                  }
                  task={recommendedTask}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h1 className="text-lg font-semibold">
                  {recommendedTask.content}
                </h1>
                {recommendedTask.dueDate && (
                  <p className="text-xs text-gray-500">
                    Due:{" "}
                    {new Date(recommendedTask.dueDate).getDate() <=
                    new Date(Date.now()).getDate() + 7
                      ? new Date(Date.now()).getDate() ==
                        new Date(recommendedTask.dueDate).getDate()
                        ? "Today"
                        : formatDistance(
                            new Date(new Date(recommendedTask.dueDate)),
                            new Date(Date.now()),
                            { addSuffix: true }
                          )
                      : format(new Date(recommendedTask.dueDate), "dd/MM/yyyy")}
                  </p>
                )}
              </div>
              <ProgressBar value={recommendedTask.progress} />
              <p
                className={`px-2 py-1 mt-6 mb-3 mr-3 text-xs font-bold text-center rounded-2xl ${
                  priorityColors[recommendedTask.priority]
                }`}
              >
                {recommendedTask.priority} PRIORITY
              </p>
            </div>
          </div>
        )}
        {activeTask && (
          <div className="w-full border-b-4 border-gray-400 rounded-md md:w-3/5 ">
            <div className="flex items-center gap-2 p-2 font-semibold text-green-800 bg-green-200 border-t border-l border-r border-green-400 rounded-t-md">
              <WorkIcon />
              <p>Actively Working...</p>
            </div>
            <div className="flex flex-col gap-6 p-6 border-l border-r border-gray-400">
              <h3 className="text-lg font-semibold">{activeTask.content}</h3>
              <LinearProgress className="p-1 rounded-md" />
              <button
                className="p-1 mt-4 font-semibold text-white bg-red-500 rounded-md"
                onClick={() => {
                  setActiveTask(null);
                  refreshData();
                }}
              >
                Stop Working
              </button>
            </div>
          </div>
        )}
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
          type="addNewTask"
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
                      <div className="visible md:invisible group-hover:visible">
                        <TaskMenu currentColumn={column.title} task={task} />
                      </div>
                    </div>
                    <div className="px-4 py-2">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 ">
                        <h1 className="text-base font-semibold">
                          {task.content}
                        </h1>
                        {task.dueDate ? (
                          <p className="text-xs text-gray-500">
                            Due: {format(new Date(task.dueDate), "dd/MM/yyyy")}
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
            className="p-4 text-white bg-blue-500 rounded-full shadow-lg"
          >
            <AddIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskSection;
