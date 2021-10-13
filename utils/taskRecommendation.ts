export default function getTaskRecomendation(tasks) {
  if (tasks.length === 0) return;
  const tasksWithDueDate = tasks.filter((task) => task.dueDate !== null);
  if (tasksWithDueDate.length !== 0) {
    let orderedDates = sortDates(tasksWithDueDate.map((task) => task.dueDate));
    let nextDate = getNextDate(orderedDates);

    if (nextDate) {
      tasks = tasksWithDueDate.filter((task) => {
        if (new Date(task.dueDate).getDate() == new Date(nextDate).getDate()) {
          return task;
        }
      });
    } else {
      tasks = tasks.filter((task) => task.dueDate === null);
    }
  }
  if (tasks.length > 1) {
    let filteredTask = tasks.filter((task) => task.priority == "HIGH");
    if (filteredTask.length === 0) {
      filteredTask = tasks.filter((task) => task.priority == "MEDIUM");
    }
    if (filteredTask.length !== 0) {
      tasks = filteredTask;
    }
  }

  return tasks[Math.floor(Math.random() * tasks.length)];
}

function sortDates(dates) {
  return dates
    .map(function (date) {
      return new Date(date).getTime();
    })
    .sort(function (a, b) {
      return a - b;
    });
}

function getNextDate(dates) {
  return dates.filter(
    (date) =>
      new Date(new Date(date).toLocaleDateString()).getTime() >=
      new Date(new Date(Date.now()).toLocaleDateString()).getTime()
  )[0];
}
