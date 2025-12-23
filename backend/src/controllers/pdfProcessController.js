import { inngest } from "../inngest/inngestClient.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF required" });
    }

    const pdfName = req.file.originalname
      .replace(/\.pdf$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

    const result = await uploadToCloudinary(req.file, pdfName);
    const pdfUrl = result.secure_url;
    
      await inngest.send({
      name: "pdf/process",
      data: {
        filePath: pdfUrl,
        pdfName,
      },
    });

    return res.status(200).json({
      success: true,
      url: pdfUrl,
      pdf_name: pdfName,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "PDF upload failed",
    });
  }
};
