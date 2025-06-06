import { auth } from "@clerk/nextjs/server";
import PlanService from "../../../../lib/services/PlanService";

export async function GET() {
  try {
    // Get the authenticated user from Clerk - moved inside the request handler
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, make sure default plans exist in the database
    await PlanService.seedDefaultPlans();

    // Fetch all plans from the database
    const plans = await PlanService.getAllPlans();

    return Response.json({
      success: true,
      plans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        label: plan.label,
        tagline: plan.tagline,
        price: plan.price,
        period: plan.period,
        icon: plan.icon,
        badge: plan.badge,
        features: plan.features,
      })),
    });
  } catch (error) {
    console.error("❌ Error in plans API:", error.message);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}