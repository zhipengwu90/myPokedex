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
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // <-- add this
  const webcamRef = useRef(null);
  const [play] = useSound("/snap.mp3");
  const [pokeName, setPokeName] = useState<string | null>(null);

  const [pokemonData, setPokemonData] = useState<any[]>([]); // State to hold fetched Pokemon data

  const [isLoading, setIsLoading] = useState(false);

  const [isApokemon, setIsApokemon] = useState(false);
  const takeScreenshot = async () => {
    play();
    if (webcamRef.current) {
      setIsLoading(true);
      // @ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc); // <-- store the image
        // Convert base64 to Blob
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        // Create a File object if needed
        const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });

        setPhotoCatch(true);
        uploadImage(file); // Pass the file to
        // Create a fake event to reuse uploadImage
      }
    }
  };

  const fetchPokemon = async (el: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${el}`);

      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon data");
      }

      const res = await fetch(response.url);
      const details = await res.json();

      return {
        name: details.name,
        image: details.sprites.front_default,
        ...details,
      };
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      return null;
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/imageAPI", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setPokeName("Unknown Pokémon");
        setPokemonData([]);
        setIsLoading(false);
        setPhotoCatch(false);
        return;
      }

      const data = await response.json();
      const result = data.results;
      setPhotoCatch(false);
      setIsLoading(false);

      if (result === "unknown") {
        setPokeName("Unknown Pokémon");
        setIsApokemon(false);
        setPokemonData([]);
      } else if (result.includes(",")) {
        const names = result.split(",").map((name: string) => name.trim());
        const pokemonPromises = names.map((name: string) => fetchPokemon(name));
        const pokemonResults = await Promise.all(pokemonPromises);
        const filteredResults = pokemonResults.filter((name) => name !== null);
        setPokemonData(filteredResults);
        setPokeName(filteredResults.length > 0 ? result : "Unknown Pokémon");
      } else {
        const pokemonName = await fetchPokemon(result);
        if (pokemonName) {
          setPokemonData([pokemonName]);
          setPokeName(result);
        } else {
          setPokemonData([]);
          setPokeName("Unknown Pokémon");
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setPokeName("Unknown Pokémon");
      setPokemonData([]);
      setIsLoading(false);
      setPhotoCatch(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setPokeName(null);
    setPokemonData([]);
    setPhotoCatch(false);
  };

  return (
    <>
      <Header />
      <div className="camera-image-holder">
        <div className={`video-holder ${"buttonPressed"}`}>
          {capturedImage ? (
            <div
              className="camera-snap-preview fading-in-out"
              style={{
                backgroundImage: `url(${capturedImage})`,
              }}
            />
          ) : (
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
          )}
        </div>
      </div>

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
            {!pokeName ? (
              <>
                <div className="title">Camera</div>
                <div className="desc capturing">Capture a photo of Pokemon</div>
              </>
            ) : pokeName === "Unknown Pokémon" || pokemonData.length === 0 ? (
              <>
                <div className="title text-red-500">Not Found</div>
                <div className="desc text-red-400">
                  Can't find the Pokémon from the picture.
                </div>
              </>
            ) : (
              <>
                <Pokedex pokemonList={pokemonData} className="text-black" />
              </>
            )}
          </div>
        )}
      </div>
      <PhotoFooter
        handleReset={handleReset}
        capturedImage={capturedImage}
        setCapturedImage={setCapturedImage}
        takeScreenshot={takeScreenshot}
      />
    </>
  );
};

export default page;
