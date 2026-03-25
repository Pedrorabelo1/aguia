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
import { LabelService } from "./label.service";
import { createLabelSchema } from "@aguia/shared";

@ApiTags("Labels")
@ApiBearerAuth()
@Controller("orgs/:orgId/labels")
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Get()
  @ApiOperation({ summary: "List organization labels" })
  async list(@Param("orgId") orgId: string) {
    return this.labelService.listByOrg(orgId);
  }

  @Post()
  @ApiOperation({ summary: "Create a label" })
  async create(@Param("orgId") orgId: string, @Body() body: unknown) {
    const parsed = createLabelSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.labelService.create(orgId, parsed.data);
  }

  @Patch(":labelId")
  @ApiOperation({ summary: "Update a label" })
  async update(
    @Param("orgId") orgId: string,
    @Param("labelId") labelId: string,
    @Body() body: unknown,
  ) {
    const parsed = createLabelSchema.partial().safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.labelService.update(orgId, labelId, parsed.data);
  }

  @Delete(":labelId")
  @ApiOperation({ summary: "Delete a label" })
  async remove(
    @Param("orgId") orgId: string,
    @Param("labelId") labelId: string,
  ) {
    return this.labelService.remove(orgId, labelId);
  }
}
