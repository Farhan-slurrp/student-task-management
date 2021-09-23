const RoomNote = {
  createdBy: async ({ id }, args, { RoomNoteModel, UserModel }) => {
    const note = await RoomNoteModel.findById(id);
    if (!note) return {};
    const user = await UserModel.findOne({ email: note.createdBy });
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
  updatedBy: async ({ id }, args, { RoomNoteModel, UserModel }) => {
    const note = await RoomNoteModel.findById(id);
    if (!note) return {};
    const user = await UserModel.findOne({ email: note.updatedBy });
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

module.exports = RoomNote;
