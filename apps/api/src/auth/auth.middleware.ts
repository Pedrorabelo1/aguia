import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Middleware for org-scoped routes.
 * Verifies the authenticated user is a member of the org
 * specified by :orgId in the URL and attaches member info to the request.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (!user?.clerkUserId) {
      throw new UnauthorizedException("User not authenticated");
    }

    const orgId = req.params.orgId;
    if (!orgId) {
      return next();
    }

    const member = await this.prisma.member.findUnique({
      where: {
        clerkUserId_orgId: {
          clerkUserId: user.clerkUserId,
          orgId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException("You are not a member of this organization");
    }

    if (!member.isActive) {
      throw new ForbiddenException("Your membership has been deactivated");
    }

    (req as any).member = {
      id: member.id,
      role: member.role,
      orgId: member.orgId,
    };

    next();
  }
}
