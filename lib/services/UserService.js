import connectDB from "../mongodb";
import User from "../models/User";

export class UserService {
  static async upsertUser(userData) {
    try {
      await connectDB();

      const {
        id: clerkId,
        firstName,
        lastName,
        fullName,
        email,
        imageUrl,
        hasImage,
      } = userData;

      console.log("🔄 Upserting user data for:", email);

      const existingUser = await User.findOne({ clerkId });

      const resetNeeded = existingUser
        ? this._checkPromptsReset(existingUser.promptsResetDate)
        : true;

      const planId = existingUser ? existingUser.planId : "free";
      const dailyPromptsLimit = planId === "premium" ? 5 : 2;
      const promptsRemaining = resetNeeded
        ? dailyPromptsLimit
        : existingUser
        ? existingUser.promptsRemaining
        : dailyPromptsLimit;

      const promptsUsed = resetNeeded
        ? 0
        : existingUser
        ? existingUser.promptsUsed
        : 0;

      const promptsResetDate = resetNeeded
        ? this._getNextMidnightUTC()
        : existingUser
        ? existingUser.promptsResetDate
        : this._getNextMidnightUTC();

      const user = await User.findOneAndUpdate(
        { clerkId },
        {
          firstName: firstName || "",
          lastName: lastName || "",
          fullName: fullName || "",
          email: email || "",
          imageUrl: imageUrl || "",
          hasImage: hasImage || false,
          lastActive: new Date(),
          // Preserve or set defaults for plan data
          planId: existingUser ? existingUser.planId : "free",
          promptsUsed,
          promptsRemaining,
          dailyPromptsLimit,
          promptsResetDate,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

      console.log("✅ User data stored successfully:", user.email);
      return user;
    } catch (error) {
      console.error("❌ Error storing user data:", error.message);
      throw error;
    }
  }

  static async getUserByClerkId(clerkId) {
    try {
      await connectDB();
      const user = await User.findOne({ clerkId });

      if (user && this._checkPromptsReset(user.promptsResetDate)) {
        user.promptsUsed = 0;
        user.promptsRemaining = user.dailyPromptsLimit;
        user.promptsResetDate = this._getNextMidnightUTC();
        await user.save();
      }

      return user;
    } catch (error) {
      console.error("❌ Error fetching user:", error.message);
      throw error;
    }
  }

  static async updateLastActive(clerkId) {
    try {
      await connectDB();
      await User.findOneAndUpdate({ clerkId }, { lastActive: new Date() });
    } catch (error) {
      console.error("❌ Error updating last active:", error.message);
    }
  }

  static async updatePlanStatus(clerkId, isPremium) {
    try {
      await connectDB();
      const planId = isPremium ? "premium" : "free";
      const dailyPromptsLimit = isPremium ? 5 : 2;

      const user = await User.findOneAndUpdate(
        { clerkId },
        {
          planId,
          dailyPromptsLimit,
          promptsRemaining: Math.max(dailyPromptsLimit, 0),
        },
        { new: true }
      );

      return user;
    } catch (error) {
      console.error("❌ Error updating plan status:", error.message);
      throw error;
    }
  }

  static async decrementPromptsRemaining(clerkId) {
    try {
      await connectDB();

      const user = await User.findOne({ clerkId });
      if (!user) throw new Error("User not found");

      if (this._checkPromptsReset(user.promptsResetDate)) {
        user.promptsUsed = 1; // This counts as the first usage
        user.promptsRemaining = user.dailyPromptsLimit - 1;
        user.promptsResetDate = this._getNextMidnightUTC();
      } else {
        user.promptsUsed += 1;
        user.promptsRemaining = Math.max(user.promptsRemaining - 1, 0);
      }

      await user.save();
      return user;
    } catch (error) {
      console.error("❌ Error decrementing prompts:", error.message);
      throw error;
    }
  }

  static _checkPromptsReset(resetDate) {
    if (!resetDate) return true;
    const now = new Date();
    return now >= new Date(resetDate);
  }

  static _getNextMidnightUTC() {
    const date = new Date();
    date.setUTCHours(24, 0, 0, 0);
    return date;
  }
}

export default UserService;
