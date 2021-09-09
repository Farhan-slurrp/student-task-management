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
  }

  type TaskSection {
    id: ID
    title: String
    userEmail: String!
    tasks: [PersonalTask]
  }

  type User {
    email: String
    fullname: String
    profPict: String
    events: [Event]
    taskSections: [TaskSection]
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
    ): Boolean
    editPersonalTask(
      id: ID!
      content: String!
      status: String
      progress: Float
      sectionId: ID!
      createdAt: Date
      dueDate: Date
      priority: String
    ): Boolean
    deletePersonalTask(id: ID!): Boolean
  }
`;
