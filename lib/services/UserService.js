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

      const weeklyResetNeeded = existingUser
        ? this._checkWeeklyPromptsReset(existingUser.weeklyPromptsResetDate)
        : true;

      const planId = existingUser ? existingUser.planId : "free";
      const dailyPromptsLimit = planId === "premium" ? 3 : 1;
      const weeklyPromptsLimit = planId === "premium" ? 10 : 4;
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

      const weeklyPromptsUsed = weeklyResetNeeded
        ? 0
        : existingUser
        ? existingUser.weeklyPromptsUsed
        : 0;

      const promptsResetDate = resetNeeded
        ? this._getNextMidnightUTC()
        : existingUser
        ? existingUser.promptsResetDate
        : this._getNextMidnightUTC();

      const weeklyPromptsResetDate = weeklyResetNeeded
        ? this._getNextWeekMidnightUTC()
        : existingUser
        ? existingUser.weeklyPromptsResetDate
        : this._getNextWeekMidnightUTC();

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
          planId: existingUser ? existingUser.planId : "free",
          promptsUsed,
          promptsRemaining,
          dailyPromptsLimit,
          weeklyPromptsLimit,
          weeklyPromptsUsed,
          promptsResetDate,
          weeklyPromptsResetDate,
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

      if (user) {
        let needsSave = false;

        if (this._checkPromptsReset(user.promptsResetDate)) {
          user.promptsUsed = 0;
          user.promptsRemaining = user.dailyPromptsLimit;
          user.promptsResetDate = this._getNextMidnightUTC();
          needsSave = true;
        }

        if (this._checkWeeklyPromptsReset(user.weeklyPromptsResetDate)) {
          user.weeklyPromptsUsed = 0;
          user.weeklyPromptsResetDate = this._getNextWeekMidnightUTC();
          needsSave = true;
        }

        if (needsSave) {
          await user.save();
        }
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
      const dailyPromptsLimit = isPremium ? 3 : 1;
      const weeklyPromptsLimit = isPremium ? 10 : 4;

      const currentUser = await User.findOne({ clerkId });
      if (!currentUser) throw new Error("User not found");

      let promptsRemaining;
      if (isPremium) {
        promptsRemaining = Math.max(
          currentUser.promptsRemaining,
          dailyPromptsLimit
        );
      } else {
        promptsRemaining = Math.min(
          currentUser.promptsRemaining,
          dailyPromptsLimit
        );
      }

      const user = await User.findOneAndUpdate(
        { clerkId },
        {
          planId,
          dailyPromptsLimit,
          weeklyPromptsLimit,
          promptsRemaining,
          promptsUsed: 0, // Reset daily prompts used to 0 when upgrading or cancelling
          weeklyPromptsUsed: 0, // Reset weekly prompts used to 0 when upgrading or cancelling
        },
        { new: true }
      );

      console.log(
        `🔄 Plan updated for user ${clerkId}: ${planId} (promptsUsed reset to 0)`
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

      // Check if weekly reset is needed first
      if (this._checkWeeklyPromptsReset(user.weeklyPromptsResetDate)) {
        user.weeklyPromptsUsed = 0;
        user.weeklyPromptsResetDate = this._getNextWeekMidnightUTC();
      }

      // Check if daily reset is needed
      if (this._checkPromptsReset(user.promptsResetDate)) {
        user.promptsUsed = 0;
        user.promptsRemaining = user.dailyPromptsLimit;
        user.promptsResetDate = this._getNextMidnightUTC();
      }

      // Check if user has exceeded weekly limit
      if (user.weeklyPromptsUsed >= user.weeklyPromptsLimit) {
        throw new Error("Weekly prompt limit exceeded");
      }

      // Check if user has exceeded daily limit
      if (user.promptsRemaining <= 0) {
        throw new Error("Daily prompt limit exceeded");
      }

      // Decrement both daily and weekly counts
      user.promptsUsed += 1;
      user.promptsRemaining = Math.max(user.promptsRemaining - 1, 0);
      user.weeklyPromptsUsed += 1;

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

  static _checkWeeklyPromptsReset(resetDate) {
    if (!resetDate) return true;
    const now = new Date();
    return now >= new Date(resetDate);
  }

  static _getNextWeekMidnightUTC() {
    const date = new Date();
    // Get next Monday at midnight UTC
    const daysUntilMonday = (7 - date.getUTCDay() + 1) % 7 || 7;
    date.setUTCDate(date.getUTCDate() + daysUntilMonday);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  static async getChatHistory(clerkId) {
    try {
      await connectDB();
      const user = await User.findOne({ clerkId });

      if (!user) throw new Error("User not found");

      return user.chatHistory || [];
    } catch (error) {
      console.error("❌ Error fetching chat history:", error.message);
      throw error;
    }
  }

  static async saveChatHistory(clerkId, idea, results) {
    try {
      await connectDB();
      const user = await User.findOne({ clerkId });

      if (!user) throw new Error("User not found");

      if (user.chatHistory && user.chatHistory.length >= 10) {
        throw new Error(
          "Maximum chat limit reached. Please delete some chats before creating new ones."
        );
      }

      const newChat = {
        id: this._generateUUID(),
        title: idea.slice(0, 50) + (idea.length > 50 ? "..." : ""),
        idea,
        results,
        timestamp: new Date(),
      };

      user.chatHistory.unshift(newChat);

      await user.save();

      return newChat;
    } catch (error) {
      console.error("❌ Error saving chat history:", error.message);
      throw error;
    }
  }

  static async getChatById(clerkId, chatId) {
    try {
      await connectDB();
      const user = await User.findOne({ clerkId });

      if (!user) throw new Error("User not found");

      const chat = user.chatHistory?.find((c) => c.id === chatId);

      if (!chat) throw new Error("Chat not found");

      return chat;
    } catch (error) {
      console.error("❌ Error fetching chat:", error.message);
      throw error;
    }
  }

  static async deleteChatHistory(clerkId, chatId) {
    try {
      await connectDB();
      const user = await User.findOne({ clerkId });

      if (!user) throw new Error("User not found");

      const chatIndex = user.chatHistory?.findIndex((c) => c.id === chatId);

      if (chatIndex === -1) throw new Error("Chat not found");

      user.chatHistory.splice(chatIndex, 1);
      await user.save();

      return true;
    } catch (error) {
      console.error("❌ Error deleting chat:", error.message);
      throw error;
    }
  }

  static _generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}

export default UserService;
