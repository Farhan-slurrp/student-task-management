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
  // estimatedTime: Float
  addPersonalTask: async (
    parent,
    {
      content,
      status,
      progress,
      sectionId,
      createdAt,
      dueDate,
      priority,
      estimatedTime,
    },
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
      estimatedTime,
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
  // estimatedTime: Float
  editPersonalTask: async (
    parent,
    {
      id,
      content,
      status,
      progress,
      sectionId,
      updatedAt,
      dueDate,
      priority,
      estimatedTime,
    },
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
        estimatedTime,
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

  // create new room
  createRoom: async (parent, { roomName, userEmail }, { RoomModel }) => {
    const newRoom = new RoomModel({
      roomName,
      members: [{ email: userEmail, isAdmin: true }],
    });

    const success = await newRoom.save();
    if (success) return true;
    return false;
  },

  // join to room
  joinRoom: async (parent, { roomID, userEmail }, { RoomModel }) => {
    const newMember = { email: userEmail, isAdmin: false };
    try {
      const room = await RoomModel.findById(roomID);

      const isExist = room.members.find((member) => member.email === userEmail);
      if (isExist)
        return { success: false, message: "You already joined the room" };

      const success = await RoomModel.findByIdAndUpdate(roomID, {
        $set: {
          members: [...room.members, newMember],
        },
      });
      if (success)
        return { success: true, message: "Success to join the room" };
    } catch (err) {
      if (err.kind == "ObjectId") {
        return { success: false, message: "Invalid room ID" };
      }
      return { success: false, message: "An error occured" };
    }
  },

  // leave to room
  leaveRoom: async (parent, { roomID, userEmail }, { RoomModel }) => {
    const room = await RoomModel.findById(roomID);
    const members = room.members.filter((member) => member.email != userEmail);
    room.members = members;

    const success = await room.save();
    if (success) return true;
    return false;
  },

  // add room task
  // id: ID
  // content: String!
  // status: String
  // progress: Float
  // roomId: ID!
  // createdAt: Date
  // createdBy: String
  // dueDate: Date
  // priority: String
  addRoomTask: async (
    parent,
    {
      content,
      status,
      progress,
      roomId,
      createdAt,
      createdBy,
      dueDate,
      priority,
    },
    { RoomTaskModel }
  ) => {
    const newTask = new RoomTaskModel({
      content,
      status,
      progress,
      roomId,
      createdAt,
      createdBy,
      dueDate,
      priority,
    });

    const success = await newTask.save();
    if (success) return true;
    return false;
  },

  // delete room task
  deleteRoomTask: async (parent, { id }, { RoomTaskModel }) => {
    const success = await RoomTaskModel.findByIdAndDelete(id);
    if (success) return true;
    return false;
  },

  // edit room task
  // id: ID
  // content,
  // status,
  // progress,
  // roomId,
  // createdAt,
  // createdBy,
  // workingOn,
  // completedBy,
  // dueDate,
  // priority,
  editRoomTask: async (
    parent,
    {
      id,
      content,
      status,
      progress,
      roomId,
      updatedAt,
      workingOn,
      completedBy,
      dueDate,
      priority,
    },
    { RoomTaskModel }
  ) => {
    const task = await RoomTaskModel.findById(id);
    let newWorkingOn = [...task.workingOn];
    let newCompletedBy = task.completedBy;

    if (workingOn) newWorkingOn.push(workingOn);
    if (completedBy) {
      newCompletedBy = completedBy;
    }

    const success = await RoomTaskModel.findByIdAndUpdate(id, {
      $set: {
        content,
        status,
        progress,
        roomId,
        updatedAt,
        workingOn: newWorkingOn,
        completedBy: newCompletedBy,
        dueDate,
        priority,
      },
    });
    if (success) return true;
    return false;
  },

  // stop working on task
  // id: ID
  // updatedBy,
  // workingOn,
  stopWorkingOnTask: async (
    parent,
    { id, updatedAt, workingOn },
    { RoomTaskModel }
  ) => {
    const task = await RoomTaskModel.findById(id);
    let newWorkingOn = [...task.workingOn];

    if (workingOn) {
      newWorkingOn = newWorkingOn.filter((member) => member !== workingOn);
    }

    const success = await RoomTaskModel.findByIdAndUpdate(id, {
      $set: {
        updatedAt,
        workingOn: newWorkingOn,
      },
    });
    if (success) return true;
    return false;
  },

  // add room note
  // title: String!
  // content: String!
  // createdAt: Date
  // sectionId: ID!
  addRoomNote: async (
    parent,
    { title, content, createdAt, createdBy, roomId },
    { RoomNoteModel }
  ) => {
    const newNote = new RoomNoteModel({
      title,
      content,
      createdAt,
      createdBy,
      roomId,
    });

    const success = await newNote.save();
    if (success) return true;
    return false;
  },

  // edit room note
  // id: ID!
  // title: String!
  // content: String!
  // isAdmin: Boolean
  // updatedAt: Date
  // updatedBy: String
  // roomId: ID!
  editRoomNote: async (
    parent,
    { id, title, content, isAdmin, updatedAt, updatedBy, roomId },
    { RoomNoteModel }
  ) => {
    const note = await RoomNoteModel.findById(id);

    if (note.createdBy !== updatedBy && !isAdmin)
      return {
        success: false,
        message: "You dont have authorization to edit the note",
      };

    const success = await RoomNoteModel.findByIdAndUpdate(id, {
      $set: {
        title,
        content,
        updatedAt,
        updatedBy,
        roomId,
      },
    });

    if (success) return { success: true, message: "Note edited" };
    return { success: false, message: "An error occured" };
  },

  // delete room Note
  deleteRoomNote: async (
    parent,
    { id, isAdmin, deletedBy },
    { RoomNoteModel }
  ) => {
    const note = await RoomNoteModel.findById(id);

    if (note.createdBy !== deletedBy && !isAdmin)
      return {
        success: false,
        message: "You dont have authorization to delete the note",
      };

    const success = await RoomNoteModel.findByIdAndDelete(id);
    if (success) return { success: true, message: "Note deleted" };
    return { success: false, message: "An error occured" };
  },
};

module.exports = Mutation;
