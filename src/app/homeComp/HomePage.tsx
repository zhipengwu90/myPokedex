"use client";

import React, { useState, FormEvent } from "react";
import HomeContent from "./HomeContent";
import Header from "../component/Header";
import Footer from "../component/Footer";

interface HomePageProps {
  password: string;
}

const HomePage: React.FC<HomePageProps> = ({ password }) => {
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");

  // const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (passwordInput === password) {
  //     setIsAuthenticated(true);
  //     setPasswordError("");
  //   } else {
  //     setPasswordError("Incorrect password.");
  //   }
  // };

  // if (!isAuthenticated) {
  //   return (
  //     <form
  //       onSubmit={handlePasswordSubmit}
  //       style={{
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         marginTop: 100,
  //       }}
  //     >
  //       <input
  //         type="password"
  //         value={passwordInput}
  //         onChange={(e) => setPasswordInput(e.target.value)}
  //         placeholder="Enter password"
  //         style={{
  //           padding: 8,
  //           fontSize: 16,
  //           marginBottom: 8,
  //           borderRadius: 4,
  //           border: "1px solid #ccc",
  //           width: 300,
  //         }}
  //       />
  //       <button
  //         type="submit"
  //         style={{
  //           padding: 8,
  //           fontSize: 16,
  //           backgroundColor: "#0070f3",
  //           color: "white",
  //           border: "none",
  //           borderRadius: 4,
  //           cursor: "pointer",
  //           width: 300,
  //         }}
  //       >
  //         Enter
  //       </button>
  //       {passwordError && (
  //         <div style={{ color: "red", marginTop: 8 }}>{passwordError}</div>
  //       )}
  //     </form>
  //   );
  // }
  return (
    <>
      <Header />
      <HomeContent />
      <Footer />
    </>
  );
};

export default HomePage;
