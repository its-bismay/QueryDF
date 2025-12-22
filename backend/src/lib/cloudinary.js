import { v2 as cloudinary } from "cloudinary";
import ENV from "./envConfig.js";

cloudinary.config({ 
  cloud_name: ENV.cloudinaryCloudName, 
  api_key: ENV.cloudinaryApiKey, 
  api_secret: ENV.cloudinaryApiSecret
});

export const uploadToCloudinary = async (file, pdfName) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",   
          folder: "QueryDF",
          public_id: `${Date.now()}_${pdfName}`,
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      )
      .end(file.buffer);
  });

  return result;
};