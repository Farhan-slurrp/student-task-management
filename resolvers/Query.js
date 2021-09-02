const Query = {
  users: async (parent, args, { UserModel }) => {
    const users = await UserModel.find();
    return users.map((user) => ({
      email: user.email,
      fullname: user.name,
      profPict: user.profPict,
      events: user.events,
    }));
  },
  user: async (parent, { email }, { UserModel }) => {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return {
      email: user.email,
      fullname: user.name,
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

module.exports = Query;
