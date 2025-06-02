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
}

export default UserService;
