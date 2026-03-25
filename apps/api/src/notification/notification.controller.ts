import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import type { AuthenticatedRequest } from "../auth/auth.guard";

@ApiTags("Notifications")
@ApiBearerAuth()
@Controller("orgs/:orgId/notifications")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: "List notifications for current user" })
  @ApiQuery({ name: "cursor", required: false })
  @ApiQuery({ name: "limit", required: false })
  async list(
    @Req() req: AuthenticatedRequest,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ) {
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.notificationService.listByMember(
      memberId,
      cursor,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Mark a notification as read" })
  async markAsRead(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.notificationService.markAsRead(id, memberId);
  }

  @Post("read-all")
  @ApiOperation({ summary: "Mark all notifications as read" })
  async markAllAsRead(@Req() req: AuthenticatedRequest) {
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.notificationService.markAllAsRead(memberId);
  }
}
