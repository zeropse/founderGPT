import connectDB from "../mongodb";
import Plan from "../models/Plan";

export class PlanService {
  static async getAllPlans() {
    try {
      await connectDB();

      console.log("🔄 Fetching plans from database...");

      const plans = await Plan.find({ isActive: true }).sort({ sortOrder: 1 });

      console.log(`✅ Successfully fetched ${plans.length} plans`);

      return plans;
    } catch (error) {
      console.error("❌ Error fetching plans:", error.message);
      throw error;
    }
  }

  static async getPlanById(id) {
    try {
      await connectDB();
      const plan = await Plan.findOne({ id, isActive: true });

      if (!plan) {
        throw new Error(`Plan with id ${id} not found`);
      }

      return plan;
    } catch (error) {
      console.error(`❌ Error fetching plan with id ${id}:`, error.message);
      throw error;
    }
  }

  static async seedDefaultPlans() {
    try {
      await connectDB();

      const existingPlans = await Plan.countDocuments();

      if (existingPlans > 0) {
        console.log("ℹ️ Plans already exist in the database, skipping seed");
        return;
      }

      console.log("🔄 Seeding default plans...");

      const defaultPlans = [
        {
          id: "free",
          name: "Free Plan",
          label: "Free Plan - Limited Access",
          tagline: "Perfect for getting started",
          price: "$0",
          period: "forever",
          icon: "💸",
          sortOrder: 0,
          features: [
            { name: "1 prompt per day (max 4/week)", included: true },
            { name: "Basic idea enhancement", included: true },
            { name: "Market validation", included: false },
            { name: "MVP features", included: false },
            { name: "Tech stack", included: false },
            { name: "Monetization", included: false },
            { name: "Landing page", included: false },
            { name: "User personas", included: false },
            { name: "PDF export", included: false },
          ],
        },
        {
          id: "premium",
          name: "Premium Plan",
          label: "Premium Plan - Full Access",
          tagline: "Everything you need to succeed",
          price: "$5",
          period: "one-time",
          icon: "🌟",
          badge: "MOST POPULAR",
          sortOrder: 1,
          features: [
            { name: "3 prompts per day (max 10/week)", included: true },
            { name: "All Free Plan features", included: true },
            { name: "Advanced market validation", included: true },
            { name: "Detailed MVP features breakdown", included: true },
            { name: "Tech stack recommendations", included: true },
            { name: "Monetization strategies", included: true },
            { name: "Landing page guidance", included: true },
            { name: "User personas", included: true },
            { name: "PDF export", included: true },
          ],
        },
      ];

      await Plan.insertMany(defaultPlans);

      console.log("✅ Default plans seeded successfully");

      return defaultPlans;
    } catch (error) {
      console.error("❌ Error seeding default plans:", error.message);
      throw error;
    }
  }
}

export default PlanService;
