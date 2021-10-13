import React, { ReactElement } from "react";
import firebase from "../../firebase/clientApp";

interface Props {
  roomId: string | string[];
  handleClose: () => void;
}

export default function UploadFileForm({
  roomId,
  handleClose,
}: Props): ReactElement {
  const storage = firebase.storage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target["files[]"].files;
    console.log(file);
    if (file.length > 0) {
      const metadata = {
        contentType: file[0].type,
      };
      await storage.ref(`${roomId}/${file[0].name}`).put(file[0], metadata);
      handleClose();
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 px-4 pt-8 pb-4 border border-gray-300 rounded-md"
      >
        <input name="files[]" type="file" multiple />
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="px-3 py-1 font-semibold text-white bg-blue-500 rounded-md"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => handleClose()}
            className="px-3 py-1 font-semibold text-white bg-gray-500 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
