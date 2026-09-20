import mongoose, { Document, Schema } from "mongoose";

export interface IFamilyMember {
  name: string;
  aadhaar: string;
  dob: string;
  relation: string;
  income: number;
  caste: string;
  religion: string;
  occupation: string;
  isGovtOfficial: boolean;
  isAbroad: boolean;
}

export interface IFamily extends Document {
  familyId: string;
  headMobile: string;
  address: string;
  district: string;
  caste: string;
  religion: string;
  members: IFamilyMember[];
  status: "Pending Verification" | "Verified" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IFamilyMember>({
  name: { type: String, required: true },
  aadhaar: { type: String, required: true },
  dob: { type: String, required: true },
  relation: { type: String, required: true },
  income: { type: Number, default: 0 },
  caste: { type: String, required: true },
  religion: { type: String, required: true },
  occupation: { type: String, default: "Private Sector Job" },
  isGovtOfficial: { type: Boolean, default: false },
  isAbroad: { type: Boolean, default: false },
});

const familySchema = new Schema<IFamily>(
  {
    familyId: {
      type: String,
      required: true,
      unique: true,
    },
    headMobile: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    caste: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    members: [memberSchema],
    status: {
      type: String,
      default: "Pending Verification",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound/index for member aadhaar
familySchema.index({ "members.aadhaar": 1 }, { unique: true, sparse: true });

const Family = mongoose.model<IFamily>("Family", familySchema);

export default Family;