import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { DepartmentService } from "./department.service";
import { createDepartmentSchema, updateDepartmentSchema } from "@aguia/shared";

@ApiTags("Departments")
@ApiBearerAuth()
@Controller("orgs/:orgId/departments")
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: "List organization departments" })
  async list(@Param("orgId") orgId: string) {
    return this.departmentService.listByOrg(orgId);
  }

  @Post()
  @ApiOperation({ summary: "Create a department" })
  async create(@Param("orgId") orgId: string, @Body() body: unknown) {
    const parsed = createDepartmentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.departmentService.create(orgId, parsed.data);
  }

  @Get(":departmentId")
  @ApiOperation({ summary: "Get department details with members" })
  async findOne(
    @Param("orgId") orgId: string,
    @Param("departmentId") departmentId: string,
  ) {
    return this.departmentService.findById(orgId, departmentId);
  }

  @Patch(":departmentId")
  @ApiOperation({ summary: "Update a department" })
  async update(
    @Param("orgId") orgId: string,
    @Param("departmentId") departmentId: string,
    @Body() body: unknown,
  ) {
    const parsed = updateDepartmentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.departmentService.update(orgId, departmentId, parsed.data);
  }

  @Delete(":departmentId")
  @ApiOperation({ summary: "Delete a department" })
  async remove(
    @Param("orgId") orgId: string,
    @Param("departmentId") departmentId: string,
  ) {
    return this.departmentService.remove(orgId, departmentId);
  }

  @Post(":departmentId/members")
  @ApiOperation({ summary: "Add a member to a department" })
  async addMember(
    @Param("orgId") orgId: string,
    @Param("departmentId") departmentId: string,
    @Body() body: { memberId: string; isHead?: boolean },
  ) {
    if (!body.memberId) {
      throw new BadRequestException("memberId is required");
    }
    return this.departmentService.addMember(
      orgId,
      departmentId,
      body.memberId,
      body.isHead,
    );
  }

  @Delete(":departmentId/members/:memberId")
  @ApiOperation({ summary: "Remove a member from a department" })
  async removeMember(
    @Param("orgId") orgId: string,
    @Param("departmentId") departmentId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.departmentService.removeMember(orgId, departmentId, memberId);
  }
}
