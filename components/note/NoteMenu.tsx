import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useAppStore } from "../../stores/AppContext";
import { useNoteStore } from "../../stores/Note/NoteContext";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Menu, MenuItem } from "@material-ui/core";
import { useRoomNoteStore } from "../../stores/RoomNote/RoomNoteContext";
import Link from "next/link";

interface NoteMenuProps {
  id: string;
  type: string;
  isAdmin?: boolean;
}

export default function NoteMenu({
  id,
  type,
  isAdmin,
}: NoteMenuProps): ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { removePersonalNote } = useNoteStore();
  const { removeRoomNote } = useRoomNoteStore();
  const { refreshData } = useAppStore();
  const router = useRouter();
  const sectionId = router.query["section-id"];
  const roomId = router.query["room-id"];

  const getEditPageLink = () => {
    if (type === "personal") return `/note-sections/${sectionId}/edit/${id}`;
    else if (type === "room") return `/rooms/${roomId}/note/${id}/edit`;
    else return "";
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    const isConfirm = confirm("Are you sure to delete the note?");
    if (isConfirm) {
      if (type === "personal") {
        await removePersonalNote(id);
        refreshData();
      } else if (type === "room") {
        await removeRoomNote(id, isAdmin);
        refreshData();
      }
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <button onClick={handleClick}>
        <MoreVertIcon className="text-sm text-gray-500" />
      </button>
      <Menu
        id="sidebar-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link href={getEditPageLink()}>
          <MenuItem>
            <p className="text-sm text-green-600">Edit</p>
          </MenuItem>
        </Link>
        <MenuItem onClick={handleDelete}>
          <p className="text-sm text-red-500">Delete</p>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <p className="text-sm text-gray-600">Cancel</p>
        </MenuItem>
      </Menu>
    </div>
  );
}
