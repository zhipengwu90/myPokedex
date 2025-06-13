// import { ImageAnalysisClient } from "@azure-rest/ai-vision-image-analysis";
// import createClient from "@azure-rest/ai-vision-image-analysis";
// import { AzureKeyCredential } from "@azure/core-auth";
import { AzureOpenAI } from "openai";
import {
  getBearerTokenProvider,
  DefaultAzureCredential,
} from "@azure/identity";
export async function POST(request: Request): Promise<Response> {
  // const data = await request.formData();

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const arrayBuffer = await file.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = file.type; // e.g., "image/jpeg"
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const apiKey = process.env.apiKey;
  const endpoint = process.env.endpoint;
  const modelName = process.env.modelName as string | undefined;
  if (!modelName) {
    throw new Error("ModelName environment variable is not defined.");
  }
  const apiVersion = process.env.apiVersion;

  const options = {
    apiKey: apiKey,
    endpoint: endpoint,
    modelName: modelName,
    apiVersion: apiVersion,
  };
  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    model: modelName, // e.g., "gpt-4-vision-preview"
    messages: [
      {
        role: "system",
        content:
          "You are a pokemon professor, you can identify pokemon from the picture, and you will only respond with the name of the pokemon, for example, if there is one pikachu, return text 'pikachu', if there are multiple, return a comma-separated list. If the image is unclear or there is not pokemon, you can say 'unknown'.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "What Pokémon are in this image? Respond only with their names as a comma-separated list, or 'unknown'." },
          { type: "image_url", image_url: { url: dataUrl } }
        ],
      },
    ],
    max_tokens: 800,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const results = response.choices[0].message.content;
  // Example: results = "pikachu, bulbasaur"
  // const pokemonList = results
  //   .split(",")
  //   .map((name) => name.trim())
  //   .filter((name) => name && name.toLowerCase() !== "unknown");

  return await new Promise<Response>((resolve) => {
    resolve(
      new Response(JSON.stringify({ results }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  });
}

//   const formData = await request.formData();

//   const apiKey = process.env.VISION_KEY;
//   const endpoint = process.env.VISION_ENDPOINT;

//   if (!apiKey || !endpoint) {
//     return new Response(
//       JSON.stringify({
//         error:
//           "VISION_KEY and VISION_ENDPOINT must be defined in environment variables.",
//       }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }

//   const files = formData
//     .getAll("images")
//     .filter((f) => f instanceof File) as File[];
//   if (!files || files.length === 0) {
//     return new Response(JSON.stringify({ error: "No images uploaded" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   const client = createClient(endpoint, new AzureKeyCredential(apiKey));
//   const features = ["Caption", "Read"];

//   const results: any = [];
//   for (const file of files) {
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const result = await client.path("/imageanalysis:analyze").post({
//       body: buffer,
//       queryParameters: {
//         features,
//         language: "en",
//         "gender-neutral-captions": "true",
//         "smartCrops-aspect-ratios": [0.9, 1.33],
//       },
//       contentType: "application/octet-stream",
//     });

//     const iaResult = result.body;
//     let captionText = "";
//     let fullText = "";

//     if ("captionResult" in iaResult && iaResult.captionResult) {
//       captionText = iaResult.captionResult.text;
//     }
//     if ("readResult" in iaResult && iaResult.readResult?.blocks) {
//       const extractedText: string[] = [];
//       iaResult.readResult.blocks.forEach((block) => {
//         block.lines.forEach((line) => {
//           extractedText.push(line.text);
//         });
//       });
//       fullText = extractedText.join(" ");
//     }

//     results.push({
//       filename: file.name,
//       caption: captionText,
//       text: fullText,
//     });
//   }

//   return await new Promise<Response>((resolve) => {
//     resolve(
//       new Response(JSON.stringify({ results }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       })
//     );
//   });
// }
