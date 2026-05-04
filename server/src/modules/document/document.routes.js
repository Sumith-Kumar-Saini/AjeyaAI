import express from "express";
import multer from "multer";
import { uploadDocument } from "./document.controller.js";

const uploadRoutes = express.Router();
const upload = multer({ dest: "uploads/" });

uploadRoutes.post("/upload", upload.single("file"), uploadDocument);

export default uploadRoutes;
