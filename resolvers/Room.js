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
};

module.exports = Room;
