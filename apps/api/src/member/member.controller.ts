import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { MemberService } from "./member.service";
import { inviteMemberSchema, updateMemberSchema } from "@aguia/shared";
import type { AuthenticatedRequest } from "../auth/auth.guard";

@ApiTags("Members")
@ApiBearerAuth()
@Controller("orgs/:orgId/members")
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  @ApiOperation({ summary: "List organization members" })
  async list(@Param("orgId") orgId: string) {
    return this.memberService.listByOrg(orgId);
  }

  @Post("invite")
  @ApiOperation({ summary: "Invite a member to the organization" })
  async invite(@Param("orgId") orgId: string, @Body() body: unknown) {
    const parsed = inviteMemberSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.memberService.invite(orgId, parsed.data);
  }

  @Patch(":memberId")
  @ApiOperation({ summary: "Update member role" })
  async update(
    @Param("orgId") orgId: string,
    @Param("memberId") memberId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: unknown,
  ) {
    const parsed = updateMemberSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    const actorRole = req.member?.role ?? "VIEWER";
    return this.memberService.updateRole(orgId, memberId, parsed.data, actorRole);
  }

  @Delete(":memberId")
  @ApiOperation({ summary: "Remove a member from the organization" })
  async remove(
    @Param("orgId") orgId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.memberService.remove(orgId, memberId);
  }
}
