import React from "react";
import ErrorLottie from "../components/ErrorLottie";
import { useAppStore } from "../stores/AppContext";

interface Props {}

const AccountError = (props: Props) => {
  const { handleSignOut } = useAppStore();

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-8">
      <div className="w-full md:w-2/5 h-2/5">
        <ErrorLottie />
      </div>
      <p className="text-base text-center md:text-lg font-poppins">
        Something wrong happened. We cannot proceed your Sign in process.{" "}
        <br className="hidden md:block" />
        Try to Logout and login with another account
      </p>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-white bg-red-500 rounded-md"
      >
        Logout and Back to Login
      </button>
    </div>
  );
};

export default AccountError;
