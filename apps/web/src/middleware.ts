import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder");

// Only use Clerk middleware when keys are configured
let middleware: (req: NextRequest) => NextResponse | Promise<NextResponse>;

if (hasClerkKey) {
  // Dynamic import to avoid Clerk initialization errors
  const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server");

  const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/invite(.*)",
  ]);

  middleware = clerkMiddleware(async (auth: any, req: NextRequest) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  });
} else {
  middleware = () => NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
