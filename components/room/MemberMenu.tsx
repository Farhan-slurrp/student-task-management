import { Menu, MenuItem } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { useAppStore } from "../../stores/AppContext";
import { useRoomStore } from "../../stores/Room/RoomContext";
import MoreVertIcon from "@material-ui/icons/MoreVert";

interface Props {
  isAdmin: boolean;
  email: string | string[];
}

export const MemberMenu = ({ isAdmin, email }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { kickMember, promoteAsAdmin, demoteAsAdmin } = useRoomStore();
  const { refreshData } = useAppStore();
  const router = useRouter();

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
    const isConfirm = confirm("Are you sure to kick the use?");
    if (isConfirm) {
      await kickMember(router.query["room-id"], email);
      refreshData();
    }
    setAnchorEl(null);
  };

  const handleAdmin = async (type: string) => {
    if (type === "promote")
      await promoteAsAdmin(router.query["room-id"], email);
    if (type === "demote") await demoteAsAdmin(router.query["room-id"], email);
    refreshData();
    setAnchorEl(null);
  };

  return (
    <div>
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
        {!isAdmin ? (
          <MenuItem onClick={() => handleAdmin("promote")}>
            <p className="text-sm text-blue-500">Promote as Admin</p>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAdmin("demote")}>
            <p className="text-sm text-red-600">Demote as Admin</p>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <p className="text-sm text-red-500">Kick Member</p>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <p className="text-sm text-gray-600">Cancel</p>
        </MenuItem>
      </Menu>
    </div>
  );
};
