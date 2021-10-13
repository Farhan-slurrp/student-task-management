import { gql } from "@apollo/client";

export const ADD_TASK_SECTION = gql`
  mutation createTaskSection($title: String!, $userEmail: String!) {
    addTaskSection(title: $title, userEmail: $userEmail)
  }
`;

export const DELETE_TASK_SECTION = gql`
  mutation deleteTaskSection($userEmail: String!, $id: ID!) {
    deleteTaskSection(email: $userEmail, id: $id)
  }
`;

export const EDIT_TASK_SECTION = gql`
  mutation editTaskSection($userEmail: String!, $id: ID!, $title: String!) {
    editTaskSection(email: $userEmail, id: $id, title: $title)
  }
`;

export const ADD_TASK = gql`
  mutation addPersonalTask(
    $content: String!
    $status: String
    $progress: Float
    $sectionId: ID!
    $createdAt: Date
    $dueDate: Date
    $priority: String
    $estimatedTime: Float
  ) {
    addPersonalTask(
      content: $content
      status: $status
      progress: $progress
      sectionId: $sectionId
      createdAt: $createdAt
      dueDate: $dueDate
      priority: $priority
      estimatedTime: $estimatedTime
    )
  }
`;

export const EDIT_TASK = gql`
  mutation editPersonalTask(
    $id: ID!
    $content: String!
    $status: String
    $progress: Float
    $sectionId: ID!
    $updatedAt: Date
    $dueDate: Date
    $priority: String
    $estimatedTime: Float
  ) {
    editPersonalTask(
      id: $id
      content: $content
      status: $status
      progress: $progress
      sectionId: $sectionId
      updatedAt: $updatedAt
      dueDate: $dueDate
      priority: $priority
      estimatedTime: $estimatedTime
    )
  }
`;

export const DELETE_TASK = gql`
  mutation deletePersonalTask($id: ID!) {
    deletePersonalTask(id: $id)
  }
`;
