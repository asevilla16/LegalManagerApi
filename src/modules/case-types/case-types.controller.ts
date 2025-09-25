import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CaseTypesService } from './case-types.service';
import { CreateCaseTypeDto } from './dto/create-case-type.dto';
import { UpdateCaseTypeDto } from './dto/update-case-type.dto';

@Controller('case-types')
export class CaseTypesController {
  constructor(private readonly caseTypesService: CaseTypesService) {}

  @Post()
  create(@Body() createCaseTypeDto: CreateCaseTypeDto) {
    return this.caseTypesService.create(createCaseTypeDto);
  }

  @Get()
  findAll() {
    return this.caseTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caseTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaseTypeDto: UpdateCaseTypeDto) {
    return this.caseTypesService.update(+id, updateCaseTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caseTypesService.remove(+id);
  }
}
