import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useAppStore } from "../../stores/AppContext";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Menu, MenuItem } from "@material-ui/core";
import firebase from "../../firebase/clientApp";

interface FileMenuProps {
  filename: string;
  getAllFiles: () => Promise<void>;
}

export default function FileMenu({
  filename,
  getAllFiles,
}: FileMenuProps): ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const storage = firebase.storage();
  const { refreshData } = useAppStore();
  const router = useRouter();
  const roomId = router.query["room-id"];

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
    const isConfirm = confirm("Are you sure to delete the file?");
    if (isConfirm) {
      await storage.ref(`${roomId}/${filename}`).delete();
      getAllFiles();
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
