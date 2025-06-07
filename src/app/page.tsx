import Image from "next/image";
import HomePage from "./homeComp/HomePage";

export default function Home() {
  const PASSWORD = process.env.PASSWORD ?? "";

  return (
    <div>
      <HomePage password={PASSWORD} />
    </div>
  );
}
