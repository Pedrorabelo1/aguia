import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { InviteMemberInput, UpdateMemberInput } from "@aguia/shared";

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async listByOrg(orgId: string) {
    return this.prisma.member.findMany({
      where: { orgId },
      orderBy: [{ role: "asc" }, { displayName: "asc" }],
      include: {
        departmentMembers: {
          include: { department: true },
        },
      },
    });
  }

  async invite(orgId: string, data: InviteMemberInput) {
    const existingMember = await this.prisma.member.findFirst({
      where: { email: data.email, orgId },
    });

    if (existingMember) {
      throw new ConflictException("User is already a member of this organization");
    }

    const existingInvite = await this.prisma.invite.findUnique({
      where: { email_orgId: { email: data.email, orgId } },
    });

    if (existingInvite && !existingInvite.usedAt && existingInvite.expiresAt > new Date()) {
      throw new ConflictException("An active invite already exists for this email");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.invite.upsert({
      where: { email_orgId: { email: data.email, orgId } },
      update: {
        role: data.role,
        expiresAt,
        usedAt: null,
      },
      create: {
        email: data.email,
        role: data.role,
        orgId,
        expiresAt,
      },
    });
  }

  async updateRole(orgId: string, memberId: string, data: UpdateMemberInput, actorRole: string) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, orgId },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    if (member.role === "OWNER" && data.role && data.role !== "OWNER") {
      throw new ForbiddenException("Cannot change the owner's role");
    }

    if (data.role === "OWNER" && actorRole !== "OWNER") {
      throw new ForbiddenException("Only the owner can transfer ownership");
    }

    return this.prisma.member.update({
      where: { id: memberId },
      data,
    });
  }

  async remove(orgId: string, memberId: string) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, orgId },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    if (member.role === "OWNER") {
      throw new ForbiddenException("Cannot remove the organization owner");
    }

    return this.prisma.member.delete({
      where: { id: memberId },
    });
  }
}
