import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import fs from 'fs';
import path from 'path';

import AdminRoutes from "./routes/admin.js";
import ProductRoutes from "./routes/product.js";
import PartnerRoutes from "./routes/partner.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (a, b, cb) => {
    cb(null, "uploads");
  },
  filename: (a, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.array("photos"), async (req, res) => {
  const uploadedImages = req.files.map(
    (file) => `http://localhost:4000/uploads/${file.filename}`
  );
  res.status(200).json({
    message: "Изображения успешно загружены!",
    photos: uploadedImages,
  });
  console.log("Successfully send a image")
});

app.get("/", (_, res) => res.send("Hello world!"));

app.use("/admin", AdminRoutes);
app.use("/product", ProductRoutes);
app.use("/partner", PartnerRoutes);

const startApp = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT, () =>
      console.log(`server is running on http://localhost:${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startApp();
