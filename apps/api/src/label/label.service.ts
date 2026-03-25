import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateLabelInput } from "@aguia/shared";

@Injectable()
export class LabelService {
  constructor(private prisma: PrismaService) {}

  async listByOrg(orgId: string) {
    return this.prisma.label.findMany({
      where: { orgId },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  async create(orgId: string, data: CreateLabelInput) {
    const existing = await this.prisma.label.findUnique({
      where: { name_orgId: { name: data.name, orgId } },
    });

    if (existing) {
      throw new ConflictException("A label with this name already exists");
    }

    return this.prisma.label.create({
      data: {
        ...data,
        orgId,
      },
    });
  }

  async update(orgId: string, labelId: string, data: Partial<CreateLabelInput>) {
    const label = await this.prisma.label.findFirst({
      where: { id: labelId, orgId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    if (data.name && data.name !== label.name) {
      const existing = await this.prisma.label.findUnique({
        where: { name_orgId: { name: data.name, orgId } },
      });
      if (existing) {
        throw new ConflictException("A label with this name already exists");
      }
    }

    return this.prisma.label.update({
      where: { id: labelId },
      data,
    });
  }

  async remove(orgId: string, labelId: string) {
    const label = await this.prisma.label.findFirst({
      where: { id: labelId, orgId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    return this.prisma.label.delete({ where: { id: labelId } });
  }
}
