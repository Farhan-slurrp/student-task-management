const { v4: uuidv4 } = require("uuid");

const Mutation = {
  addUser: async (parent, { email, fullname, profPict }, { User }) => {
    const user = await User.findOne({ email });

    if (user) return false;

    const newUser = new User({
      email,
      name: fullname,
      profPict,
    });

    const success = await newUser.save();
    if (success) return true;
    return false;
  },

  addEvent: async (parent, { email, title, start, end, allDay }, { User }) => {
    const newEvent = {
      id: uuidv4(),
      title,
      start,
      end: end || null,
      allDay: allDay,
    };
    const user = await User.findOne({ email });
    if (user) {
      user.events.push(newEvent);
      const isUserSaved = await user.save();
      if (isUserSaved) return true;
    }
    return false;
  },

  editEvent: async (
    parent,
    { email, id, title, start, end, allDay },
    { User }
  ) => {
    const newEventData = {
      id,
      title,
      start,
      end: end || null,
      allDay: allDay,
    };
    const user = await User.findOne({ email });
    if (user) {
      const eventIndex = user.events.indexOf(
        user.events.filter((event) => event.id === id)[0]
      );
      user.events[eventIndex] = newEventData;
      const isUserSaved = await user.save();
      if (isUserSaved) return true;
    }
    return false;
  },
  deleteEvent: async (parent, { email, id }, { User }) => {
    const user = await User.findOne({ email });
    if (user) {
      user.events = user.events.filter((event) => event.id !== id);
      const isUserSaved = await user.save();
      if (isUserSaved) return true;
    }
    return false;
  },
};

module.exports = Mutation;
