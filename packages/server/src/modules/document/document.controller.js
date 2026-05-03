import fs from "fs";
import csv from "csv-parser";
import Document from "./document.model.js";

export const uploadDocument = async (req, res) => {
  console.log(req);
  try {
    const { projectId, text } = req.body;

    let content = "";

    // Plain text paste
    if (text) {
      content = text;
    }

    // txt file
    if (req.file && req.file.mimetype === "text/plain") {
      content = fs.readFileSync(req.file.path, "utf8");
    }

    // csv file
    if (req.file && req.file.mimetype.includes("csv")) {
      content = fs.readFileSync(req.file.path, "utf8");
    }

    const saved = await Document.create({
      projectId,
      filename: req.file?.originalname || "Pasted Text",
      content,
      type: req.file?.mimetype || "text/plain",
    });

    res.json({
      success: true,
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
