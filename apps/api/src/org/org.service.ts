import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateOrgInput, UpdateOrgThemeInput } from "@aguia/shared";

@Injectable()
export class OrgService {
  constructor(private prisma: PrismaService) {}

  async listByUser(clerkUserId: string) {
    const members = await this.prisma.member.findMany({
      where: { clerkUserId, isActive: true },
      include: {
        org: true,
      },
      orderBy: { org: { name: "asc" } },
    });

    return members.map((m) => ({
      ...m.org,
      role: m.role,
      memberId: m.id,
    }));
  }

  async create(data: CreateOrgInput, clerkUserId: string, email: string, displayName: string) {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictException("An organization with this slug already exists");
    }

    return this.prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        members: {
          create: {
            clerkUserId,
            email,
            displayName,
            role: "OWNER",
          },
        },
      },
      include: { members: true },
    });
  }

  async findById(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        _count: {
          select: {
            members: true,
            processes: true,
            labels: true,
            departments: true,
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException("Organization not found");
    }

    return org;
  }

  async update(orgId: string, data: Partial<CreateOrgInput>) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      throw new NotFoundException("Organization not found");
    }

    if (data.slug && data.slug !== org.slug) {
      const slugTaken = await this.prisma.organization.findUnique({
        where: { slug: data.slug },
      });
      if (slugTaken) {
        throw new ConflictException("Slug already taken");
      }
    }

    return this.prisma.organization.update({
      where: { id: orgId },
      data,
    });
  }

  async updateTheme(orgId: string, data: UpdateOrgThemeInput) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      throw new NotFoundException("Organization not found");
    }

    return this.prisma.organization.update({
      where: { id: orgId },
      data,
    });
  }
}
