const User = {
  taskSections: async ({ email }, args, { TaskSectionModel }) => {
    const taskSections = await TaskSectionModel.find({ userEmail: email });
    return taskSections.map((section) => ({
      id: section._id,
      title: section.title,
      userEmail: section.userEmail,
      tasks: section.tasks,
    }));
  },
};

module.exports = User;
