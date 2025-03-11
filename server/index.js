import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminRoutes from "./routes/admin.js";
import ProductRoutes from "./routes/product.js";
import PartnerRoutes from "./routes/partner.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


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
