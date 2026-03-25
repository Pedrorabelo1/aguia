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
import { CommentService } from "./comment.service";
import { createCommentSchema } from "@aguia/shared";
import type { AuthenticatedRequest } from "../auth/auth.guard";

@ApiTags("Comments")
@ApiBearerAuth()
@Controller("orgs/:orgId/comments")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get("task/:taskId")
  @ApiOperation({ summary: "List comments for a task" })
  async listByTask(@Param("taskId") taskId: string) {
    return this.commentService.listByTask(taskId);
  }

  @Post()
  @ApiOperation({ summary: "Create a comment" })
  async create(@Req() req: AuthenticatedRequest, @Body() body: unknown) {
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.commentService.create(parsed.data, memberId);
  }

  @Patch(":commentId")
  @ApiOperation({ summary: "Update a comment" })
  async update(
    @Param("commentId") commentId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { content: string },
  ) {
    if (!body.content) {
      throw new BadRequestException("content is required");
    }
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.commentService.update(commentId, body.content, memberId);
  }

  @Delete(":commentId")
  @ApiOperation({ summary: "Delete a comment" })
  async remove(
    @Param("commentId") commentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.commentService.remove(commentId, memberId);
  }
}
