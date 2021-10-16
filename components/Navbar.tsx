import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useUserStore } from "../stores/User/UserContext";
import Link from "next/link";
import MenuIcon from "@material-ui/icons/Menu";
import { useAppStore } from "../stores/AppContext";

export interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const { userData } = useUserStore();
  const { isSidebarOpen, setIsSidebarOpen } = useAppStore();
  const router = useRouter();

  // trigger when logout button clicked
  const handleSignOut = async () => {
    await firebase.auth().signOut();
    return router.replace("/login");
  };

  const getNavTitle = () => {
    if (router.route == "/")
      return `🏡 ${user.displayName.split(" ")[0]}'s Homepage`;
    else if (router.route == "/calendar")
      return `📅 ${user.displayName.split(" ")[0]}'s Calendar`;
    else if (router.route.includes("/task-sections/[section-id]"))
      return `✍ # ${
        userData &&
        userData.user &&
        userData.user.taskSections.find(
          (sec) => sec.id == router.query["section-id"]
        ) &&
        userData.user.taskSections.find(
          (sec) => sec.id == router.query["section-id"]
        ).title
      }`;
    else if (router.route.includes("/note-sections/[section-id]"))
      return `📝 # ${
        userData &&
        userData.user &&
        userData.user.noteSections.find(
          (sec) => sec.id == router.query["section-id"]
        ) &&
        userData.user.noteSections.find(
          (sec) => sec.id == router.query["section-id"]
        ).title
      }`;
    else if (router.route.includes("/rooms/[room-id]"))
      return `🏢 # ${
        userData &&
        userData.user &&
        userData.user.rooms.find((sec) => sec.id == router.query["room-id"]) &&
        userData.user.rooms.find((sec) => sec.id == router.query["room-id"])
          .roomName
      }`;
    else if (router.route === "/rooms/join") return "🏢 Join Room";
    else if (router.route === "/stats") return "📊 Statistics";
    else return "";
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-8 bg-white shadow-md">
      <div
        className="flex md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuIcon />
      </div>
      <h1 className="text-lg font-semibold md:text-xl font-poppins">
        {getNavTitle()}
      </h1>
      <div className="items-center hidden gap-4 md:flex">
        {router.route.includes("/rooms/[room-id]") && (
          <Link href="/">
            <button className="px-4 py-1.5 font-semibold text-gray-900 border border-gray-700 rounded-md hover:text-white hover:bg-gray-700 align-center">
              🏠 Back To Home
            </button>
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="px-4 py-1.5 font-semibold text-white bg-red-500 border border-red-500 rounded-md align-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
