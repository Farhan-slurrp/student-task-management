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

  type User {
    email: String
    fullname: String
    profPict: String
    events: [Event]
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
  }
`;
