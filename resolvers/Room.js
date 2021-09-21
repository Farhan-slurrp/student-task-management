const Room = {
  members: async ({ id }, args, { RoomModel, UserModel }) => {
    const room = await RoomModel.findById(id);
    const users = room.members.map(async (user) => {
      const singleUser = await UserModel.findOne({ email: user.email });
      if (!singleUser) return { userData: { email: user.email } };
      return {
        userData: {
          email: singleUser.email,
          fullname: singleUser.name,
          profPict: singleUser.profPict,
          events: singleUser.events.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
          })),
        },
        isAdmin: user.isAdmin,
      };
    });
    return users;
  },
  tasks: async ({ id }, args, { RoomTaskModel }) => {
    const tasks = await RoomTaskModel.find({ roomId: id });
    if (!tasks) return [];
    return tasks.map((task) => ({
      id: task._id,
      content: task.content,
      status: task.status,
      progress: task.progress,
      roomId: task.roomId,
      createdAt: task.createdAt,
      dueDate: task.dueDate,
      priority: task.priority,
      updatedAt: task.updatedAt,
    }));
  },
};

module.exports = Room;
