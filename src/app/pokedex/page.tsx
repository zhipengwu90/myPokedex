"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";
import Pokedex from "./Pokedex";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {};

interface Pokemon {
  name: string;
  image: string;
  [key: string]: any;
}

const PAGE_LIMIT = 40;

const page = (props: Props) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Pokemon[] | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);

  const getPokemon = async (currentOffset = 0) => {
    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_LIMIT}&offset=${currentOffset}`
    );
    const data = await response.json();
    const newPokemonList = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();
        return {
          name: details.name,
          image: details.sprites.front_default,
          ...details,
        };
      })
    );
    setPokemonList((prev) => [...prev, ...newPokemonList]);
    setHasMore(Boolean(data.next));
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    getPokemon(0);
    setOffset(PAGE_LIMIT);
  }, []);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore && !search) {
        getPokemon(offset);
        setOffset((prev) => prev + PAGE_LIMIT);
      }
    },
    [loading, hasMore, offset, search]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  // Search handler (on submit or blur)
  const handleSearch = async (value: string) => {
    if (!value) {
      setSearchResult(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Not found");
      const details = await res.json();
      setSearchResult([
        {
          name: details.name,
          image: details.sprites.front_default,
          ...details,
        },
      ]);
    } catch {
      setSearchResult([]);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <form
        className="fixed right-1 gap-2 mt-2 bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(search);
        }}
      >
        <div className="flex ">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Pokémon by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={(e) => handleSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full pr-10"
          />
          {search && (
            <IconButton
              size="small"
              className="!absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => {
                setSearch("");
                setSearchResult(null);
              }}
              aria-label="Clear"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        </div>
      </form>
      <Pokedex
        pokemonList={searchResult !== null ? searchResult : pokemonList}
      />
      {searchResult !== null && searchResult.length === 0 && (
        <div className="text-center text-red-500 my-4">
          No Pokémon found for "{search}"
        </div>
      )}
      {!search && <div ref={loader} />}
      {loading && <div className="text-center py-4">Loading...</div>}
      <Footer />
    </>
  );
};

export default page;
