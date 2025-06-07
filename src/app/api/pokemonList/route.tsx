export async function GET(request: Request): Promise<Response> {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Pokemon list" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
