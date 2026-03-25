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
import { ProcessService } from "./process.service";
import {
  createProcessSchema,
  updateProcessSchema,
  createProcessStepSchema,
} from "@aguia/shared";
import type { AuthenticatedRequest } from "../auth/auth.guard";

@ApiTags("Processes")
@ApiBearerAuth()
@Controller("orgs/:orgId/processes")
export class ProcessController {
  constructor(private processService: ProcessService) {}

  @Get()
  @ApiOperation({ summary: "List process templates" })
  async list(@Param("orgId") orgId: string) {
    return this.processService.listByOrg(orgId);
  }

  @Post()
  @ApiOperation({ summary: "Create a process template" })
  async create(@Param("orgId") orgId: string, @Body() body: unknown) {
    const parsed = createProcessSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.processService.create(orgId, parsed.data);
  }

  @Get(":processId")
  @ApiOperation({ summary: "Get process template with steps" })
  async findOne(
    @Param("orgId") orgId: string,
    @Param("processId") processId: string,
  ) {
    return this.processService.findById(orgId, processId);
  }

  @Patch(":processId")
  @ApiOperation({ summary: "Update a process template" })
  async update(
    @Param("orgId") orgId: string,
    @Param("processId") processId: string,
    @Body() body: unknown,
  ) {
    const parsed = updateProcessSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.processService.update(orgId, processId, parsed.data);
  }

  @Delete(":processId")
  @ApiOperation({ summary: "Delete a process template" })
  async remove(
    @Param("orgId") orgId: string,
    @Param("processId") processId: string,
  ) {
    return this.processService.remove(orgId, processId);
  }

  @Post(":processId/steps")
  @ApiOperation({ summary: "Add a step to a process template" })
  async addStep(
    @Param("orgId") orgId: string,
    @Param("processId") processId: string,
    @Body() body: unknown,
  ) {
    const parsed = createProcessStepSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.processService.addStep(orgId, processId, parsed.data);
  }

  @Post(":processId/activate")
  @ApiOperation({ summary: "Activate a process (create instance + tasks)" })
  async activate(
    @Param("orgId") orgId: string,
    @Param("processId") processId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { name?: string },
  ) {
    const memberId = req.member?.id;
    if (!memberId) {
      throw new BadRequestException("Member context required");
    }
    return this.processService.activate(orgId, processId, body.name ?? "", memberId);
  }
}
