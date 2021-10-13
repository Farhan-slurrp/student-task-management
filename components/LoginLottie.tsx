import React from "react";
import Lottie from "react-lottie";
import animation from "../public/48791-kanban-board-animation.json";

export interface LoginLottieProps {}

const LoginLottie: React.FunctionComponent<LoginLottieProps> = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} />;
};

export default LoginLottie;
