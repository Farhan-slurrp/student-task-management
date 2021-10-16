import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useUserStore } from "../stores/User/UserContext";
import menus from "../src/menus.json";
import { useAppStore } from "../stores/AppContext";
import ModalComp from "../components/Modal";

export default function Home() {
  const { user, isSidebarOpen } = useAppStore();
  const { createNewUser } = useUserStore();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");

  // create new user if data doesnt exist in database
  React.useEffect(() => {
    // create function to handle promise
    if (user) {
      createNewUser();
    }
  }, [user]);

  if (!user) {
    // go to login page if not logged in
    router.push("/");
    return <div></div>;
  }

  const handleOpen = (type) => {
    setType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Head>
        <title>Student Task Management | Home</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Homepage"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className={`h-full`}>
        <div className="hidden md:block">
          <Image
            src="/banner.jpg"
            width={200}
            height={40}
            sizes="100vw"
            layout="responsive"
            className="object-cover"
            placeholder="blur"
            blurDataURL="https://www.ucyp.edu.my/wp-content/uploads/2020/11/DJI_0004-scaled.jpg"
          />
        </div>
        <div className="block md:hidden">
          <Image
            src="/banner.jpg"
            width={80}
            height={40}
            sizes="100vw"
            layout="responsive"
            className="object-cover"
            placeholder="blur"
            blurDataURL="https://www.ucyp.edu.my/wp-content/uploads/2020/11/DJI_0004-scaled.jpg"
          />
        </div>
        <div className="z-50 flex flex-col px-10 md:px-24">
          <ModalComp open={open} type={type} handleClose={handleClose} />
          <h1 className="z-20 hidden text-3xl md:absolute md:block md:text-6xl -mt-14">
            🏡
          </h1>
          <h1 className="pt-10 text-3xl font-semibold md:text-4xl">
            Welcome {user.displayName.split(" ")[0]}!
          </h1>
          <p className="pt-4 text-base font-medium text-justify text-gray-700">
            This is your homepage, your starting point to the next destination.{" "}
            <br />
            You can choose one of the options below to get started.
          </p>
          <div className="flex flex-col grid-cols-2 gap-4 pt-12 pr-24 md:grid">
            {menus.map((menu) =>
              menu.link ? (
                <Link href={menu.link} key={menu.title}>
                  <p
                    key={menu.title}
                    className="cursor-pointer hover:text-blue-700"
                  >
                    {menu.title}
                  </p>
                </Link>
              ) : (
                <p
                  key={menu.title}
                  className="cursor-pointer hover:text-blue-700"
                  onClick={() => handleOpen(menu.type)}
                >
                  {menu.title}
                </p>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
