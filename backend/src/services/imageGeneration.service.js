const { InferenceClient } = require("@huggingface/inference");
const { uploadImage } = require("./cloudinary.service");

const client = new InferenceClient(process.env.HF_TOKEN);

async function generateImage(prompt) {
  try {
    const blob = await client.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: { num_inference_steps: 20 },
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64 = `data:image/png;base64,${buffer.toString("base64")}`;

    const url = await uploadImage(base64);

    return url;
  } catch (err) {
    console.error("❌ Error in generateImage:", err.message);
    throw err;
  }
}

module.exports = { generateImage };


const { GoogleGenAI, Modality } = require( "@google/genai")

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}

main();