import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type {
  CreateProcessInput,
  UpdateProcessInput,
  CreateProcessStepInput,
} from "@aguia/shared";

@Injectable()
export class ProcessService {
  constructor(private prisma: PrismaService) {}

  async listByOrg(orgId: string) {
    return this.prisma.processTemplate.findMany({
      where: { orgId },
      include: {
        department: { select: { id: true, name: true, color: true } },
        _count: { select: { steps: true, instances: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async create(orgId: string, data: CreateProcessInput) {
    return this.prisma.processTemplate.create({
      data: {
        ...data,
        orgId,
      },
      include: {
        steps: true,
      },
    });
  }

  async findById(orgId: string, processId: string) {
    const process = await this.prisma.processTemplate.findFirst({
      where: { id: processId, orgId },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            dependsOn: { include: { requiredStep: true } },
          },
        },
        department: true,
        _count: { select: { instances: true } },
      },
    });

    if (!process) {
      throw new NotFoundException("Process not found");
    }

    return process;
  }

  async update(orgId: string, processId: string, data: UpdateProcessInput) {
    const process = await this.prisma.processTemplate.findFirst({
      where: { id: processId, orgId },
    });

    if (!process) {
      throw new NotFoundException("Process not found");
    }

    return this.prisma.processTemplate.update({
      where: { id: processId },
      data,
      include: { steps: { orderBy: { order: "asc" } } },
    });
  }

  async remove(orgId: string, processId: string) {
    const process = await this.prisma.processTemplate.findFirst({
      where: { id: processId, orgId },
      include: { _count: { select: { instances: true } } },
    });

    if (!process) {
      throw new NotFoundException("Process not found");
    }

    return this.prisma.processTemplate.delete({
      where: { id: processId },
    });
  }

  async addStep(orgId: string, processId: string, data: CreateProcessStepInput) {
    const process = await this.prisma.processTemplate.findFirst({
      where: { id: processId, orgId },
    });

    if (!process) {
      throw new NotFoundException("Process not found");
    }

    return this.prisma.processStep.create({
      data: {
        ...data,
        processId,
      },
    });
  }

  async activate(orgId: string, processId: string, name: string, memberId: string) {
    const process = await this.prisma.processTemplate.findFirst({
      where: { id: processId, orgId },
      include: {
        steps: { orderBy: { order: "asc" } },
      },
    });

    if (!process) {
      throw new NotFoundException("Process not found");
    }

    if (process.steps.length === 0) {
      throw new BadRequestException("Cannot activate a process with no steps");
    }

    // Create instance with task instances in a transaction
    return this.prisma.$transaction(async (tx) => {
      const instance = await tx.processInstance.create({
        data: {
          templateId: processId,
          orgId,
          name: name || process.name,
          status: "ACTIVE",
        },
      });

      // Create task instances for each step
      const taskInstances = await Promise.all(
        process.steps.map((step) =>
          tx.taskInstance.create({
            data: {
              stepId: step.id,
              instanceId: instance.id,
              title: step.name,
              description: step.description,
              status: "TODO",
              order: step.order,
              dueDate: step.daysFromStart
                ? new Date(Date.now() + step.daysFromStart * 86400000)
                : undefined,
            },
          }),
        ),
      );

      // Create corresponding Task records linked to each TaskInstance
      await Promise.all(
        taskInstances.map((ti) =>
          tx.task.create({
            data: {
              taskInstanceId: ti.id,
              title: ti.title,
              description: ti.description,
              status: ti.status,
              priority: ti.priority,
              dueDate: ti.dueDate,
              order: ti.order,
              creatorId: memberId,
            },
          }),
        ),
      );

      return tx.processInstance.findUnique({
        where: { id: instance.id },
        include: {
          taskInstances: { include: { task: true } },
          template: true,
        },
      });
    });
  }
}
