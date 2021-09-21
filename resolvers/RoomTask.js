const RoomTask = {
  createdBy: async ({ id }, args, { RoomTaskModel, UserModel }) => {
    const task = await RoomTaskModel.findById(id);
    if (!task) return {};
    const user = await UserModel.findOne({ email: task.createdBy });
    if (!user) return {};
    return {
      email: user.email,
      fullname: user.fullname,
      profPict: user.profPict,
      events: user.events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      })),
    };
  },
  workingOn: async ({ id }, args, { RoomTaskModel, UserModel }) => {
    const task = await RoomTaskModel.findById(id);
    if (!task) return {};
    const users = await UserModel.find({ email: task.workingOn });
    if (!users) return {};
    return users.map((user) => ({
      email: user.email,
      fullname: user.fullname,
      profPict: user.profPict,
      events: user.events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      })),
    }));
  },
  completedBy: async ({ id }, args, { RoomTaskModel, UserModel }) => {
    const task = await RoomTaskModel.findById(id);
    if (!task) return {};
    const user = await UserModel.findOne({ email: task.completedBy });
    if (!user) return {};
    return {
      email: user.email,
      fullname: user.fullname,
      profPict: user.profPict,
      events: user.events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      })),
    };
  },
};

module.exports = RoomTask;
