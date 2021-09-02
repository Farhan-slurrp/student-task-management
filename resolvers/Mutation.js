const { v4: uuidv4 } = require("uuid");

const Mutation = {
  // add new user
  addUser: async (parent, { email, fullname, profPict }, { UserModel }) => {
    const user = await UserModel.findOne({ email });

    if (user) return false;

    const newUser = new UserModel({
      email,
      name: fullname,
      profPict,
    });

    const success = await newUser.save();
    if (success) return true;
    return false;
  },

  // add new event
  addEvent: async (
    parent,
    { email, title, start, end, allDay },
    { UserModel }
  ) => {
    const newEvent = {
      id: uuidv4(),
      title,
      start,
      end: end || null,
      allDay: allDay,
    };
    const user = await UserModel.findOne({ email });
    if (user) {
      user.events.push(newEvent);
      const isUserSaved = await user.save();
      if (isUserSaved) return true;
    }
    return false;
  },

  // edit existing event
  editEvent: async (
    parent,
    { email, id, title, start, end, allDay },
    { UserModel }
  ) => {
    const newEventData = {
      id,
      title,
      start,
      end: end || null,
      allDay: allDay,
    };
    const user = await UserModel.findOne({ email });
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

  // delete an event
  deleteEvent: async (parent, { email, id }, { UserModel }) => {
    const user = await UserModel.findOne({ email });
    if (user) {
      user.events = user.events.filter((event) => event.id !== id);
      const isUserSaved = await user.save();
      if (isUserSaved) return true;
    }
    return false;
  },

  // add task section for a user
  addTaskSection: async (
    parent,
    { title, userEmail },
    { TaskSectionModel }
  ) => {
    const newTaskSection = new TaskSectionModel({
      title,
      userEmail,
    });

    const success = await newTaskSection.save();
    if (success) return true;
    return false;
  },
};

module.exports = Mutation;
