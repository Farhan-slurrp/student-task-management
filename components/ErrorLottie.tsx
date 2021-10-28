import React from "react";
import Lottie from "react-lottie";
import animation from "../public/38463-error.json";

export interface ErrorLottieProps {}

const ErrorLottie: React.FunctionComponent<ErrorLottieProps> = () => {
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

export default ErrorLottie;
