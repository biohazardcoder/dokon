import express from "express";
import {
    CreateNewPartner,
    DeletePartner,
    GetAllPartners,
    GetOnePartner,
    UpdatePartner,
    AddProductToPartner,
    EditProductInPartner,
    DeleteProductFromPartner,
    CreatedAtChanger
} from "../controllers/partners.js";
import isExisted from "../middlewares/isExisted.js";
import IsAdmin from "../middlewares/IsAdmin.js";

const router = express.Router();

router.get("/", GetAllPartners);
router.get("/:id", GetOnePartner);
router.post("/create", isExisted, IsAdmin, CreateNewPartner);
router.post("/changer/:id", CreatedAtChanger);
router.delete("/:id", isExisted, DeletePartner);
router.put("/:id", isExisted, UpdatePartner);
router.post("/:id/add-product", isExisted, IsAdmin, AddProductToPartner);
router.put("/:partnerId/products/:productId", isExisted, IsAdmin, EditProductInPartner);
router.post("/delete/:partnerId", isExisted, IsAdmin, DeleteProductFromPartner);


export default router;
