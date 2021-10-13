import React from "react";
import ModalComp from "./Modal";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useTaskStore } from "../stores/Task/TaskContext";
import { useAppStore } from "../stores/AppContext";
import { useRouter } from "next/router";
import { useNoteStore } from "../stores/Note/NoteContext";
import { useRoomStore } from "../stores/Room/RoomContext";

export interface SidebarMenuProps {
  id: string;
  title: string;
  menuTitle: String;
}

const SidebarMenu: React.FunctionComponent<SidebarMenuProps> = ({
  id,
  title,
  menuTitle,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const { removeTaskSection } = useTaskStore();
  const { removeNoteSection } = useNoteStore();
  const { quitRoom } = useRoomStore();
  const { refreshData } = useAppStore();
  const router = useRouter();

  const handleModalOpen = (event) => {
    event.stopPropagation();
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

  const getModalType = () => {
    switch (menuTitle) {
      case "Task Sections":
        return "editTaskSection";
      case "Note Sections":
        return "editNoteSection";
      case "Rooms":
        return "rooms";
      default:
        return "";
    }
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    const isConfirm = confirm("Are you sure to delete this?");
    if (isConfirm) {
      switch (menuTitle) {
        case "Task Sections":
          await removeTaskSection(id);
          break;
        case "Note Sections":
          await removeNoteSection(id);
          break;
        case "Rooms":
          await quitRoom(id);
          break;
        default:
          break;
      }
      router.replace("/");
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <ModalComp
        open={open}
        type={getModalType()}
        handleClose={handleModalClose}
        payload={{ id, title }}
      />
      <button onClick={handleClick}>
        <MoreVertIcon className="text-sm text-gray-300" />
      </button>
      <Menu
        id="sidebar-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuTitle === "Rooms" && (
          <MenuItem onClick={handleDelete}>
            <p className="text-sm text-red-500">Leave</p>
          </MenuItem>
        )}
        {menuTitle !== "Rooms" && (
          <MenuItem onClick={handleModalOpen}>
            <p className="text-sm text-green-600">Edit</p>
          </MenuItem>
        )}
        {menuTitle !== "Rooms" && (
          <MenuItem onClick={handleDelete}>
            <p className="text-sm text-red-500">Delete</p>
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <p className="text-sm text-gray-600">Cancel</p>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SidebarMenu;
