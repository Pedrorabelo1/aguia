import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateCommentInput } from "@aguia/shared";

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async listByTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId, parentId: null },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
        replies: {
          include: {
            author: { select: { id: true, displayName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async create(data: CreateCommentInput, authorId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (data.parentId) {
      const parent = await this.prisma.comment.findFirst({
        where: { id: data.parentId, taskId: data.taskId },
      });
      if (!parent) {
        throw new NotFoundException("Parent comment not found");
      }
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        parentId: data.parentId,
        authorId,
      },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });
  }

  async update(commentId: string, content: string, memberId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.authorId !== memberId) {
      throw new ForbiddenException("You can only edit your own comments");
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });
  }

  async remove(commentId: string, memberId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.authorId !== memberId) {
      throw new ForbiddenException("You can only delete your own comments");
    }

    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
