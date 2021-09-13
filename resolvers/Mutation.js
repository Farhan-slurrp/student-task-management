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

  // delete task section
  deleteTaskSection: async (parent, { email, id }, { TaskSectionModel }) => {
    const section = await TaskSectionModel.findById(id);
    if (section && section.userEmail === email) {
      const success = await TaskSectionModel.findByIdAndDelete(id);
      if (success) return true;
    }
    return false;
  },

  // edit task section
  editTaskSection: async (
    parent,
    { email, id, title },
    { TaskSectionModel }
  ) => {
    const section = await TaskSectionModel.findById(id);
    if (section && section.userEmail === email) {
      const success = await TaskSectionModel.findByIdAndUpdate(id, {
        $set: {
          title,
        },
      });
      if (success) return true;
    }
    return false;
  },

  // add personal task
  // id: ID
  // content: String!
  // status: String
  // progress: Float
  // sectionId: ID!
  // createdAt: Date
  // dueDate: Date
  // priority: String
  addPersonalTask: async (
    parent,
    { content, status, progress, sectionId, createdAt, dueDate, priority },
    { PersonalTaskModel }
  ) => {
    const newTask = new PersonalTaskModel({
      content,
      status,
      progress,
      sectionId,
      createdAt,
      dueDate,
      priority,
    });

    const success = await newTask.save();
    if (success) return true;
    return false;
  },

  // edit personal task
  // id: ID
  // content: String!
  // status: String
  // progress: Float
  // sectionId: ID!
  // createdAt: Date
  // dueDate: Date
  // priority: String
  editPersonalTask: async (
    parent,
    { id, content, status, progress, sectionId, updatedAt, dueDate, priority },
    { PersonalTaskModel }
  ) => {
    const success = await PersonalTaskModel.findByIdAndUpdate(id, {
      $set: {
        content,
        status,
        progress,
        sectionId,
        updatedAt,
        dueDate,
        priority,
      },
    });
    if (success) return true;
    return false;
  },

  // delete personal task
  deletePersonalTask: async (parent, { id }, { PersonalTaskModel }) => {
    const success = await PersonalTaskModel.findByIdAndDelete(id);
    if (success) return true;
    return false;
  },

  // add note section for a user
  addNoteSection: async (
    parent,
    { title, userEmail },
    { NoteSectionModel }
  ) => {
    const newNoteSection = new NoteSectionModel({
      title,
      userEmail,
    });

    const success = await newNoteSection.save();
    if (success) return true;
    return false;
  },

  // delete note section
  deleteNoteSection: async (parent, { email, id }, { NoteSectionModel }) => {
    const section = await NoteSectionModel.findById(id);
    if (section && section.userEmail === email) {
      const success = await NoteSectionModel.findByIdAndDelete(id);
      if (success) return true;
    }
    return false;
  },

  // edit note section
  editNoteSection: async (
    parent,
    { email, id, title },
    { NoteSectionModel }
  ) => {
    const section = await NoteSectionModel.findById(id);
    if (section && section.userEmail === email) {
      const success = await NoteSectionModel.findByIdAndUpdate(id, {
        $set: {
          title,
        },
      });
      if (success) return true;
    }
    return false;
  },

  // add personal note
  // title: String!
  // content: String!
  // createdAt: Date
  // sectionId: ID!
  addPersonalNote: async (
    parent,
    { title, content, createdAt, sectionId },
    { PersonalNoteModel }
  ) => {
    const newNote = new PersonalNoteModel({
      title,
      content,
      createdAt,
      sectionId,
    });

    const success = await newNote.save();
    if (success) return true;
    return false;
  },

  // delete personal Note
  deletePersonalNote: async (parent, { id }, { PersonalNoteModel }) => {
    const success = await PersonalNoteModel.findByIdAndDelete(id);
    if (success) return true;
    return false;
  },

  // edit personal note
  // id: ID
  // title: String!
  // content: String!
  // updatedAt: Date
  // sectionId: ID!
  editPersonalNote: async (
    parent,
    { id, title, content, updatedAt, sectionId },
    { PersonalNoteModel }
  ) => {
    const success = await PersonalNoteModel.findByIdAndUpdate(id, {
      $set: {
        title,
        content,
        updatedAt,
        sectionId,
      },
    });
    if (success) return true;
    return false;
  },
};

module.exports = Mutation;
