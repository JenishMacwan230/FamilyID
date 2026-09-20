import mongoose, { Document, Schema } from "mongoose";

export interface IUploadedDocument {
  title: string;
  filename: string;
  category: string;
}

export interface ISchemeApplication extends Document {
  applicationNo: string;
  familyId: string;
  applicantName: string;
  applicantAadhaar: string;
  schemeId: string;
  schemeTitle: string;
  category: string;
  income: number;
  caste: string;
  documentUploaded?: string;
  casteCertificateUploaded?: string;
  uploadedDocuments?: IUploadedDocument[];
  verificationSlot?: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const schemeApplicationSchema = new Schema<ISchemeApplication>(
  {
    applicationNo: {
      type: String,
      required: true,
      unique: true,
    },
    familyId: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantAadhaar: {
      type: String,
      required: true,
    },
    schemeId: {
      type: String,
      required: true,
    },
    schemeTitle: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    income: {
      type: Number,
      default: 0,
    },
    caste: {
      type: String,
      required: true,
    },
    documentUploaded: {
      type: String,
      default: "Verified_Proof.pdf",
    },
    casteCertificateUploaded: {
      type: String,
      default: "",
    },
    uploadedDocuments: [
      {
        title: { type: String },
        filename: { type: String },
        category: { type: String },
      },
    ],
    verificationSlot: {
      type: String,
      default: "Sep 22, 2026 • 10:00 AM - 12:00 PM (Jan Seva Kendra)",
    },
    status: {
      type: String,
      default: "Submitted",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index enforcing 1 benefit per member for 1 scheme
schemeApplicationSchema.index(
  { applicantAadhaar: 1, schemeId: 1 },
  { unique: true }
);

const SchemeApplication = mongoose.model<ISchemeApplication>(
  "SchemeApplication",
  schemeApplicationSchema
);

export default SchemeApplication;
