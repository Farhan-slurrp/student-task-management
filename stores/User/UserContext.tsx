import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_USER_EVENT,
  CREATE_USER,
  EDIT_USER_EVENT,
  GET_USER,
  DELETE_USER_EVENT,
} from "./UserSchema";
import { useAppStore } from "../AppContext";
import Loading from "../../components/Loading";

const UserStore = React.createContext(null);
UserStore.displayName = "UserStore";

export const useUserStore = () => React.useContext(UserStore);

export const UserStoreProvider = ({ children }) => {
  const { user, refreshData } = useAppStore();
  const {
    loading: loadUser,
    error: userError,
    data: userData,
    refetch: refetchUser,
  } = useQuery(GET_USER, {
    variables: {
      email: user ? user.email : "",
    },
    fetchPolicy: "cache-and-network",
  });
  const [createUser] = useMutation(CREATE_USER);
  const [addUserEvent] = useMutation(ADD_USER_EVENT);
  const [editUserEvent] = useMutation(EDIT_USER_EVENT);
  const [deleteUserEvent] = useMutation(DELETE_USER_EVENT);

  // save user data to database
  const saveUser = async (
    email: string,
    fullname: string,
    profPict: string
  ) => {
    return await createUser({
      variables: {
        email,
        fullname,
        profPict,
      },
    });
  };

  // check if user already exist
  const checkUser = async () => {
    if (userData) return true;
    return false;
  };

  // combine checkUser and saveUser
  const createNewUser = async () => {
    const isUser = await checkUser();
    if (!userError) {
      if (!isUser) {
        const newUser = await saveUser(
          user.email,
          user.displayName,
          user.photoURL
        );
        console.log(newUser);
      }
    }
  };

  // save user event
  const saveEvent = async (
    title: string,
    start: Date,
    end: Date,
    allDay: boolean
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await addUserEvent({
        variables: {
          email: user.email,
          title,
          start,
          end,
          allDay,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // edit user event
  const editEvent = async (
    id: string,
    title: string,
    start: Date,
    end: Date,
    allDay: boolean
  ) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await editUserEvent({
        variables: {
          email: user.email,
          id,
          title,
          start,
          end,
          allDay,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  // delete user event
  const deleteEvent = async (id: string) => {
    const isUser = await checkUser();
    if (isUser) {
      const data = await deleteUserEvent({
        variables: {
          email: user.email,
          id,
        },
      });
      refetchUser({ email: user.email });
      return data;
    }
  };

  if (!userData) return <Loading />;

  return (
    <UserStore.Provider
      value={{
        userData,
        refetchUser,
        checkUser,
        createNewUser,
        saveEvent,
        editEvent,
        deleteEvent,
        loadUser,
      }}
    >
      {children}
    </UserStore.Provider>
  );
};
