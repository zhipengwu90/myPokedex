"use client";

import IconSnap from "../imgs/IconSnapDark.png";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Button } from "@mui/material";

interface PhotoFooterProps {
  takeScreenshot: () => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  handleReset: () => void;
}

const PhotoFooter: React.FC<PhotoFooterProps> = ({
  takeScreenshot,
  capturedImage,
  setCapturedImage,
  handleReset,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="photo-footer-bg" />
      <div className="bg-pokeball" />
      <footer id="footer" className="flex photo-footer">
        <button
          type="button"
          className="menu-item flex-1 flex justify-center items-center  flex-col text-white gap-0.5 text-center  transition-all hover:bg-gray-800"
          onClick={() => router.back()}
        >
          <IconBack />
          Back
        </button>
        <div className="menu-item flex-1 flex justify-center">
          {!capturedImage ? (
            <button
              className={` cursor-pointer camera-button `}
              onClick={takeScreenshot}
              disabled={capturedImage !== null}
              title="Take a photo"
            >
              <img src={IconSnap.src} className="-mt-4" />
            </button>
          ) : (
            <Button
              variant="contained"
              color="error"
              size="small"
              className="!min-w-0 !px-2 !py-1"
              onClick={handleReset}
              disabled={capturedImage === null}
              title="Reset photo"
              sx={{
                fontSize: "0.75rem",
                padding: "2px 8px",
                minWidth: 0,
                lineHeight: 1.2,
              }}
            >
              <span className="text-xs">Reset</span>
            </Button>
          )}
        </div>

        <div className="menu-item flex-1 flex"></div>
      </footer>
    </>
  );
};

export default PhotoFooter;

const IconBack: React.FC = () => (
  <svg
    className="w-6 h-6 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m15 19-7-7 7-7"
    />
  </svg>
);

// <div className="flex-1 flex justify-center">
//         <button
//           className="camera-button flex justify-center items-center rounded-full shadow-lg "
//           onClick={takeScreenshot}
//           disabled={capturedImage !== null}
//           title="Take a photo"
//           style={{ outline: "none" }}
//         >
//           <img src={IconSnap.src} className="w-10 h-10" />
//         </button>
//       </div>
//       <div className="flex-1 flex justify-center">
//         <Button
//           variant="contained"
//           size="small"
//           className="!min-w-0 !px-2 !py-1"
//           onClick={() => setCapturedImage(null)}
//           disabled={capturedImage === null}
//           title="Reset photo"
//           sx={{
//             fontSize: "0.75rem",
//             padding: "2px 8px",
//             minWidth: 0,
//             lineHeight: 1.2,
//           }}
//         >
//           <span className="text-xs">Reset</span>
//         </Button>
