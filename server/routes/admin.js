import express from "express";
import {
  AdminLogin,
  CreateNewAdmin,
  CreditBacker,
  CreditChanger,
  DeleteAdmin,
  GetAllAdmins,
  GetMe,
  GetOneAdmin,
  UpdateAdmin,
} from "../controllers/admin.js";
import isExisted from "../middlewares/isExisted.js";
import IsAdmin from "../middlewares/IsAdmin.js";

const router = express.Router();

router.get("/", isExisted, IsAdmin, GetAllAdmins);
router.get("/me", isExisted, GetMe);
router.get("/:id", isExisted, IsAdmin, GetOneAdmin);
router.post("/login", AdminLogin);
router.post("/create", isExisted, IsAdmin, CreateNewAdmin);
router.put("/:id", isExisted, IsAdmin, UpdateAdmin);
router.delete("/:id", isExisted, IsAdmin, DeleteAdmin);
router.post("/credit", isExisted, IsAdmin, CreditChanger);
router.post("/backer", isExisted, IsAdmin, CreditBacker)

export default router;
