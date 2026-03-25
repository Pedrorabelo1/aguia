import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateTaskInput, UpdateTaskInput } from "@aguia/shared";
import { Prisma } from "@aguia/db";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async listByOrg(
    orgId: string,
    filters: {
      status?: string;
      assigneeId?: string;
      priority?: string;
      labelId?: string;
      search?: string;
      cursor?: string;
      limit?: number;
    },
  ) {
    const take = filters.limit ?? 50;

    const where: Prisma.TaskWhereInput = {
      creator: { orgId },
      ...(filters.status && { status: filters.status as any }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.priority && { priority: filters.priority as any }),
      ...(filters.labelId && {
        labels: { some: { labelId: filters.labelId } },
      }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" as const } },
          { description: { contains: filters.search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        take: take + 1,
        ...(filters.cursor && { cursor: { id: filters.cursor }, skip: 1 }),
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        include: {
          assignee: { select: { id: true, displayName: true, avatarUrl: true } },
          labels: { include: { label: true } },
          _count: { select: { subtasks: true, comments: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    const hasMore = data.length > take;
    if (hasMore) data.pop();

    return {
      data,
      total,
      hasMore,
      cursor: hasMore ? data[data.length - 1]?.id : undefined,
    };
  }

  async create(orgId: string, data: CreateTaskInput, creatorId: string) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status as any,
        priority: data.priority as any,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assigneeId: data.assigneeId,
        parentId: data.parentId,
        creatorId,
        labels: data.labelIds
          ? {
              create: data.labelIds.map((labelId) => ({ labelId })),
            }
          : undefined,
      },
      include: {
        assignee: { select: { id: true, displayName: true, avatarUrl: true } },
        labels: { include: { label: true } },
      },
    });
  }

  async findById(orgId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        creator: { orgId },
      },
      include: {
        assignee: { select: { id: true, displayName: true, avatarUrl: true, email: true } },
        creator: { select: { id: true, displayName: true, avatarUrl: true } },
        labels: { include: { label: true } },
        subtasks: {
          include: {
            assignee: { select: { id: true, displayName: true, avatarUrl: true } },
          },
          orderBy: { order: "asc" },
        },
        comments: {
          include: {
            author: { select: { id: true, displayName: true, avatarUrl: true } },
            replies: {
              include: {
                author: { select: { id: true, displayName: true, avatarUrl: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          where: { parentId: null },
          orderBy: { createdAt: "asc" },
        },
        taskInstance: {
          include: {
            step: true,
            instance: { select: { id: true, name: true, status: true } },
          },
        },
        _count: { select: { subtasks: true, comments: true, attachments: true } },
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async update(orgId: string, taskId: string, data: UpdateTaskInput) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, creator: { orgId } },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const updateData: any = { ...data };
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }
    if (data.status === "DONE") {
      updateData.completedAt = new Date();
    }
    // Remove labelIds from direct update (handled separately)
    delete updateData.labelIds;

    return this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: { select: { id: true, displayName: true, avatarUrl: true } },
        labels: { include: { label: true } },
      },
    });
  }

  async remove(orgId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, creator: { orgId } },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return this.prisma.task.delete({ where: { id: taskId } });
  }

  async move(orgId: string, taskId: string, status: string, order: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, creator: { orgId } },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: status as any,
        order,
        ...(status === "DONE" ? { completedAt: new Date() } : {}),
      },
      include: {
        assignee: { select: { id: true, displayName: true, avatarUrl: true } },
        labels: { include: { label: true } },
      },
    });
  }

  async addLabel(orgId: string, taskId: string, labelId: string) {
    // Verify task belongs to org
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, creator: { orgId } },
    });
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    // Verify label belongs to org
    const label = await this.prisma.label.findFirst({
      where: { id: labelId, orgId },
    });
    if (!label) {
      throw new NotFoundException("Label not found in this organization");
    }

    return this.prisma.taskLabel.create({
      data: { taskId, labelId },
      include: { label: true },
    });
  }

  async removeLabel(orgId: string, taskId: string, labelId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, creator: { orgId } },
    });
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return this.prisma.taskLabel.delete({
      where: { taskId_labelId: { taskId, labelId } },
    });
  }
}
