import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "@aguia/shared";

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async listByOrg(orgId: string) {
    return this.prisma.department.findMany({
      where: { orgId },
      include: {
        members: {
          include: {
            member: { select: { id: true, displayName: true, avatarUrl: true } },
          },
        },
        _count: { select: { processes: true, members: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  async create(orgId: string, data: CreateDepartmentInput) {
    return this.prisma.department.create({
      data: {
        ...data,
        orgId,
      },
      include: {
        _count: { select: { processes: true, members: true } },
      },
    });
  }

  async findById(orgId: string, departmentId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, orgId },
      include: {
        members: {
          include: {
            member: {
              select: { id: true, displayName: true, avatarUrl: true, email: true, role: true },
            },
          },
        },
        processes: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    return department;
  }

  async update(orgId: string, departmentId: string, data: UpdateDepartmentInput) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, orgId },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    return this.prisma.department.update({
      where: { id: departmentId },
      data,
    });
  }

  async remove(orgId: string, departmentId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, orgId },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    return this.prisma.department.delete({ where: { id: departmentId } });
  }

  async addMember(orgId: string, departmentId: string, memberId: string, isHead = false) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, orgId },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    const member = await this.prisma.member.findFirst({
      where: { id: memberId, orgId },
    });

    if (!member) {
      throw new NotFoundException("Member not found in this organization");
    }

    const existing = await this.prisma.departmentMember.findUnique({
      where: { departmentId_memberId: { departmentId, memberId } },
    });

    if (existing) {
      throw new ConflictException("Member already in this department");
    }

    return this.prisma.departmentMember.create({
      data: { departmentId, memberId, isHead },
      include: {
        member: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });
  }

  async removeMember(orgId: string, departmentId: string, memberId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, orgId },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    const deptMember = await this.prisma.departmentMember.findUnique({
      where: { departmentId_memberId: { departmentId, memberId } },
    });

    if (!deptMember) {
      throw new NotFoundException("Member not found in this department");
    }

    return this.prisma.departmentMember.delete({
      where: { departmentId_memberId: { departmentId, memberId } },
    });
  }
}
