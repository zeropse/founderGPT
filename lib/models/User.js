import mongoose from "mongoose";

const ChatHistorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  idea: {
    type: String,
    required: true,
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    hasImage: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    planId: {
      type: String,
      default: "free",
    },
    promptsUsed: {
      type: Number,
      default: 0,
    },
    promptsRemaining: {
      type: Number,
      default: 2,
    },
    dailyPromptsLimit: {
      type: Number,
      default: 2,
    },
    promptsResetDate: {
      type: Date,
      default: Date.now,
    },
    chatHistory: {
      type: [ChatHistorySchema],
      default: [],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 10;
}

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
