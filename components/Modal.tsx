import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTaskStore } from "../stores/Task/TaskContext";
import { useAppStore } from "../stores/AppContext";
import AddTaskForm from "./task/AddTaskForm";
import EditTaskForm from "./task/EditTaskForm";
import { useNoteStore } from "../stores/Note/NoteContext";
import { useRoomStore } from "../stores/Room/RoomContext";
import InviteDialogBody from "./InviteDialogBody";
import UploadFileForm from "./file/UploadFileForm";

export interface ModalCompProps {
  open: boolean;
  type: String;
  handleClose: () => void;
  payload?: {
    id?: String;
    title?: string;
    status?: string;
    progress?: number;
    sectionId?: string;
    roomId?: string | string[];
    createdAt?: Date;
    dueDate?: Date;
    priority?: string;
    estimated?: number;
    getTaskType?: () => string;
  };
}

const ModalComp: React.FunctionComponent<ModalCompProps> = ({
  open,
  type,
  handleClose,
  payload,
}) => {
  const [title, setTitle] = React.useState<string>("");
  const { saveTaskSection, editTaskSectionTitle } = useTaskStore();
  const { saveNoteSection, editNoteSectionTitle } = useNoteStore();
  const { createNewRoom } = useRoomStore();
  const { refreshData } = useAppStore();

  React.useEffect(() => {
    if (open && payload && payload.title) {
      setTitle(payload.title);
    }
  }, [open]);

  const handleCreate = async () => {
    switch (type) {
      case "addTaskSection":
        if (title) {
          await saveTaskSection(title);
          setTitle("");
          refreshData();
          handleClose();
        }
        break;
      case "editTaskSection":
        if (title) {
          await editTaskSectionTitle(payload.id, title);
          setTitle("");
          refreshData();
          handleClose();
        }
        break;
      case "addNoteSection":
        if (title) {
          await saveNoteSection(title);
          setTitle("");
          refreshData();
          handleClose();
        }
        break;
      case "editNoteSection":
        if (title) {
          await editNoteSectionTitle(payload.id, title);
          setTitle("");
          refreshData();
          handleClose();
        }
        break;
      case "rooms":
        if (title) {
          await createNewRoom(title);
          setTitle("");
          refreshData();
          handleClose();
        }
        break;
      default:
        break;
    }
  };

  const renderTitle = () => {
    switch (type) {
      case "addTaskSection":
        return "New Task Section";
      case "editTaskSection":
        return "Edit Task Section";
      case "addNewTask":
      case "addRoomTask":
        return "Add New Task";
      case "editTask":
        return "Edit Task";
      case "addNoteSection":
        return "New Note Section";
      case "editNoteSection":
        return "Edit Note Section";
      case "rooms":
        return "New Room";
      case "roomMembers":
        return "Invite Link";
      case "uploadFile":
        return "Upload New File";
      default:
        "";
    }
  };

  const renderButtons = () => {
    switch (type) {
      case "addTaskSection":
      case "addNoteSection":
        return (
          <DialogActions>
            <Button onClick={handleClose}>CANCEL</Button>
            <Button onClick={handleCreate} color="primary" autoFocus>
              CREATE
            </Button>
          </DialogActions>
        );
      case "editTaskSection":
      case "editNoteSection":
        return (
          <DialogActions>
            <Button onClick={handleClose}>CANCEL</Button>
            <Button onClick={handleCreate} color="primary" autoFocus>
              EDIT
            </Button>
          </DialogActions>
        );
      case "noteSections":
        return (
          <DialogActions>
            <Button onClick={handleClose}>CANCEL</Button>
            <Button onClick={handleCreate} color="primary" autoFocus>
              CREATE
            </Button>
          </DialogActions>
        );
      case "rooms":
        return (
          <DialogActions>
            <Button onClick={handleClose}>CANCEL</Button>
            <Button onClick={handleCreate} color="primary" autoFocus>
              CREATE
            </Button>
          </DialogActions>
        );
      case "roomMembers":
        return (
          <DialogActions>
            <Button onClick={handleClose}>CLOSE</Button>
          </DialogActions>
        );
      default:
        <div></div>;
    }
  };

  const renderContentBody = () => {
    switch (type) {
      case "addTaskSection":
      case "editTaskSection":
      case "addNoteSection":
      case "editNoteSection":
        return (
          <div className="flex flex-col md:p-4">
            {/* event name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-gray-500 text-md">
                Section Name:
              </label>
              <input
                name="title"
                data-testid={`${type.toString()}-title`}
                type="text"
                className="w-full p-1 text-gray-800 border border-gray-400 rounded-md outline-none md:w-72 focus:border-blue-600"
                required
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
        );
      case "addNewTask":
      case "addRoomTask":
        return <AddTaskForm handleClose={handleClose} />;
      case "editTask":
        return <EditTaskForm data={payload} handleClose={handleClose} />;
      case "rooms":
        return (
          <div className="flex flex-col md:p-4">
            {/* event name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-gray-500 text-md">
                Room Name:
              </label>
              <input
                name="title"
                type="text"
                className="w-full p-1 text-gray-800 border border-gray-400 rounded-md outline-none md:w-72 focus:border-blue-600"
                required
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
        );
      case "roomMembers":
        return <InviteDialogBody link={payload.title} />;
      case "uploadFile":
        return (
          <UploadFileForm roomId={payload.roomId} handleClose={handleClose} />
        );
      default:
        "";
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{renderTitle()}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {renderContentBody()}
          </DialogContentText>
        </DialogContent>
        {renderButtons()}
      </Dialog>
    </div>
  );
};

export default ModalComp;
