import { Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useRouter } from "next/router";
import React from "react";
import { useAppStore } from "../../stores/AppContext";
import { useRoomTaskStore } from "../../stores/RoomTask/RoomTaskContext";
import { useTaskStore } from "../../stores/Task/TaskContext";
import { useUserStore } from "../../stores/User/UserContext";
import ModalComp from "../Modal";

export interface TaskMenuProps {
  currentColumn: string;
  task: {
    id: string;
    content: string;
    status?: string;
    progress?: number;
    sectionId?: string;
    roomId?: string;
    workingOn?: any;
    createdAt?: Date;
    dueDate?: Date;
    priority?: string;
    estimatedTime?: number;
  };
}

const TaskMenu: React.FunctionComponent<TaskMenuProps> = ({
  currentColumn,
  task,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const { userData } = useUserStore();
  const { updatePersonalTask, removePersonalTask } = useTaskStore();
  const {
    updateRoomTask,
    updateTaskByMoving,
    removeRoomTask,
    updateWorkingOnTask,
  } = useRoomTaskStore();
  const { user, refreshData, getTaskType, activeTask, setActiveTask } =
    useAppStore();
  const router = useRouter();

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    const isConfirm = confirm("Are you sure to delete the task?");
    if (isConfirm) {
      switch (getTaskType()) {
        case "personal":
          await removePersonalTask(task.id);
          refreshData()
          break;
        case "room":
          await removeRoomTask(task.roomId, task.id);
          break;
        default:
          return;
      }
    }
    setAnchorEl(null);
  };

  const handleMove = async (columnTitle) => {
    switch (getTaskType()) {
      case "personal":
        await updatePersonalTask(
          task.id,
          task.content,
          columnTitle,
          task.progress,
          task.sectionId,
          new Date(Date.now()),
          task.dueDate,
          task.priority,
          task.estimatedTime
        );
        refreshData()
        setAnchorEl(null);
        break;
      case "room":
        await updateTaskByMoving({
          roomId: task.roomId,
          id: task.id,
          status: columnTitle,
          updatedAt: new Date(Date.now()),
          workingOn: task.workingOn || [],
          completedBy:
            columnTitle == "DONE"
              ? {
                  email: user.email,
                  profPict: user.photoURL,
                  name: user.displayName,
                }
              : null,
        });
        setAnchorEl(null);
        break;
      default:
        return;
    }
  };

  const handleWorkingOn = async (email) => {
    if (task.workingOn.find((member) => member.email === userData.user.email))
      await updateWorkingOnTask({
        roomId: task.roomId,
        id: task.id,
        updatedAt: new Date(Date.now()),
        workingOn: task.workingOn.filter(
          (member) => member.email !== user.email
        ),
      });
    else {
      await updateWorkingOnTask({
        roomId: task.roomId,
        id: task.id,
        updatedAt: new Date(Date.now()),
        workingOn: [
          ...task.workingOn,
          {
            email: user.email,
            profPict: user.photoURL,
            name: user.displayName,
          },
        ],
      });
    }

    setAnchorEl(null);
  };

  const handleActiveTask = () => {
    if (activeTask === null || activeTask.id !== task.id) setActiveTask(task);
    else setActiveTask(null);
    refreshData()
    setAnchorEl(null);
  };

  // React.useEffect(() => {
  //   window.document.getElementById(id).scrollIntoView();
  // }, [handleMove]);

  return (
    <div className="flex justify-end">
      <ModalComp
        open={open}
        type="editTask"
        handleClose={handleModalClose}
        payload={{
          id: task.id,
          title: task.content,
          status: task.status,
          progress: task.progress,
          sectionId: task.sectionId,
          createdAt: task.createdAt,
          dueDate: task.dueDate,
          priority: task.priority,
          estimated: task.estimatedTime,
          getTaskType,
        }}
      />
      <button onClick={handleClick}>
        <MoreVertIcon className="text-gray-500" />
      </button>
      <Menu
        id="sidebar-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleModalOpen}>
          <p className="text-sm text-green-600">Edit</p>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <p className="text-sm text-red-500">Delete</p>
        </MenuItem>
        {currentColumn === "IN PROGRESS" && getTaskType() == "room" && (
          <MenuItem onClick={() => handleWorkingOn(userData.user.email)}>
            <p
              className={`text-sm text-${
                task.workingOn.find(
                  (member) => member.email === userData.user.email
                )
                  ? "red"
                  : "blue"
              }-600`}
            >
              {task.workingOn.find(
                (member) => member.email === userData.user.email
              )
                ? "Stop Working"
                : "Working on this"}
            </p>
          </MenuItem>
        )}
        {getTaskType() == "personal" && (
          <MenuItem onClick={() => handleActiveTask()}>
            <p className="text-sm text-gray-700">
              {activeTask && activeTask.id == task.id
                ? "Stop Working"
                : "Make Progress"}
            </p>
          </MenuItem>
        )}
        {currentColumn !== "TO DO" && (
          <MenuItem onClick={() => handleMove("TO DO")}>
            <p className="text-sm text-gray-700">Move to "TO DO"</p>
          </MenuItem>
        )}
        {currentColumn !== "IN PROGRESS" && (
          <MenuItem onClick={() => handleMove("IN PROGRESS")}>
            <p className="text-sm text-gray-700">Move to "IN PROGRESS"</p>
          </MenuItem>
        )}
        {currentColumn !== "DONE" && (
          <MenuItem className="DONE" onClick={() => handleMove("DONE")}>
            <p className="text-sm text-gray-700">Move to "DONE"</p>
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <p className="text-sm text-gray-500">Cancel</p>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TaskMenu;
