const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(base64Image, folder = "ai-chatbot") {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
    });
    return result.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message);
    throw err;
  }
}

module.exports = { uploadImage };
