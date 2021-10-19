import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import firebase from "../../../firebase/clientApp";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import AddIcon from "@material-ui/icons/Add";
import ModalComp from "../../../components/Modal";
import { useAppStore } from "../../../stores/AppContext";
import FileMenu from "../../../components/file/FileMenu";
import Head from "next/head";

interface Props {}

function RoomFile({}: Props): ReactElement {
  const storage = firebase.storage();
  const router = useRouter();
  const roomID = router.query["room-id"];
  const [files, setFiles] = React.useState([]);
  const roomStorage = storage.ref(roomID.toString());
  const [openModal, setModalOpen] = React.useState<boolean>(false);
  const { refreshData } = useAppStore();

  const getAllFiles = async () => {
    // const uploadTask = await storage.ref(`${roomID}/test`);
    const returnedFiles = (await roomStorage.listAll()).items.map((file) => {
      return {
        name: file.name,
      };
    });
    setFiles(returnedFiles);
  };

  const downloadFile = (name) => {
    roomStorage
      .child(name)
      .getDownloadURL()
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        // var xhr = new XMLHttpRequest();
        // xhr.responseType = "blob";
        // xhr.onload = (event) => {
        //   var blob = xhr.response;
        // };
        // xhr.open("GET", url);
        // xhr.send();

        // open download url on new page
        if (typeof window !== "undefined") {
          window.open(url, "_blank");
        }
      })
      .catch((error) => {
        // Handle any errors
        console.log(error);
      });
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    getAllFiles();
  };

  React.useEffect(() => {
    getAllFiles();
  }, []);

  // console.log(files);

  return (
    <>
      <Head>
        <title>Student Task Management | Room Files</title>
        <meta
          name="description"
          content="UCYP Student Task Management System | Room Files"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col h-auto gap-6 px-4 pt-12 pb-6 md:px-12">
        <h1 className="text-4xl font-bold text-gray-800">All Files</h1>
        <p className="w-full text-justify md:w-1/2">
          This page list all files that related to the room project.
          <br />
          Click
          <span className="px-1 m-1 font-semibold text-gray-700 bg-gray-100">
            <AddIcon fontSize="small" /> New File
          </span>
          {"  "}
          to add new file <em>(image, pdf, or other document format)</em>.
          <br />
          Click file name on the list to download the file.
        </p>
        <button className="justify-start hidden pt-6 cursor-default md:flex">
          <p
            className="flex items-center p-2 font-semibold text-white align-middle bg-blue-500 rounded-md shadow-sm cursor-pointer"
            onClick={handleModalOpen}
          >
            <AddIcon fontSize="small" /> New File
          </p>
        </button>
        <ModalComp
          open={openModal}
          type="uploadFile"
          handleClose={handleModalClose}
          payload={{ roomId: roomID }}
        />
        {files.length > 0 ? (
          <div className="border-t border-l border-r border-gray-300">
            {files.map((file, idx) => (
              <a
                onClick={() => downloadFile(file.name)}
                key={idx}
                target="_blank"
                className="group"
              >
                <div className="flex items-center justify-between p-3 border-b border-gray-300 cursor-pointer group hover:bg-gray-100">
                  <p className="font-semibold group-hover:underline group-hover:text-blue-500">
                    {file.name}
                  </p>
                  <FileMenu filename={file.name} getAllFiles={getAllFiles} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-6">
            <DescriptionOutlinedIcon
              fontSize="large"
              className="text-gray-700 transform scale-150"
            />
            <p className="mt-4 font-medium text-center text-gray-700 md:text-base">
              The room currently have no files. <br />
              Start to upload your project files.
            </p>
          </div>
        )}
      </div>
      <div className="block h-12 md:hidden"></div>
      <div className="fixed flex justify-end md:hidden bottom-5 right-5">
        <button
          onClick={handleModalOpen}
          className="p-4 text-white bg-blue-500 rounded-full"
        >
          <AddIcon />
        </button>
      </div>
    </>
  );
}

export default RoomFile;
