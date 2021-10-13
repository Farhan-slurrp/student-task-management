import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { useUserStore } from "../../stores/User/UserContext";
import { useAppStore } from "../../stores/AppContext";

export interface EventModalProps {
  event: any;
  open: boolean;
  handleClose: () => void;
}

const EventModal: React.FunctionComponent<EventModalProps> = ({
  event,
  open,
  handleClose,
}) => {
  const [eventTitle, setEventTitle] = React.useState<string>(event.title);
  const [isAllDay, setIsAllDay] = React.useState<boolean>(event.allDay);
  const [startDate, setStartDate] = React.useState<Date | null>(event.start);
  const [endDate, setEndDate] = React.useState<Date | null>(event.end);
  const { editEvent, deleteEvent } = useUserStore();
  const { refreshData } = useAppStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editEvent(event.id, eventTitle, startDate, endDate, isAllDay);
    refreshData();
    handleClose();
  };

  const handleDelete = async () => {
    await deleteEvent(event.id);
    refreshData();
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-between">
            <h1>Your Event</h1>
            <HighlightOffIcon
              className="cursor-pointer"
              onClick={handleClose}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* form container */}
            <form
              action="submit"
              className="flex flex-col gap-6 mb-8"
              onSubmit={(e) => handleSubmit(e)}
            >
              {/* form body */}
              <div className="p-8 border border-gray-200 rounded-sm">
                {/* event name */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="title">Section Name:</label>
                  <input
                    name="title"
                    type="text"
                    className="p-2 text-gray-800 border border-gray-400 rounded-sm outline-none focus:border-blue-600"
                    required
                    autoComplete="off"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                </div>

                {/* date picker */}
                <div className="mt-8">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifyContent="space-between">
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="start-date"
                        label="Start Date"
                        className="w-2/5"
                        value={startDate}
                        onChange={(date: Date | null) => {
                          setStartDate(date);
                          if (date > endDate) setEndDate(date);
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="end-date"
                        label="End Date"
                        className="w-2/5"
                        value={endDate}
                        onChange={(date: Date | null) => setEndDate(date)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <input
                    type="checkbox"
                    id="allday"
                    name="allday"
                    className="transform scale-150"
                    checked={isAllDay}
                    onChange={() => {
                      setIsAllDay(!isAllDay);
                    }}
                  />

                  {/* is all day checkbox */}
                  <label htmlFor="allday">
                    Is event happen all day?{" "}
                    <span className="text-gray-500">(*check if yes)</span>
                  </label>
                </div>

                {/* time picker */}
                {!isAllDay && (
                  <div className="mt-8">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container justifyContent="space-between">
                        <KeyboardTimePicker
                          margin="normal"
                          id="starttimepicker"
                          label="Start time"
                          value={startDate}
                          className="w-2/5"
                          onChange={(date: Date | null) => {
                            setStartDate(date);
                            if (date > endDate) setEndDate(date);
                          }}
                          KeyboardButtonProps={{
                            "aria-label": "change time",
                          }}
                        />
                        <KeyboardTimePicker
                          margin="normal"
                          id="endtimepicker"
                          label="End time"
                          className="w-2/5"
                          value={endDate}
                          onChange={(date: Date | null) => setEndDate(date)}
                          KeyboardButtonProps={{
                            "aria-label": "change time",
                          }}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </div>
                )}
              </div>
              {/* buttons */}
              <div className="flex justify-end w-full mt-4 gap-x-4">
                <button
                  type="submit"
                  className="w-1/5 px-2 py-1 text-sm font-semibold text-white bg-green-600 rounded-md align-center"
                >
                  EDIT
                </button>
                <button
                  type="button"
                  className="w-1/5 px-2 py-1 text-sm font-semibold text-white bg-red-600 rounded-md align-center"
                  onClick={handleDelete}
                >
                  DELETE
                </button>
              </div>
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventModal;
