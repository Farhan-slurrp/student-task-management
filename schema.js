const { gql } = require("apollo-server");

exports.typeDefs = gql`
  scalar Date

  type Event {
    id: ID
    title: String
    start: Date
    end: Date
    allDay: Boolean
  }

  type PersonalTask {
    id: ID
    content: String!
    status: String
    progress: Float
    sectionId: ID!
    createdAt: Date
    dueDate: Date
    priority: String
    estimatedTime: Float
    updatedAt: Date
  }

  type TaskSection {
    id: ID
    title: String
    userEmail: String!
    tasks: [PersonalTask]
  }

  type PersonalNote {
    id: ID
    title: String!
    content: String!
    createdAt: Date
    sectionId: ID!
    updatedAt: Date
  }

  type NoteSection {
    id: ID
    title: String
    userEmail: String!
    notes: [PersonalNote]
  }

  type User {
    email: String
    fullname: String
    profPict: String
    events: [Event]
    taskSections: [TaskSection]
    noteSections: [NoteSection]
    rooms: [Room]
  }

  type RoomMember {
    userData: User
    isAdmin: Boolean
  }

  type Room {
    id: ID
    roomName: String
    members: [RoomMember]
    tasks: [RoomTask]
    notes: [RoomNote]
  }

  type SuccessMessage {
    success: Boolean
    message: String
  }

  type RoomTask {
    id: ID
    content: String!
    status: String
    progress: Float
    roomId: ID!
    createdAt: Date
    createdBy: User
    workingOn: [User]
    completedBy: User
    dueDate: Date
    priority: String
    updatedAt: Date
  }

  type RoomNote {
    id: ID
    title: String!
    content: String!
    createdAt: Date
    createdBy: User
    roomId: ID!
    updatedAt: Date
    updatedBy: User
  }

  type Query {
    users: [User]
    user(email: String): User
  }

  type Mutation {
    addUser(email: String!, fullname: String!, profPict: String!): Boolean
    addEvent(
      email: String!
      title: String!
      start: Date!
      end: Date
      allDay: Boolean!
    ): Boolean
    editEvent(
      email: String!
      id: ID!
      title: String!
      start: Date!
      end: Date
      allDay: Boolean!
    ): Boolean
    deleteEvent(email: String!, id: ID!): Boolean
    addTaskSection(title: String!, userEmail: String!): Boolean
    deleteTaskSection(email: String!, id: ID!): Boolean
    editTaskSection(email: String!, id: ID!, title: String!): Boolean
    addPersonalTask(
      content: String!
      status: String
      progress: Float
      sectionId: ID!
      createdAt: Date
      dueDate: Date
      priority: String
      estimatedTime: Float
    ): Boolean
    editPersonalTask(
      id: ID!
      content: String!
      status: String
      progress: Float
      sectionId: ID!
      updatedAt: Date
      dueDate: Date
      priority: String
      estimatedTime: Float
    ): Boolean
    deletePersonalTask(id: ID!): Boolean
    addNoteSection(title: String!, userEmail: String!): Boolean
    deleteNoteSection(email: String!, id: ID!): Boolean
    editNoteSection(email: String!, id: ID!, title: String!): Boolean
    addPersonalNote(
      title: String!
      content: String!
      createdAt: Date
      sectionId: ID!
    ): Boolean
    deletePersonalNote(id: ID!): Boolean
    editPersonalNote(
      id: ID!
      title: String!
      content: String!
      updatedAt: Date
      sectionId: ID!
    ): Boolean
    createRoom(roomName: String!, userEmail: String!): Boolean
    joinRoom(roomID: ID!, userEmail: String!): SuccessMessage
    addAdmin(roomID: ID!, userEmail: String!): SuccessMessage
    deleteAdmin(roomID: ID!, userEmail: String!): SuccessMessage
    leaveRoom(roomID: ID!, userEmail: String!): Boolean
    addRoomTask(
      content: String!
      status: String
      progress: Float
      roomId: ID!
      createdAt: Date
      createdBy: String
      dueDate: Date
      priority: String
    ): Boolean
    editRoomTask(
      id: ID!
      content: String!
      status: String
      progress: Float
      roomId: ID!
      createdAt: Date
      updatedAt: Date
      workingOn: String
      completedBy: String
      dueDate: Date
      priority: String
    ): Boolean
    stopWorkingOnTask(id: ID!, updatedAt: Date, workingOn: String): Boolean
    deleteRoomTask(id: ID!): Boolean
    addRoomNote(
      title: String!
      content: String!
      createdAt: Date
      createdBy: String
      roomId: ID!
    ): Boolean
    editRoomNote(
      id: ID!
      title: String!
      content: String!
      isAdmin: Boolean
      updatedAt: Date
      updatedBy: String
      roomId: ID!
    ): SuccessMessage
    deleteRoomNote(id: ID!, isAdmin: Boolean, deletedBy: String): SuccessMessage
  }
`;
