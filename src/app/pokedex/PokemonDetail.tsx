import React, { useRef, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

import AudioPlayerButton from "./AudioPlayerButton"; // Adjust the import path as needed
type Props = {
  className?: string;
  pokemon: any;
  onClose: () => void;
  onSelectPokemon?: (pokemon: any) => void; // add this
};

const PokemonDetail = (props: Props) => {
  const { className, pokemon, onClose } = props;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [evolutionChain, setEvolutionChain] = useState<any>(null);
  const [evolutionDetails, setEvolutionDetails] = useState<any[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play and pause handlers
  const handlePlay = () => {
    audioRef.current?.play();
  };
  const handlePause = () => {
    audioRef.current?.pause();
  };

  // Listen for play/pause events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
    };
  }, [pokemon.id]);

  // Helper function to recursively collect all species names in the chain
  const getAllEvolutions = (chain: any, arr: any[] = []) => {
    if (!chain) return arr;
    arr.push({ name: chain.species.name, url: chain.species.url });
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evo: any) => getAllEvolutions(evo, arr));
    }
    return arr;
  };

  // Fetch evolution chain and details
  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
        );
        const data = await response.json();
        const evolutionChainUrl = data.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionData = await evolutionResponse.json();
        setEvolutionChain(evolutionData);

        // Get all species in the chain
        const evolutions = getAllEvolutions(evolutionData.chain);

        // Fetch details for each evolution species
        const details = await Promise.all(
          evolutions.map(async (evo: any) => {
            // Get the pokemon name from species
            const res = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${evo.name}`
            );
            const detail = await res.json();
            return {
              name: detail.name,
              image: detail.sprites.front_default,
              id: detail.id,
              detail,
            };
          })
        );
        setEvolutionDetails(details);
      } catch (error) {
        setEvolutionChain(null);
        setEvolutionDetails([]);
      }
    };

    fetchEvolutionChain();
    setSelectedPokemon(null); // Reset if parent changes
  }, [pokemon]);

  // If a Pokémon in the chain is clicked, show its detail in a new window
  if (selectedPokemon) {
    return (
      <PokemonDetail
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    );
  }
  console.log("pokemon", pokemon);
  return (
    <div
      className={`relative mt-19  flex flex-col  items-center justify-center h-full p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto overflow-y-auto `}
    >
      {/* Close Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 12,
          right: 0,
          color: "black",
          fontSize: 48,
        }}
        onClick={onClose}
        size="large"
      >
        <HighlightOffIcon sx={{ fontSize: 48 }} />
      </IconButton>
      {/* Pokemon Image and Name */}

      <img
        src={pokemon.image || pokemon.sprites?.front_default}
        alt={pokemon.name}
        className="w-50 h-50 mt-20"
      />

      {/* {isPlaying ? (
        <IconButton onClick={handlePause} aria-label="Pause cry">
          <PauseCircleIcon fontSize="large" color="error" />
        </IconButton>
      ) : (
        <IconButton onClick={handlePlay} aria-label="Play cry">
          <PlayCircleFilledIcon fontSize="large" color="error" />
        </IconButton>
      )} */}
      {/* <audio
        ref={audioRef}
        className="hidden"
        key={pokemon.id || pokemon.name} // <-- force remount on pokemon change
      >
        <source src={pokemon.cries?.latest} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio> */}
      <AudioPlayerButton
        text={
          `This is ${
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          }, a ${pokemon.types
            ?.map((t: any) => t.type.name)
            .join(" and ")} type Pokémon. ` +
          `It stands ${pokemon.height / 10} meters tall and weighs ${
            pokemon.weight / 10
          } kilograms. ` +
          `Its abilities are ${pokemon.abilities
            ?.map((a: any) => a.ability.name)
            .join(", ")}.` +
          (pokemon.cries?.latest ? " Listen to its cry." : "")
        }
        soundUrl={pokemon.cries?.latest}
      />
      <h2 className="text-3xl capitalize font-bold mb-2">{pokemon.name}</h2>

      <div className="mb-2">
        <span className="font-semibold">Type: </span>
        {pokemon.types?.map((t: any) => (
          <span
            key={t.type.name}
            className="capitalize mr-2 px-2 py-1 rounded bg-orange-200 text-orange-800"
          >
            {t.type.name}
          </span>
        ))}
      </div>
      {/* <div className="mb-2">
        <span className="font-semibold">Base Experience:</span>{" "}
        {pokemon.base_experience}
      </div> */}
      <div className="mb-2">
        <span className="font-semibold">Height:</span> {pokemon.height}
        <span className="ml-4 font-semibold">Weight:</span> {pokemon.weight}
      </div>
      <div className="mb-2 ">
        <div className="font-semibold">Abilities:</div>
      </div>

      <div className="mb-2 ">
        {pokemon.abilities?.map((a: any) => (
          <span
            key={a.ability.name}
            className="capitalize mr-2 px-2 py-1 rounded bg-blue-100 text-blue-800"
          >
            {a.ability.name}
          </span>
        ))}
      </div>
      <div className="font-semibold">Evolution Chain:</div>
      {evolutionDetails.length > 0 ? (
        <div className="mb-2  ">
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            {evolutionDetails.map((evo) => (
              <div
                key={evo.id}
                className="flex flex-col items-center cursor-pointer hover:bg-gray-100 rounded p-2"
                onClick={() => {
                  if (props.onSelectPokemon) {
                    props.onClose(); // close current modal
                    props.onSelectPokemon(evo.detail); // open new one
                  }
                }}
              >
                <img
                  src={evo.image}
                  alt={evo.name}
                  className="w-16 h-16 object-contain"
                />
                <span className="capitalize">{evo.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No evolutions found</div>
      )}
    </div>
  );
};

export default PokemonDetail;
