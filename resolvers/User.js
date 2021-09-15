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
  noteSections: async ({ email }, args, { NoteSectionModel }) => {
    const noteSections = await NoteSectionModel.find({ userEmail: email });
    return noteSections.map((section) => ({
      id: section._id,
      title: section.title,
      userEmail: section.userEmail,
      notes: section.notes,
    }));
  },
  rooms: async ({ email }, args, { RoomModel }) => {
    let rooms = await RoomModel.find();
    rooms = rooms.filter((room) =>
      room.members.map((member) => member.email === email)
    );

    return rooms;
  },
};

module.exports = User;
