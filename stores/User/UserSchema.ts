import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser($email: String!) {
    user(email: $email) {
      email
      fullname
      events {
        id
        title
        start
        end
        allDay
      }
      taskSections {
        id
        title
        userEmail
        tasks {
          id
          content
          status
          progress
          sectionId
          createdAt
          dueDate
          priority
          estimatedTime
          updatedAt
        }
      }
      noteSections {
        id
        title
        userEmail
        notes {
          id
          title
          content
          createdAt
          sectionId
          updatedAt
        }
      }
      rooms {
        id
        roomName
        members {
          userData {
            email
            profPict
            fullname
          }
          isAdmin
        }
        tasks {
          id
          content
          roomId
          status
          updatedAt
          priority
          progress
          createdAt
          dueDate
          createdBy {
            email
            profPict
          }
          workingOn {
            email
            profPict
          }
          completedBy {
            email
            profPict
          }
        }
        notes {
          id
          title
          content
          createdAt
          roomId
          createdAt
          createdBy {
            email
            profPict
          }
          updatedAt
          updatedBy {
            email
            profPict
          }
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($email: String!, $fullname: String!, $profPict: String!) {
    addUser(email: $email, fullname: $fullname, profPict: $profPict)
  }
`;

export const ADD_USER_EVENT = gql`
  mutation addUserEvent(
    $email: String!
    $title: String!
    $start: Date!
    $end: Date
    $allDay: Boolean!
  ) {
    addEvent(
      email: $email
      title: $title
      start: $start
      end: $end
      allDay: $allDay
    )
  }
`;

export const EDIT_USER_EVENT = gql`
  mutation editUserEvent(
    $email: String!
    $id: ID!
    $title: String!
    $start: Date!
    $end: Date
    $allDay: Boolean!
  ) {
    editEvent(
      email: $email
      id: $id
      title: $title
      start: $start
      end: $end
      allDay: $allDay
    )
  }
`;

export const DELETE_USER_EVENT = gql`
  mutation deleteUserEvent($email: String!, $id: ID!) {
    deleteEvent(email: $email, id: $id)
  }
`;
