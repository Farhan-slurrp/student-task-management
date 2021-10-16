import React from "react";
import { useUserStore } from "../stores/User/UserContext";
import FullCalendar from "@fullcalendar/react"; // full calendar library
import dayGridPlugin from "@fullcalendar/daygrid"; // day grid plugin
import timeGridPlugin from "@fullcalendar/timegrid"; // time grid plugin
import AddEventForm from "../components/event/AddEventForm";
import EventModal from "../components/event/EventModal";
import Head from "next/head";
import { NotificationManager } from "react-notifications";
import format from "date-fns/format";
import addNotification from "react-push-notification";
import "react-push-notification/dist/notifications/Notification.css";

const Calendar = () => {
  const { userData } = useUserStore();
  const [currentEvent, setCurrentEvent] = React.useState(null);
  const [open, setOpen] = React.useState(true);

  const createNotification = (title: string, start: Date, allDay: boolean) => {
    NotificationManager.info(
      `${title} (${
        allDay ? format(start, "dd/MM/yyyy") : format(start, "dd/MM/yyyy p")
      })`,
      "Event Notification",
      5000
    );
    addNotification({
      title: "Event Notification",
      subtitle: "Today",
      message: `${title} (${
        allDay ? format(start, "dd/MM/yyyy") : format(start, "dd/MM/yyyy p")
      })`,
      native: true, // when using native, your OS will handle theming.
    });
  };

  React.useEffect(() => {
    const events = userData.user.events.filter(
      (event) =>
        format(new Date(event.start), "dd/MM/yyyy") ===
        format(new Date(Date.now()), "dd/MM/yyyy")
    );

    events.forEach((event) => {
      return createNotification(
        event.title,
        new Date(event.start),
        event.allDay
      );
    });
  }, []);

  const handleOpen = (event) => {
    setCurrentEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentEvent(null);
    setOpen(false);
  };

  if (!userData) {
    return <div className="h-screen"></div>;
  }

  return (
    <>
      <Head>
        <title>Student Task Management | Calendar</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Calendar"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="w-full p-4 md:p-8">
        <AddEventForm />
        {currentEvent && (
          <EventModal
            event={currentEvent}
            open={open}
            handleClose={handleClose}
          />
        )}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          eventClassNames="cursor-pointer"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,timeGridDay",
          }}
          events={userData.user.events}
          eventClick={(info) => {
            handleOpen(info.event);
          }}
          nextDayThreshold="00:00:00"
        />
      </div>
    </>
  );
};

export default Calendar;
