import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation addRoomTask(
    $content: String!
    $status: String
    $progress: Float
    $roomId: ID!
    $createdAt: Date
    $createdBy: String
    $dueDate: Date
    $priority: String
  ) {
    addRoomTask(
      content: $content
      status: $status
      progress: $progress
      roomId: $roomId
      createdAt: $createdAt
      createdBy: $createdBy
      dueDate: $dueDate
      priority: $priority
    )
  }
`;

export const EDIT_TASK = gql`
  mutation editRoomTask(
    $id: ID!
    $content: String!
    $status: String
    $progress: Float
    $roomId: ID!
    $createdAt: Date
    $updatedAt: Date
    $workingOn: String
    $completedBy: String
    $dueDate: Date
    $priority: String
  ) {
    editRoomTask(
      id: $id
      content: $content
      status: $status
      progress: $progress
      roomId: $roomId
      createdAt: $createdAt
      updatedAt: $updatedAt
      workingOn: $workingOn
      completedBy: $completedBy
      dueDate: $dueDate
      priority: $priority
    )
  }
`;

export const DELETE_TASK = gql`
  mutation deleteRoomTask($id: ID!) {
    deleteRoomTask(id: $id)
  }
`;

export const STOP_WORKING_ON_TASK = gql`
  mutation stopWorkingOnTask($id: ID!, $updatedAt: Date, $workingOn: String) {
    stopWorkingOnTask(id: $id, updatedAt: $updatedAt, workingOn: $workingOn)
  }
`;
