import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CaseStatusService } from './case-status.service';
import { CreateCaseStatusDto } from './dto/create-case-status.dto';
import { UpdateCaseStatusDto } from './dto/update-case-status.dto';

@Controller('case-status')
export class CaseStatusController {
  constructor(private readonly caseStatusService: CaseStatusService) {}

  @Post()
  create(@Body() createCaseStatusDto: CreateCaseStatusDto) {
    return this.caseStatusService.create(createCaseStatusDto);
  }

  @Get()
  findAll() {
    return this.caseStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caseStatusService.findOne(+id);
  }

  @Get('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.caseStatusService.deactivate(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCaseStatusDto: UpdateCaseStatusDto,
  ) {
    return this.caseStatusService.update(+id, updateCaseStatusDto);
  }
}
