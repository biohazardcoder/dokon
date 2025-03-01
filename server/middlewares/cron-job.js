import cron from "node-cron";
import Admin from "../models/admin";

cron.schedule("0 0 * * *", async () => {
  try {
    const admins = await Admin.find();
    for (let admin of admins) {
      admin.products = []; 
      await admin.save();
    }
    console.log("✅ Products har kuni yangilandi!");
  } catch (error) {
    console.error("❌ Products yangilanmadi:", error);
  }
});
