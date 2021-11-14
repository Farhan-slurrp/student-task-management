import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import AddIcon from "@material-ui/icons/Add";
import ModalComp from "./Modal";
import SidebarMenu from "./SidebarMenu";
import Link from "next/link";
import { useRouter } from "next/router";
import Tooltip from "@material-ui/core/Tooltip";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import photoURL from "../src/profileImagePlaceholder";
import { MemberMenu } from "./room/MemberMenu";
import { useAppStore } from "../stores/AppContext";

export interface AccordionProps {
  title: String;
  type: String;
  content: any;
  payload?: any;
}

const Accordion: React.FunctionComponent<AccordionProps> = ({
  title,
  type,
  content,
  payload,
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { user } = useAppStore();
  const router = useRouter();
  const currentUserEmail = user.email;

  const isCurrentPage = () => {
    switch (title) {
      case "Task Sections":
        return router.route === "/task-sections/[section-id]";
      case "Note Sections":
        return router.route.includes("/note-sections/[section-id]");
      case "Rooms":
        return router.route.includes("/rooms/[room-id]");
      default:
        return false;
    }
  };

  const isCurrentRoute = (id) => {
    switch (title) {
      case "Task Sections":
      case "Note Sections":
        return router.query["section-id"] === id;
      case "Rooms":
        return router.query["room-id"] === id;
      default:
        return false;
    }
  };

  const isCurrentUserAdmin = () => {
    return content.find((member) => member.userData.email === currentUserEmail)
      .isAdmin;
  };

  const getRedirectURL = (id) => {
    switch (title) {
      case "Task Sections":
        return `/task-sections/${id}`;
      case "Note Sections":
        return `/note-sections/${id}`;
      case "Rooms":
        return `/rooms/${id}/tasks`;
      default:
        return "/";
    }
  };

  React.useEffect(() => {
    if (isCurrentPage()) {
      setIsActive(true);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full mx-auto text-white">
      <div
        className={`flex items-center justify-between p-2 bg-gray-700 cursor-pointer ${
          isCurrentPage() ? "border-l-4 border-blue-300" : ""
        }`}
      >
        <p className={`${isCurrentPage() ? "text-blue-300" : "text-white"}`}>
          {title}
        </p>
        <div className="flex items-center">
          {title === "Rooms" && (
            <Tooltip title="Join" className="flex items-center mr-1">
              <GroupAddIcon onClick={() => router.replace("/rooms/join")} />
            </Tooltip>
          )}
          {title !== "Members" ? (
            <div id={type.toString()}>
              <Tooltip title="Add" aria-label="add">
                <AddIcon onClick={handleOpen} />
              </Tooltip>
            </div>
          ) : (
            <Tooltip title="Invite" className="flex items-center mr-1">
              <PersonAddIcon onClick={handleOpen} />
            </Tooltip>
          )}
          <ModalComp
            open={open}
            type={type}
            handleClose={handleClose}
            payload={{ title: payload }}
          />
          <div id="expand" onClick={() => setIsActive(!isActive)}>
            {isActive ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
        </div>
      </div>
      {isActive && type !== "roomMembers" && (
        <div>
          {content && content.length !== 0 ? (
            content.map((item) => (
              <Link key={item.id} href={getRedirectURL(item.id)}>
                <div
                  className={`group flex items-center justify-between p-2 hover:bg-gray-900 cursor-pointer ${
                    isCurrentRoute(item.id) ? "bg-blue-400 bg-opacity-5" : ""
                  }`}
                >
                  <p
                    className={`${
                      isCurrentRoute(item.id) ? "text-blue-300" : "text-white"
                    }`}
                  >
                    # {title === "Rooms" ? item.roomName : item.title}
                  </p>

                  <div className="visible md:invisible group-hover:visible">
                    <SidebarMenu
                      id={item.id}
                      title={item.title}
                      menuTitle={title}
                    />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-2 text-gray-400">no data available</p>
          )}
        </div>
      )}
      {isActive && type === "roomMembers" && (
        <div className="flex flex-col gap-2 p-2">
          {content ? (
            content.map((user) => (
              <div className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      user.userData.profPict ? user.userData.profPict : photoURL
                    }
                    alt="profile"
                    width="23"
                    height="23"
                    className="border border-gray-300 rounded-full"
                  />
                  <Tooltip
                    title={user.userData.email}
                    className="cursor-pointer"
                  >
                    <p>{user.userData.fullname} </p>
                  </Tooltip>
                  {user.isAdmin && (
                    <p className="text-xs italic text-gray-300">(Admin)</p>
                  )}
                </div>
                {isCurrentUserAdmin() &&
                  currentUserEmail !== user.userData.email && (
                    <div className={`visible md:invisible group-hover:visible`}>
                      <MemberMenu
                        isAdmin={user.isAdmin}
                        email={user.userData.email}
                      />
                    </div>
                  )}
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-400">no data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;
