import mongoose from "mongoose";

const PlanFeatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  included: {
    type: Boolean,
    default: false,
  },
});

const PlanSchema = new mongoose.Schema(
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

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);

export default Plan;
