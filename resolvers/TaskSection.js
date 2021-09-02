const TaskSection = {
  tasks: async ({ id }, args, { PersonalTaskModel }) => {
    const tasks = await PersonalTaskModel.find({ sectionId: id });
    return tasks.map((task) => ({
      id: task._id,
      content: task.content,
      status: task.status,
      progress: task.progress,
      sectionId: task.sectionId,
      createdAt: task.createdAt,
      dueDate: task.dueDate,
      priority: task.priority,
    }));
  },
};

module.exports = TaskSection;
