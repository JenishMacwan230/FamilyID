import { Router } from "express";
import {
  createFamily,
  loginFamily,
  adminLogin,
  getFamilies,
  getFamilyByIdOrMobile,
  checkMobile,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from "../controllers/family.controller.js";

const router = Router();

router.get("/", getFamilies);
router.post("/", createFamily);
router.post("/login", loginFamily);
router.post("/admin-login", adminLogin);
router.post("/check-mobile", checkMobile);
router.get("/:query", getFamilyByIdOrMobile);

// Member management routes
router.post("/:familyId/members", addFamilyMember);
router.put("/:familyId/members/:memberId", updateFamilyMember);
router.delete("/:familyId/members/:memberId", deleteFamilyMember);

export default router;