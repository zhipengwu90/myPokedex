import React, { useState } from "react";
import PokemonDetail from "./PokemonDetail";

type Props = {
  pokemonList: {
    name: string;
    image: string;
    [key: string]: any;
  }[];
};

const Pokedex = (props: Props) => {
  const { pokemonList } = props;
  const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null);

  const handleClose = () => setSelectedPokemon(null);

  const handleSelectPokemon = (pokemon: any) => setSelectedPokemon(pokemon);



  return (
    <div className="mt-12 p-4">
      {/* Show PokemonDetail window if a pokemon is selected */}
      {selectedPokemon && (
        <>
          <div className="fixed top-0  left-0 w-full  z-20 h-[92%]  shadow-lg ">
            <PokemonDetail
              pokemon={selectedPokemon}
              onClose={handleClose}
              onSelectPokemon={handleSelectPokemon}
            />
          </div>
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={handleClose}
          />
        </>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
        {pokemonList.map((pokemon) => (
          <div
            key={ `${pokemon.name}-${pokemon.id}`}
            className="flex flex-col items-center bg-white rounded-lg shadow p-4
            hover:shadow-lg transition-shadow duration-300
            cursor-pointer
            hover:bg-gray-100
            dark:bg-gray-800 dark:hover:bg-gray-700
            dark:text-white
            "
            onClick={() => handleSelectPokemon(pokemon)}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-20 h-20 object-contain mb-2"
            />
            <span className="capitalize font-semibold">{pokemon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pokedex;
