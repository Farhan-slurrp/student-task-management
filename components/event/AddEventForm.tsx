import React from "react";
import "date-fns";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useUserStore } from "../../stores/User/UserContext";
import { useAppStore } from "../../stores/AppContext";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

export interface AddEventFormProps {}

const AddEventForm: React.FunctionComponent<AddEventFormProps> = () => {
  const [eventTitle, setEventTitle] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isAllDay, setIsAllDay] = React.useState<boolean>(true);
  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const { saveEvent } = useUserStore();
  const { refreshData } = useAppStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveEvent(eventTitle, startDate, endDate, isAllDay);
    refreshData();
    resetForm();
  };

  const resetForm = () => {
    setEventTitle("");
    setStartDate(new Date(Date.now()));
    setEndDate(new Date(Date.now()));
    setIsAllDay(true);
  };

  return (
    // form container
    <form
      action="submit"
      className="flex flex-col gap-6 mb-8"
      onSubmit={(e) => handleSubmit(e)}
    >
      {/* form header to expand form body */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md cursor-pointer"
        onClick={() => setIsActive(!isActive)}
      >
        <div className="flex content-center gap-2 text-lg font-semibold text-gray-700">
          <AddCircleOutlineIcon />
          <h1>Add New Event</h1>
        </div>
        <div>{isActive ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>
      </div>
      {isActive && (
        // form body
        <div className="p-8 border border-gray-200 rounded-sm">
          {/* event name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Event Name:</label>
            <input
              name="title"
              type="text"
              className="w-full p-2 border border-gray-400 rounded-sm outline-none focus:border-blue-600"
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

          {/* submit button */}
          <div className="flex justify-center w-full mt-12">
            <button
              type="submit"
              className="w-1/5 px-3 py-2 font-semibold text-white bg-green-600 rounded-md align-center"
            >
              ADD EVENT
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddEventForm;
