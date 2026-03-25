import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async listByMember(memberId: string, cursor?: string, limit = 20) {
    const data = await this.prisma.notification.findMany({
      where: { memberId },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: "desc" },
    });

    const hasMore = data.length > limit;
    if (hasMore) data.pop();

    const unreadCount = await this.prisma.notification.count({
      where: { memberId, isRead: false },
    });

    return {
      data,
      hasMore,
      unreadCount,
      cursor: hasMore ? data[data.length - 1]?.id : undefined,
    };
  }

  async markAsRead(notificationId: string, memberId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, memberId },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(memberId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { memberId, isRead: false },
      data: { isRead: true },
    });

    return { count: result.count };
  }

  async create(data: {
    type: string;
    title: string;
    body?: string;
    link?: string;
    memberId: string;
  }) {
    return this.prisma.notification.create({ data });
  }
}
