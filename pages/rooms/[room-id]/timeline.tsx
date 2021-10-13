import { useRouter, NextRouter } from "next/router";
import React, { ReactElement } from "react";
import Head from "next/head";
import { Chart } from "react-google-charts";
import { useUserStore } from "../../../stores/User/UserContext";
import firebase from "../../../firebase/clientApp";
import format from "date-fns/format";
import { useCollection } from "react-firebase-hooks/firestore";

interface Props {}

export default function TaskTimeline({}: Props): ReactElement {
  const { userData } = useUserStore();
  const router: NextRouter = useRouter();
  const roomID = router.query["room-id"];
  const [roomTasks, roomTasksLoading, roomTasksError] = useCollection(
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomID.toString())
      .collection("tasks"),
    {}
  );
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    if (!roomTasksLoading && !roomTasksError) {
      setTasks(
        roomTasks.docs.map((doc) => {
          return [
            doc.id,
            doc.data().content,
            new Date(format(doc.data().createdAt.toDate(), "MM/dd/yyyy")),
            new Date(format(doc.data().dueDate.toDate(), "MM/dd/yyyy")),
            null,
            doc.data().progress,
            null,
          ];
        })
      );
    }
  }, [roomTasks]);

  console.log(tasks);

  return (
    <>
      <Head>
        <title>Student Task Management | Room Task Timeline</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Room Task Timeline"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="m-6">
        <h1 className="pt-4 pb-8 text-3xl font-bold text-gray-800">
          Tasks Timeline
        </h1>
        {tasks.length > 0 ? (
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="Gantt"
            loader={<div>Loading Chart</div>}
            data={[
              [
                { type: "string", label: "Task ID" },
                { type: "string", label: "Task Name" },
                { type: "date", label: "Start Date" },
                { type: "date", label: "End Date" },
                { type: "number", label: "Duration" },
                { type: "number", label: "Percent Complete" },
                { type: "string", label: "Dependencies" },
              ],
              ...tasks,
            ]}
            rootProps={{ "data-testid": "1" }}
          />
        ) : (
          <p className="font-semibold text-gray-500">The room has no task.</p>
        )}
      </div>
    </>
  );
}
