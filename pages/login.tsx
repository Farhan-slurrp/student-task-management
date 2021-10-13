import React from "react";
import firebase from "../firebase/clientApp";
import Head from "next/head";
import Loading from "../components/Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export interface LoginProps {}

const StyledFirebaseAuth = dynamic(
  () => import("react-firebaseui/StyledFirebaseAuth"),
  {
    ssr: false,
  }
);

const LoginLottie = dynamic(() => import("../components/LoginLottie"), {
  ssr: false,
});

const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  signInFlow: "popup", // comment for testing (because cypress cannot read popup)
  signInOptions: [
    // sign in options with google or facebook
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

const Login: React.FunctionComponent<LoginProps> = () => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const router = useRouter();

  if (loading) return <Loading />;
  else if (error) return <div>Error</div>;
  else if (user) {
    // user is already logged in, redirect to home page
    router.replace("/");
  }

  return (
    <>
      <Head>
        <title>Student Task Management | Login</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Login"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col-reverse w-screen h-auto grid-cols-2 overflow-y-hidden bg-gray-100 lg:h-screen md:grid">
        <div className="flex flex-col items-start justify-center w-full h-full gap-28 lg:pl-12 py-14">
          <div className="flex flex-col gap-y-4">
            <h1 className="px-6 text-4xl font-bold text-gray-800 font-poppins">
              Student Task Management
            </h1>
            <p className="px-6 text-2xl font-medium text-justify text-gray-500 font-poppins">
              a web app to
              <span className="text-gray-800">
                {" "}
                manage and track all your tasks
              </span>
              , provided with various features, user-friendly design and also it
              is free😀.
            </p>
          </div>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
        <div className="hidden -mt-12 md:p-8 lg:p-12 md:grid place-items-center">
          <LoginLottie />
        </div>
      </div>
    </>
  );
};

export default Login;
