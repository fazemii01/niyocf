import dataUriParser from "datauri/parser.js";
import path from "path";
import sharp from "sharp";

import cloudinary from "../configs/cloudinary.js";

const uploader = async (req, prefix, suffix) => {
  const { file } = req;
  if (!file) return { data: null };

  try {
    // Convert buffer to webp format
    const buffer = await sharp(file.buffer).webp().toBuffer();
    const parser = new dataUriParser();
    const datauri = parser.format(".webp", buffer); // Ensure correct format

    console.log("Data URI:", datauri.content); // Debugging log

    if (!datauri.content) {
      throw new Error("Invalid Data URI format");
    }

    const filename = `${prefix}-${file.fieldname}-${suffix}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(datauri.content, {
      public_id: filename,
      folder: "niyocf",
      resource_type: "image", // Ensure correct resource type
    });

    return { data: result, msg: "Upload Success" };
  } catch (err) {
    console.error("Upload Error:", err); // Log the full error
    return { data: null, msg: "Upload Failed", error: err.message };
  }
};

export default uploader;
