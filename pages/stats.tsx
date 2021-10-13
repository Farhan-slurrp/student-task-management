import React, { ReactElement } from "react";
import { useUserStore } from "../stores/User/UserContext";
import { Doughnut, Line, Bar, Pie } from "react-chartjs-2";
import Head from "next/head";

export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

interface StatsProps {}

export default function Stats({}: StatsProps): ReactElement {
  const { userData } = useUserStore();

  let tasks = [].concat(
    ...[
      ...userData.user.taskSections.map((section) =>
        section.tasks.map((task) => task)
      ),
    ]
  );

  const currentTasksProgress: number = tasks
    .filter((task) => task.status == "IN PROGRESS")
    .map((task) => task.progress)
    .reduce((a, b) => a + b, 0);

  const totalProgress: number =
    tasks.filter((task) => task.status == "IN PROGRESS").length * 100;

  let tasksGroupedByPriority = [
    tasks.filter((task) => task.priority == "LOW"),
    tasks.filter((task) => task.priority == "MEDIUM"),
    tasks.filter((task) => task.priority == "HIGH"),
  ];

  function formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    date = dd + "/" + mm + "/" + yyyy;
    return date;
  }

  function getLast7DaysDate() {
    var result = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result.push(formatDate(d));
    }

    return result;
  }

  function getLast4WeeksDate() {
    var result = [];
    for (var i = 28; i >= 0; i -= 7) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result.push(formatDate(d));
    }

    return result;
  }

  const dates = getLast7DaysDate();
  const weeksInMonth = getLast4WeeksDate();

  function getWeeklyCompletedTasksData() {
    var result = [];
    for (var i = 0; i < 7; i++) {
      const weeklyTaskDue = tasks
        .filter((task) => task.status == "DONE")
        .map((task) => formatDate(new Date(task.updatedAt)))
        .filter((update) => update == dates[i]).length;
      result.push(weeklyTaskDue);
    }

    return result;
  }

  function getMonthlyCompletedTasksData() {
    var result = [];
    for (var i = 0; i < 4; i++) {
      const monthlyTaskDue = tasks
        .filter((task) => task.status == "DONE")
        .map((task) => formatDate(new Date(task.updatedAt)))
        .filter((due) => {
          if (i !== weeksInMonth.length - 1) {
            return due >= weeksInMonth[i] && due < weeksInMonth[i + 1];
          }
          return due >= weeksInMonth[i];
        }).length;
      result.push(monthlyTaskDue);
    }

    return result;
  }

  const currProgressData = {
    labels: [
      `Completed: ${(currentTasksProgress / totalProgress) * 100}%`,
      `Uncompleted: ${
        ((totalProgress - currentTasksProgress) / totalProgress) * 100
      }%`,
    ],
    datasets: [
      {
        data: [currentTasksProgress, totalProgress - currentTasksProgress],
        backgroundColor: ["#12CF70", "#C0C0C0"],
        hoverBackgroundColor: ["#12CF70", "#C0C0C0"],
      },
    ],
  };

  const tasksDistData = {
    labels: ["TO DO", "IN PROGRESS", "DONE"],
    datasets: [
      {
        data: [
          tasks.filter((task) => task.status == "TO DO").length,
          tasks.filter((task) => task.status == "IN PROGRESS").length,
          tasks.filter((task) => task.status == "DONE").length,
        ],
        backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
      },
    ],
  };

  const tasksDataWithpriority = {
    labels: ["LOW", "MEDIUM", "HIGH"],
    datasets: [
      {
        label: "TO DO",
        data: [
          tasksGroupedByPriority[0].filter((task) => task.status == "TO DO")
            .length,
          tasksGroupedByPriority[1].filter((task) => task.status == "TO DO")
            .length,
          tasksGroupedByPriority[2].filter((task) => task.status == "TO DO")
            .length,
        ],
        backgroundColor: "#FF6384",
        hoverBackgroundColor: "#FF6384",
        stack: "stack 0",
      },
      {
        label: "IN PROGRESS",
        data: [
          tasksGroupedByPriority[0].filter(
            (task) => task.status == "IN PROGRESS"
          ).length,
          tasksGroupedByPriority[1].filter(
            (task) => task.status == "IN PROGRESS"
          ).length,
          tasksGroupedByPriority[2].filter(
            (task) => task.status == "IN PROGRESS"
          ).length,
        ],
        backgroundColor: "#FFCE56",
        hoverBackgroundColor: "#FFCE56",
        stack: "stack 0",
      },
      {
        label: "DONE",
        data: [
          tasksGroupedByPriority[0].filter((task) => task.status == "DONE")
            .length,
          tasksGroupedByPriority[1].filter((task) => task.status == "DONE")
            .length,
          tasksGroupedByPriority[2].filter((task) => task.status == "DONE")
            .length,
        ],
        backgroundColor: "#36A2EB",
        hoverBackgroundColor: "#36A2EB",
        stack: "stack 0",
      },
    ],
  };

  const weeklyCompletedTaskData = {
    labels: [...dates],
    datasets: [
      {
        label: "# of Completed Tasks A Day",
        data: [...getWeeklyCompletedTasksData()],
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  const monthlyCompletedTaskData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "# of Completed Tasks A Week",
        data: [...getMonthlyCompletedTasksData()],
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Student Task Management | Statistics</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Statistics"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div>
        <div className="flex flex-col gap-2 p-4 m-6 text-lg text-gray-700 rounded-lg bg-blue-50">
          <p>
            Completed Tasks:{" "}
            <span className="ml-2 font-semibold">
              {tasks.filter((task) => task.status === "DONE").length}/
              {tasks.length}
            </span>
          </p>
          <p>
            Overall Progress:{" "}
            <span className="ml-2 font-semibold">
              {(
                (tasks.map((task) => task.progress).reduce((a, b) => a + b, 0) /
                  (tasks.length * 100)) *
                100
              ).toFixed(2)}
              %
            </span>
          </p>
          <p>
            Estimated Working Hours:{" "}
            <span className="ml-2 font-semibold">
              {(
                tasks
                  .filter((task) => task.status === "DONE")
                  .map((task) => task.estimatedTime)
                  .reduce((a, b) => a + b, 0) / 60
              ).toFixed(2)}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center w-full p-8 gap-x-20 gap-y-12">
          <div className="flex flex-col items-center w-2/5 gap-8">
            <h2 className="text-2xl font-bold text-gray-700">
              Tasks Distribution (Status)
            </h2>
            <Pie data={tasksDistData} width={450} height={450} />
          </div>
          <div className="flex flex-col items-center w-3/6 gap-8">
            <h2 className="text-2xl font-bold text-gray-700">
              Tasks Distribution (Priority)
            </h2>
            <Bar data={tasksDataWithpriority} width={250} height={180} />
          </div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-3/6 gap-8">
              <h2 className="text-2xl font-bold text-gray-700">
                Completed Task (Weekly)
              </h2>
              <Line data={weeklyCompletedTaskData} width={250} height={180} />
            </div>
            <div className="flex flex-col items-center w-3/6 gap-8">
              <h2 className="text-2xl font-bold text-gray-700">
                Completed Task (Monthly)
              </h2>
              <Line data={monthlyCompletedTaskData} width={250} height={180} />
            </div>
          </div>
          <div className="flex flex-col items-center w-2/5 gap-8">
            <h2 className="text-2xl font-bold text-gray-700">
              Current Progress
            </h2>
            {totalProgress ? (
              <Doughnut data={currProgressData} width={450} height={450} />
            ) : (
              <p className="text-base text-gray-500">No task in progress</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
