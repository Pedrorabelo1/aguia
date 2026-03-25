import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { createTaskSchema, updateTaskSchema } from "@aguia/shared";
import type { AuthenticatedRequest } from "../auth/auth.guard";

@ApiTags("Tasks")
@ApiBearerAuth()
@Controller("orgs/:orgId/tasks")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: "List tasks with filters" })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "assigneeId", required: false })
  @ApiQuery({ name: "priority", required: false })
  @ApiQuery({ name: "labelId", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "cursor", required: false })
  @ApiQuery({ name: "limit", required: false })
  async list(
    @Param("orgId") orgId: string,
    @Query("status") status?: string,
    @Query("assigneeId") assigneeId?: string,
    @Query("priority") priority?: string,
    @Query("labelId") labelId?: string,
    @Query("search") search?: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ) {
    return this.taskService.listByOrg(orgId, {
      status,
      assigneeId,
      priority,
      labelId,
      search,
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post()
  @ApiOperation({ summary: "Create a task" })
  async create(
    @Param("orgId") orgId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: unknown,
  ) {
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.taskService.create(orgId, parsed.data, memberId);
  }

  @Get(":taskId")
  @ApiOperation({ summary: "Get task details with comments, subtasks, labels" })
  async findOne(
    @Param("orgId") orgId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.taskService.findById(orgId, taskId);
  }

  @Patch(":taskId")
  @ApiOperation({ summary: "Update a task" })
  async update(
    @Param("orgId") orgId: string,
    @Param("taskId") taskId: string,
    @Body() body: unknown,
  ) {
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.taskService.update(orgId, taskId, parsed.data);
  }

  @Delete(":taskId")
  @ApiOperation({ summary: "Delete a task" })
  async remove(
    @Param("orgId") orgId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.taskService.remove(orgId, taskId);
  }

  @Patch(":taskId/move")
  @ApiOperation({ summary: "Reorder or move task between columns" })
  async move(
    @Param("orgId") orgId: string,
    @Param("taskId") taskId: string,
    @Body() body: { status: string; order: number },
  ) {
    if (!body.status || body.order === undefined) {
      throw new BadRequestException("status and order are required");
    }
    return this.taskService.move(orgId, taskId, body.status, body.order);
  }

  @Post(":taskId/labels")
  @ApiOperation({ summary: "Add a label to a task" })
  async addLabel(
    @Param("orgId") orgId: string,
    @Param("taskId") taskId: string,
    @Body() body: { labelId: string },
  ) {
    if (!body.labelId) {
      throw new BadRequestException("labelId is required");
    }
    return this.taskService.addLabel(orgId, taskId, body.labelId);
  }

  @Delete(":taskId/labels/:labelId")
  @ApiOperation({ summary: "Remove a label from a task" })
  async removeLabel(
    @Param("orgId") orgId: string,
    @Param("taskId") taskId: string,
    @Param("labelId") labelId: string,
  ) {
    return this.taskService.removeLabel(orgId, taskId, labelId);
  }
}
