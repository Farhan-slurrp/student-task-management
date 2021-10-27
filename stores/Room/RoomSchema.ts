import { gql } from "@apollo/client";

export const CREATE_ROOM = gql`
  mutation createRoom($roomName: String!, $userEmail: String!) {
    createRoom(roomName: $roomName, userEmail: $userEmail)
  }
`;

export const JOIN_ROOM = gql`
  mutation joinRoom($roomID: ID!, $userEmail: String!) {
    joinRoom(roomID: $roomID, userEmail: $userEmail) {
      message
      success
    }
  }
`;

export const ADD_ADMIN = gql`
  mutation addAdmin($roomID: ID!, $userEmail: String!) {
    addAdmin(roomID: $roomID, userEmail: $userEmail) {
      message
      success
    }
  }
`;

export const DELETE_ADMIN = gql`
  mutation deleteAdmin($roomID: ID!, $userEmail: String!) {
    deleteAdmin(roomID: $roomID, userEmail: $userEmail) {
      message
      success
    }
  }
`;

export const LEAVE_ROOM = gql`
  mutation leaveRoom($roomID: ID!, $userEmail: String!) {
    leaveRoom(roomID: $roomID, userEmail: $userEmail)
  }
`;
