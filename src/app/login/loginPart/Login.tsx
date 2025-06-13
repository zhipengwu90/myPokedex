"use client";
import React, { useState, useEffect, Suspense } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { login } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import LoginImage from "../../imgs/login-image.png";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "@/app/component/Header";

type Props = {};

const LoginPage = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const loginHandler = async () => {
    setIsLoading(true);
    setErrorMessage(""); // Clear previous error message
    if (email.trim() === "" || password.trim() === "") {
      console.log("Email and password cannot be empty.");
      setIsLoading(false);
      return;
    }
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/");
      } else {
        setIsLoading(false);
        setErrorMessage(result.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      setErrorMessage("Invalid login credentials. Please try again.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      loginHandler();
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <CircularProgress color="inherit" />
          </div>
        )}

        <div className=" flex flex-col justify-center items-center rounded-lg h-full gap-3">
          <img src={LoginImage.src} width="200" className="" />
          {/* <div className="text-dark text-xl font-bold"> Login </div> */}
          <div className="px-3 ">
            <TextField
              label="Email"
              color="info"
              type="email"
              placeholder="Enter your email"
              className="w-full z-0 bg-white"
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              onKeyDown={handleKeyPress}
              style={{ marginBottom: "1rem" }}
            />
            <TextField
              label="Password"
              type="password"
              placeholder="Enter your password"
              color="info"
              className="w-full z-0 bg-white"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              onKeyDown={handleKeyPress}
              style={{ marginBottom: "1rem" }}
            />

            {errorMessage && (
              <div className="text-red-500 text-sm font-bold">
                {errorMessage}
              </div>
            )}
          </div>

          <Button
            disabled={email === "" || password === ""}
            onClick={loginHandler}
            variant="contained"
            sx={{
              px: 4, // horizontal padding (left & right)
              py: 1.5,
              "&.Mui-disabled": {
                backgroundColor: "#e0e0e0", // your custom disabled background
                color: "#2e2a2a", // your custom disabled text color
              },
            }}
          >
            Log in
          </Button>
        </div>
      </div>
    </>
  );
};

// const LoginPage = () => (
//   <Suspense fallback={<div>Loading...</div>}>
//     <Login />
//   </Suspense>
// );

export default LoginPage;
