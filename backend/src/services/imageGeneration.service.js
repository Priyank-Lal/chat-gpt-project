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
