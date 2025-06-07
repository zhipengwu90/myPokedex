"use client";
import React from "react";

import { useEffect, useRef, useState } from "react";
import Header from "../component/Header";
import PhotoFooter from "../component/PhotoFooter";
import Webcam from "react-webcam";
import useSound from "use-sound";

import Pokedex from "../pokedex/Pokedex";
type Props = {};

const page = (props: Props) => {
  const [photoCatch, setPhotoCatch] = useState(false);
  const [play] = useSound("/snap.mp3");
  const takeScreenshot = async () => {
    play();
    console.log("Taking screenshot...");
  };
  const webcamRef = useRef(null);

  const uploadImage = async () => {};

  return (
    <>
      <Header />
      <div className="camera-image-holder">
        <div className={`video-holder ${"buttonPressed"}`}>
          <Webcam
            onClick={() => {
              // trigger input file upload
              const input = document.querySelector('input[type="file"]');
              if (input) {
                (input as HTMLInputElement).click();
              }
            }}
            ref={webcamRef}
            forceScreenshotSourceSize={true}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment",
            }}
          />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={uploadImage}
        style={{ display: "none" }}
      />

      <div className="camera-text">
        {photoCatch ? (
          <div className="capture-processing">
            <div className="mt-4 bouncing-loader">
              <div />
              <div />
              <div />
            </div>
            <span>
              <div className="desc processing">Processing</div>
            </span>
          </div>
        ) : (
          <div className="capture-anything">
            <div className="title">Camera</div>
            <div className="desc capturing">Capture a photo of Pokemon</div>
          </div>
        )}
      </div>
      <PhotoFooter takeScreenshot={takeScreenshot} />
    </>
  );
};

export default page;
