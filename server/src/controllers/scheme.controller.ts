import { Request, Response } from "express";
import SchemeApplication from "../models/schemeApplication.model.js";
import Family from "../models/family.model.js";

// Check Eligibility Endpoint
export const checkEligibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schemeId, income, caste, marks, landArea, age, occupation, casteCertificateUploaded } = req.body;

    const numericIncome = Number(income) || 0;
    const numericMarks = Number(marks) || 0;
    const numericAge = Number(age) || 0;
    const numericLand = Number(landArea) || 0;

    let isEligible = true;
    let reasons: string[] = [];
    let criteria: { label: string; passed: boolean }[] = [];

    // Caste Certificate Requirement Check for reserved categories (OBC, SC, ST, SEBC/OBC, EWS)
    const isReservedCategory = caste && ["OBC", "SEBC / OBC", "SC", "ST", "EWS"].includes(caste);
    if (isReservedCategory) {
      const casteCertPass = Boolean(casteCertificateUploaded && String(casteCertificateUploaded).trim().length > 0);
      criteria.push({ label: `Official Caste Certificate Proof (${caste}) Uploaded`, passed: casteCertPass });
      if (!casteCertPass) {
        isEligible = false;
        reasons.push(`Official Caste Certificate proof document is required for category ${caste}. Please upload your Caste Certificate.`);
      }
    }

    switch (schemeId) {
      case "ma-yojana":
        // Family Income < 4,00,000
        const maIncomePass = numericIncome <= 400000;
        criteria.push({ label: "Total Family Household Income Below ₹4,00,000 / yr", passed: maIncomePass });
        if (!maIncomePass) {
          isEligible = false;
          reasons.push("Total family household income exceeds ₹4,00,000 limit for MA Yojana.");
        }
        break;

      case "mysy-scholarship":
        // Occupation must be Student
        const isStudent = occupation === "Student";
        criteria.push({ label: "Applicant Work Status is 'Student'", passed: isStudent });
        if (!isStudent) {
          isEligible = false;
          reasons.push(`MYSY Higher Education Scholarship is strictly restricted to Students. Selected member's occupation is '${occupation || "Non-Student"}'.`);
        }

        // Marks > 80%, Family Income < 6,00,000
        const mysyIncomePass = numericIncome <= 600000;
        const mysyMarksPass = numericMarks >= 80;
        criteria.push({ label: "Total Family Household Income Below ₹6,00,000 / yr", passed: mysyIncomePass });
        criteria.push({ label: "Class 10th/12th Marks ≥ 80%", passed: mysyMarksPass });
        if (!mysyIncomePass) {
          isEligible = false;
          reasons.push("Total family household income exceeds ₹6,00,000 limit for MYSY scholarship.");
        }
        if (!mysyMarksPass) {
          isEligible = false;
          reasons.push("Academic marks are below 80% cutoff requirement.");
        }
        break;

      case "krishi-sahay":
        // Occupation must be Farmer / Agriculture
        const isFarmer = occupation === "Farmer / Agriculture";
        criteria.push({ label: "Applicant Work Status is 'Farmer / Agriculture'", passed: isFarmer });
        if (!isFarmer) {
          isEligible = false;
          reasons.push(`Gujarat Krishi Sahay Yojana is strictly restricted to Farmers. Selected member's occupation is '${occupation || "Non-Farmer"}'.`);
        }

        // Land area > 0 acres
        const krishiLandPass = numericLand > 0;
        criteria.push({ label: "Owns Agricultural Land Record (7/12 & 8A)", passed: krishiLandPass });
        if (!krishiLandPass) {
          isEligible = false;
          reasons.push("Valid agricultural land record proof is required.");
        }
        break;

      case "pmay-housing":
        // Family Income < 3,00,000 or EWS/LIG
        const pmayIncomePass = numericIncome <= 300000 || caste === "EWS";
        criteria.push({ label: "Total Family Income Below ₹3,00,000 / yr or EWS Category", passed: pmayIncomePass });
        if (!pmayIncomePass) {
          isEligible = false;
          reasons.push("Total family household income exceeds PMAY EWS/LIG ceiling.");
        }
        break;

      case "vayo-vandana":
        // Age >= 60
        const agePass = numericAge >= 60;
        criteria.push({ label: "Senior Citizen Age ≥ 60 Years", passed: agePass });
        if (!agePass) {
          isEligible = false;
          reasons.push("Applicant must be a senior citizen aged 60 years or older.");
        }
        break;

      default:
        criteria.push({ label: "General Gujarat Resident Verification", passed: true });
        break;
    }

    res.status(200).json({
      isEligible,
      reasons,
      criteria,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to evaluate scheme eligibility" });
  }
};

