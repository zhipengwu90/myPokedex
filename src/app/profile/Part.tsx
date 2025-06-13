import React, { useState, useRef, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
type Props = {};

const Part = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const handlerLogout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    router.push("/"); // Redirect to home page
    router.refresh();
  };
  const fetchUser = async () => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      } else {
        setUser(data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="mt-12 p-4 text-center  text-xl text-gray-400">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <p className="text-lg">Email: {user?.email}</p>
        {/* <p className="text-lg">ID: {user?.id}</p>
        <p className="text-lg">Created at: {user?.created_at}</p>
        <p className="text-lg">Updated at: {user?.updated_at}</p> */}
      </div>

      <Button
        onClick={handlerLogout}
        variant="contained"
        color="error"
        className=""
      >
        Logout
      </Button>
    </div>
  );
};

export default Part;
