import { gql } from "@apollo/client";

export const ADD_NOTE_SECTION = gql`
  mutation createNoteSection($title: String!, $userEmail: String!) {
    addNoteSection(title: $title, userEmail: $userEmail)
  }
`;

export const DELETE_NOTE_SECTION = gql`
  mutation deleteNoteSection($userEmail: String!, $id: ID!) {
    deleteNoteSection(email: $userEmail, id: $id)
  }
`;

export const EDIT_NOTE_SECTION = gql`
  mutation editNoteSection($userEmail: String!, $id: ID!, $title: String!) {
    editNoteSection(email: $userEmail, id: $id, title: $title)
  }
`;

export const ADD_NOTE = gql`
  mutation addPersonalNote(
    $title: String!
    $content: String!
    $createdAt: Date
    $sectionId: ID!
  ) {
    addPersonalNote(
      title: $title
      content: $content
      createdAt: $createdAt
      sectionId: $sectionId
    )
  }
`;

export const DELETE_NOTE = gql`
  mutation deletePersonalNote($id: ID!) {
    deletePersonalNote(id: $id)
  }
`;

export const EDIT_NOTE = gql`
  mutation editPersonalNote(
    $id: ID!
    $title: String!
    $content: String!
    $updatedAt: Date
    $sectionId: ID!
  ) {
    editPersonalNote(
      id: $id
      title: $title
      content: $content
      updatedAt: $updatedAt
      sectionId: $sectionId
    )
  }
`;
