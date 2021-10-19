import React from "react";
import "date-fns";
import { useAppStore } from "../../stores/AppContext";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useRouter } from "next/router";
import { useTaskStore } from "../../stores/Task/TaskContext";
import { useRoomTaskStore } from "../../stores/RoomTask/RoomTaskContext";

export interface EditTaskFormProps {
  data: {
    id?: String;
    title?: string;
    status?: string;
    progress?: number;
    sectionId?: string;
    createdAt?: Date;
    dueDate?: Date;
    priority?: string;
    estimated?: number;
    getTaskType?: () => string;
  };
  handleClose: () => void;
}

const EditTaskForm: React.FunctionComponent<EditTaskFormProps> = ({
  data,
  handleClose,
}) => {
  const router = useRouter();
  const { refreshData } = useAppStore();
  const { updatePersonalTask } = useTaskStore();
  const { updateRoomTask } = useRoomTaskStore();
  const [startDate, setStartDate] = React.useState<Date>(
    data.createdAt || new Date(Date.now())
  );
  const [dueDate, setDueDate] = React.useState<Date>(
    data.dueDate || new Date(Date.now())
  );

  console.log(data);

  React.useEffect(() => {
    const form = document.getElementById("editform");
    form["content"].value = data.title;
    form["status"].value = data.status;
    form["progress"].value = data.progress;
    form["priority"].value = data.priority;
    if (data.getTaskType() == "personal") {
      form["estimated"].value = data.estimated;
    }
  }, []);

  const handleSubmit = async (e) => {
    const content = e.target["content"].value;
    const status = e.target["status"].value;
    const progress = parseFloat(e.target["progress"].value);
    const updatedAt = new Date(Date.now());
    const priority = e.target["priority"].value;

    e.preventDefault();
    switch (data.getTaskType()) {
      case "personal":
        const sectionId = router.query["section-id"].toString();
        const estimated = parseFloat(e.target["estimated"].value);
        await updatePersonalTask(
          data.id,
          content,
          status,
          progress,
          sectionId,
          updatedAt,
          dueDate,
          priority,
          estimated
        );
        refreshData();
        resetForm(e);
        handleClose();
        break;
      case "room":
        const roomId = router.query["room-id"].toString();
        await updateRoomTask({
          id: data.id,
          content,
          status,
          progress,
          roomId,
          createdAt: startDate,
          updatedAt: new Date(Date.now()),
          dueDate,
          priority,
        });
        resetForm(e);
        handleClose();
        break;
      default:
        handleClose();
        return;
    }
  };

  const resetForm = (e) => {
    e.target.reset();
  };

  return (
    // form container
    <form
      id="editform"
      action="submit"
      className="flex flex-col w-full gap-6 md:w-96"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="flex flex-col gap-4 text-gray-600">
        {/* task name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="text-xs">
            Task Name:
          </label>
          <input
            name="content"
            type="text"
            className="w-auto px-2 py-1 border border-gray-400 rounded-sm outline-none focus:border-blue-600"
            required
            autoComplete="off"
          />
        </div>
        {/* task status */}
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-xs">
            Status:
          </label>
          <select
            name="status"
            className="w-auto px-2 py-1 border border-gray-400 rounded-sm outline-none"
            required
            defaultValue="TO DO"
          >
            <option value="TO DO">TO DO</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        {/* task progress */}
        <div className="flex flex-col gap-1">
          <label htmlFor="progress" className="text-xs">
            Progress(%):
          </label>
          <input
            name="progress"
            type="number"
            className="w-auto px-2 py-1 border border-gray-400 rounded-sm outline-none focus:border-blue-600"
            required
            autoComplete="off"
            placeholder="/100"
            min={0}
            max={100}
          />
        </div>
        {/* task priority */}
        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="text-xs">
            Priority:
          </label>
          <select
            name="priority"
            className="w-auto px-2 py-1 border border-gray-400 rounded-sm outline-none"
            required
            defaultValue="LOW"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
        {/* task estimated time */}
        {data.getTaskType() === "personal" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="estimated" className="text-xs">
              Estimated time (in mins):
            </label>
            <input
              name="estimated"
              type="number"
              className="w-auto px-2 py-1 border border-gray-400 rounded-sm outline-none focus:border-blue-600"
              autoComplete="off"
              defaultValue={0}
              min={0}
            />
          </div>
        )}
        {/* task start date */}
        {data.getTaskType() === "room" && (
          <div className={`flex flex-col gap-1 -mt-3`}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                label="Start Date"
                margin="normal"
                name="startdate"
                className="w-auto mt-0"
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                }}
                value={startDate}
              />
            </MuiPickersUtilsProvider>
          </div>
        )}
        {/* task due date */}
        <div className={`flex flex-col gap-1 -mt-3`}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              label="Due Date"
              margin="normal"
              name="duedate"
              className="w-auto mt-0"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              onChange={(date: Date | null) => {
                setDueDate(date);
              }}
              value={dueDate}
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>

      {/* button container */}
      <div className="flex justify-end gap-4 pt-1">
        <button
          type="submit"
          className="px-4 py-1 font-semibold text-white bg-green-500 rounded-md"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="px-2 py-1 font-semibold text-white bg-gray-500 rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
