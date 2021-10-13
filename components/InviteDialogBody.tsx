import React, { ReactElement } from "react";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface Props {
  link: string;
}

export default function InviteDialogBody({ link }: Props): ReactElement {
  const [copied, setCopied] = React.useState<boolean>(false);

  return (
    <div className="flex items-center w-full gap-2">
      <input
        type="text"
        value={link}
        readOnly
        className="py-2 pl-2 pr-32 border border-gray-300 rounded-md outline-none"
      />
      <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
        <button className="flex gap-1 px-3 py-2 border border-gray-400 hover:border-green-400 group hover:bg-green-400">
          <FileCopyOutlinedIcon
            fontSize="small"
            className="group-hover:text-white"
          />
          <span
            className={`pl-1 font-semibold text-sm ${
              copied ? "text-yellow-500" : ""
            } group-hover:text-white`}
          >
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </button>
      </CopyToClipboard>
    </div>
  );
}