// Apply for a scheme (Single Benefit Per Member Rule Enforced)
export const applyScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      familyId,
      applicantName,
      applicantAadhaar,
      schemeId,
      schemeTitle,
      category,
      income,
      caste,
      documentUploaded,
      casteCertificateUploaded,
      uploadedDocuments,
      verificationSlot,
    } = req.body;

    if (!familyId || !applicantName || !applicantAadhaar || !schemeId || !schemeTitle) {
      res.status(400).json({ message: "Please provide family ID, member name, Aadhaar, and scheme details." });
      return;
    }

    const cleanAadhaar = String(applicantAadhaar).trim();

    // Check Single Benefit Per Member Rule
    const existingApp = await SchemeApplication.findOne({
      applicantAadhaar: cleanAadhaar,
      schemeId,
    });

    if (existingApp) {
      res.status(400).json({
        message: `Member ${applicantName} (Aadhaar: ${cleanAadhaar}) has already applied/claimed benefits for ${schemeTitle} (Ref: ${existingApp.applicationNo}). Under Gujarat DBT policy, duplicate benefit claims per member are prohibited.`,
        applicationNo: existingApp.applicationNo,
      });
      return;
    }

    const applicationNo = `SCH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApp = new SchemeApplication({
      applicationNo,
      familyId,
      applicantName,
      applicantAadhaar: cleanAadhaar,
      schemeId,
      schemeTitle,
      category: category || "General",
      income: Number(income) || 0,
      caste: caste || "General",
      documentUploaded: documentUploaded || "Verified_Proof.pdf",
      casteCertificateUploaded: casteCertificateUploaded || "",
      uploadedDocuments: Array.isArray(uploadedDocuments) ? uploadedDocuments : [],
      verificationSlot: verificationSlot || "Sep 22, 2026 • 10:00 AM - 12:00 PM (Jan Seva Kendra)",
      status: "Submitted",
    });

    await newApp.save();

    res.status(201).json({
      message: `Scheme application submitted successfully for ${applicantName}! Scheduled for physical verification.`,
      application: newApp,
    });
  } catch (error: any) {
    console.error("Error submitting scheme application:", error);
    res.status(500).json({
      message: error.message || "Failed to submit scheme application",
    });
  }
};

// Update / Reschedule Verification Slot for an application
export const updateVerificationSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationNo } = req.params;
    const { verificationSlot } = req.body;

    if (!verificationSlot) {
      res.status(400).json({ message: "Verification slot selection is required." });
      return;
    }

    const application = await SchemeApplication.findOne({ applicationNo });
    if (!application) {
      res.status(404).json({ message: "Application record not found." });
      return;
    }

    application.verificationSlot = verificationSlot;
    await application.save();

    res.status(200).json({
      message: `Verification appointment window rescheduled to ${verificationSlot}`,
      application,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update verification slot" });
  }
};

// Get all applications for a family
export const getFamilySchemeApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { familyId } = req.params;
    const applications = await SchemeApplication.find({ familyId }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch scheme applications" });
  }
};

// Get all applications (Scheme Applications & Family Card Registration Requests) for Government Official Portal
export const getAllApplicationsForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const schemeApps = await SchemeApplication.find().sort({ createdAt: -1 });
    const families = await Family.find().sort({ createdAt: -1 });

    const enrichedSchemeApps = await Promise.all(
      schemeApps.map(async (app: any) => {
        const family = await Family.findOne({ familyId: app.familyId });
        return {
          _id: app._id,
          type: "SCHEME",
          applicationNo: app.applicationNo,
          familyId: app.familyId,
          applicantName: app.applicantName,
          applicantAadhaar: app.applicantAadhaar,
          schemeId: app.schemeId,
          schemeTitle: app.schemeTitle,
          category: app.category,
          income: app.income,
          caste: app.caste,
          documentUploaded: app.documentUploaded || "Verified_Proof.pdf",
          casteCertificateUploaded: app.casteCertificateUploaded || "",
          uploadedDocuments: app.uploadedDocuments || [],
          verificationSlot: app.verificationSlot || "Sep 22, 2026 • 10:00 AM",
          status: app.status,
          createdAt: app.createdAt,
          familyDetails: family
            ? {
                address: family.address,
                district: family.district,
                caste: family.caste,
                religion: family.religion,
                headMobile: family.headMobile,
                totalMembers: family.members?.length || 0,
                members: family.members,
              }
            : null,
        };
      })
    );

    const familyApps = families.map((fam: any) => {
      const head = fam.members.find((m: any) => m.relation === "Head of Family") || fam.members[0];
      const famStatusMapped =
        fam.status === "Pending Verification" ? "Submitted" : fam.status === "Verified" ? "Approved" : fam.status;

      return {
        _id: fam._id,
        type: "FAMILY_CARD",
        applicationNo: fam.familyId,
        familyId: fam.familyId,
        applicantName: head?.name || "Head of Family",
        applicantAadhaar: head?.aadhaar || "",
        schemeId: "family-id-registration",
        schemeTitle: "New Family ID Card Registration & Verification",
        category: fam.caste || "General",
        income: fam.members.reduce((sum: number, m: any) => sum + (Number(m.income) || 0), 0),
        caste: fam.caste,
        documentUploaded: "Ration_Card_Family_Proof.pdf",
        casteCertificateUploaded: fam.caste !== "General" ? `${fam.caste}_Certificate.pdf` : "",
        verificationSlot: "Physical Verification Window at Jan Seva Kendra",
        status: famStatusMapped,
        createdAt: fam.createdAt,
        familyDetails: {
          address: fam.address,
          district: fam.district,
          caste: fam.caste,
          religion: fam.religion,
          headMobile: fam.headMobile,
          totalMembers: fam.members?.length || 0,
          members: fam.members,
        },
      };
    });

    const allApplications = [...enrichedSchemeApps, ...familyApps].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(allApplications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications for admin review" });
  }
};

// Update Application Status by Government Officer
export const updateApplicationStatusByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationNo } = req.params;
    const { status } = req.body;

    if (!status || !["Submitted", "Under Review", "Approved", "Rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid application status value." });
      return;
    }

    // Check if it's a Scheme Application
    const application = await SchemeApplication.findOne({ applicationNo });
    if (application) {
      application.status = status as any;
      await application.save();
      res.status(200).json({
        message: `Scheme Application ${applicationNo} status updated to '${status}'.`,
        application,
      });
      return;
    }

    // Check if it's a Family Card Application (starts with GJ-)
    const familyStatusMapped =
      status === "Approved" ? "Verified" : status === "Submitted" ? "Pending Verification" : status;
    const family = await Family.findOne({ familyId: applicationNo });
    if (family) {
      family.status = familyStatusMapped as any;
      await family.save();
      res.status(200).json({
        message: `Family ID Card ${applicationNo} status updated to '${familyStatusMapped}'.`,
        family,
      });
      return;
    }

    res.status(404).json({ message: "Application record not found." });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update application status" });
  }
};

// Delete Application by Government Officer
export const deleteApplicationByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationNo } = req.params;

    // Try deleting scheme application
    const schemeApp = await SchemeApplication.findOneAndDelete({ applicationNo });
    if (schemeApp) {
      res.status(200).json({
        message: `Scheme Application ${applicationNo} has been deleted successfully from MongoDB.`,
      });
      return;
    }

    // Try deleting family application
    const familyApp = await Family.findOneAndDelete({ familyId: applicationNo });
    if (familyApp) {
      res.status(200).json({
        message: `Family ID Card Application ${applicationNo} has been deleted successfully from MongoDB.`,
      });
      return;
    }

    res.status(404).json({ message: "Application record not found." });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete application" });
  }
};

