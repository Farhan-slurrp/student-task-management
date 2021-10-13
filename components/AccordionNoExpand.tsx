import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export interface AccordionNoExpandProps {
  title: String;
  link: string;
  path?: string;
}

const AccordionNoExpand: React.FunctionComponent<AccordionNoExpandProps> = ({
  title,
  link,
  path,
}) => {
  const router = useRouter();

  const isActive = () => {
    return path ? router.route === path : router.route == link;
  };

  return (
    <Link href={link}>
      <div
        className={`w-full mx-auto  ${
          isActive() ? "text-blue-300" : "text-white"
        }`}
      >
        <div
          className={`flex items-center justify-between p-2 cursor-pointer bg-gray-700 ${
            isActive() ? "border-l-4 border-blue-300" : ""
          } `}
        >
          <p>{title}</p>
        </div>
      </div>
    </Link>
  );
};

export default AccordionNoExpand;
