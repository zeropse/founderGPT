import mongoose, { Document, Schema } from "mongoose";
import { PlanFeature } from "@/types";

interface PlanFeatureDocument extends Document {
  name: string;
  included: boolean;
}

export interface PlanDocument extends Document {
  id: string;
  name: string;
  label: string;
  tagline: string;
  price: string;
  period: string;
  icon: string;
  badge?: string;
  features: PlanFeatureDocument[];
  isActive: boolean;
  sortOrder: number;
}

const PlanFeatureSchema = new Schema<PlanFeatureDocument>({
  name: {
    type: String,
    required: true,
  },
  included: {
    type: Boolean,
    default: false,
  },
});

const PlanSchema = new Schema<PlanDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: null,
    },
    features: [PlanFeatureSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "plans",
  }
);

const Plan = mongoose.models.Plan || mongoose.model<PlanDocument>("Plan", PlanSchema);

export default Plan;