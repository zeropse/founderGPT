import { auth } from "@clerk/nextjs/server";
import PlanService from "@/lib/services/PlanService";

// This tells Next.js to always run this route dynamically, not statically optimize it.
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Get the authenticated user from Clerk within the request handler
    // auth() correctly uses headers internally, which are only available dynamically.
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, make sure default plans exist in the database
    await PlanService.seedDefaultPlans();

    // Fetch all plans from the database
    const plans = await PlanService.getAllPlans();

    return Response.json(
      {
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
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("❌ Error in plans API:", error.message);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}