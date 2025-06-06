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

const OrderHistorySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled", "refunded"],
    default: "completed",
  },
  paymentMethod: {
    type: String,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
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
      default: 1,
    },
    dailyPromptsLimit: {
      type: Number,
      default: 1,
    },
    promptsResetDate: {
      type: Date,
      default: Date.now,
    },
    weeklyPromptsUsed: {
      type: Number,
      default: 0,
    },
    weeklyPromptsLimit: {
      type: Number,
      default: 4,
    },
    weeklyPromptsResetDate: {
      type: Date,
      default: Date.now,
    },
    chatHistory: {
      type: [ChatHistorySchema],
      default: [],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    orderHistory: {
      type: [OrderHistorySchema],
      default: [],
      validate: [orderArrayLimit, "{PATH} exceeds the limit of 50"],
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 10;
}

function orderArrayLimit(val) {
  return val.length <= 50;
}

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
