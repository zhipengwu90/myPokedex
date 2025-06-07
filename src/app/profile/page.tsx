"use client";
import React from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";
import Part from "./Part";

import Pokedex from "../pokedex/Pokedex";
type Props = {};

const page = (props: Props) => {
  return (
    <>
      <Header />
      <Part />
      <Footer />
    </>
  );
};

export default page;
