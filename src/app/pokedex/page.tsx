"use client";
import React, { useEffect, useState } from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";

import Pokedex from "./Pokedex";
type Props = {};

interface Pokemon {
  name: string;
  image: string;
  [key: string]: any; // Use index signature for other properties if needed
}
const page = (props: Props) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const getPokemon = async () => {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0"
    );
    const data = await response.json();
    // Get details for each Pokémon
    const pokemonList = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();

        return {
          name: details.name,
          image: details.sprites.front_default,
          ...details, // Spread other properties if needed
        };
      })
    );

    setPokemonList(pokemonList);
    return pokemonList;
  };
  useEffect(() => {
    getPokemon();
  }, []);
  return (
    <>
      <Header />
      <Pokedex pokemonList={pokemonList} />

      <Footer />
    </>
  );
};

export default page;
