import { auth } from "@clerk/nextjs/server";
import PlanService from "../../../../lib/services/PlanService";

export async function GET(request) {
  try {
    // Get the authenticated user from Clerk within the request handler
    const { userId } = await auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // First, make sure default plans exist in the database
    await PlanService.seedDefaultPlans();

    // Fetch all plans from the database
    const plans = await PlanService.getAllPlans();

    return new Response(JSON.stringify({
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
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("❌ Error in plans API:", error.message);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}