import { gql } from "@apollo/client";

export const ADD_NOTE = gql`
  mutation addRoomNote(
    $title: String!
    $content: String!
    $createdAt: Date
    $createdBy: String
    $roomId: ID!
  ) {
    addRoomNote(
      title: $title
      content: $content
      createdAt: $createdAt
      createdBy: $createdBy
      roomId: $roomId
    )
  }
`;

export const EDIT_NOTE = gql`
  mutation editRoomNote(
    $id: ID!
    $title: String!
    $content: String!
    $isAdmin: Boolean
    $updatedAt: Date
    $updatedBy: String
    $roomId: ID!
  ) {
    editRoomNote(
      id: $id
      title: $title
      content: $content
      isAdmin: $isAdmin
      updatedAt: $updatedAt
      updatedBy: $updatedBy
      roomId: $roomId
    ) {
      success
      message
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteRoomNote($id: ID!, $isAdmin: Boolean, $deletedBy: String) {
    deleteRoomNote(id: $id, isAdmin: $isAdmin, deletedBy: $deletedBy) {
      success
      message
    }
  }
`;
