import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { OrgService } from "./org.service";
import { createOrgSchema, updateOrgThemeSchema } from "@aguia/shared";
import type { AuthenticatedRequest } from "../auth/auth.guard";

@ApiTags("Organizations")
@ApiBearerAuth()
@Controller("orgs")
export class OrgController {
  constructor(private orgService: OrgService) {}

  @Get()
  @ApiOperation({ summary: "List current user organizations" })
  async list(@Req() req: AuthenticatedRequest) {
    return this.orgService.listByUser(req.user.clerkUserId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new organization" })
  async create(@Req() req: AuthenticatedRequest, @Body() body: unknown) {
    const parsed = createOrgSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    // TODO: Get email/displayName from Clerk user profile
    return this.orgService.create(
      parsed.data,
      req.user.clerkUserId,
      "user@example.com",
      "User",
    );
  }

  @Get(":orgId")
  @ApiOperation({ summary: "Get organization details" })
  async findOne(@Param("orgId") orgId: string) {
    return this.orgService.findById(orgId);
  }

  @Patch(":orgId")
  @ApiOperation({ summary: "Update organization" })
  async update(@Param("orgId") orgId: string, @Body() body: unknown) {
    const parsed = createOrgSchema.partial().safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.orgService.update(orgId, parsed.data);
  }

  @Patch(":orgId/theme")
  @ApiOperation({ summary: "Update organization theme" })
  async updateTheme(@Param("orgId") orgId: string, @Body() body: unknown) {
    const parsed = updateOrgThemeSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.orgService.updateTheme(orgId, parsed.data);
  }
}
