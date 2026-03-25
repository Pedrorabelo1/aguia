import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export interface AuthenticatedRequest extends Request {
  user: {
    clerkUserId: string;
  };
  member?: {
    id: string;
    role: string;
    orgId: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException("Missing token");
    }

    // TODO: Validate JWT with Clerk when configured
    // For now, extract clerkUserId from token payload (placeholder)
    // In production, use Clerk SDK to verify:
    //   const payload = await clerkClient.verifyToken(token);
    //   request.user = { clerkUserId: payload.sub };

    try {
      // Placeholder: decode JWT payload without verification
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64url").toString("utf-8"),
        );
        request.user = { clerkUserId: payload.sub };
      } else {
        // Allow plain clerkUserId as token for development
        request.user = { clerkUserId: token };
      }
    } catch {
      throw new UnauthorizedException("Invalid token");
    }

    if (!request.user?.clerkUserId) {
      throw new UnauthorizedException("Could not extract user from token");
    }

    return true;
  }
}
