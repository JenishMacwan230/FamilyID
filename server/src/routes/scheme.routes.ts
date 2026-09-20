import { Router } from "express";
import {
  checkEligibility,
  applyScheme,
  getFamilySchemeApplications,
  updateVerificationSlot,
  getAllApplicationsForAdmin,
  updateApplicationStatusByAdmin,
  deleteApplicationByAdmin,
} from "../controllers/scheme.controller.js";

const router = Router();

router.post("/check-eligibility", checkEligibility);
router.post("/apply", applyScheme);
router.get("/family/:familyId", getFamilySchemeApplications);
router.put("/application/:applicationNo/slot", updateVerificationSlot);

// Admin / Government Official routes
router.get("/admin/all-applications", getAllApplicationsForAdmin);
router.put("/admin/application/:applicationNo/status", updateApplicationStatusByAdmin);
router.delete("/admin/application/:applicationNo", deleteApplicationByAdmin);

export default router;
