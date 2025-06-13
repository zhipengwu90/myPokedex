import Image from "next/image";
import HomePage from "./homeComp/HomePage";
import { createClient } from "./utils/supabase/server";
import { redirect } from "next/navigation";
export default async function  Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();


  console.log("User data:", data);
  if (error || !data?.user) {
    redirect("/login");
  }


  return (
    <div>
      <HomePage />
    </div>
  );
}
