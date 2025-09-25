import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourtTypeService } from './court-type.service';
import { CreateCourtTypeDto } from './dto/create-court-type.dto';
import { UpdateCourtTypeDto } from './dto/update-court-type.dto';

@Controller('court-type')
export class CourtTypeController {
  constructor(private readonly courtTypeService: CourtTypeService) {}

  @Post()
  create(@Body() createCourtTypeDto: CreateCourtTypeDto) {
    return this.courtTypeService.create(createCourtTypeDto);
  }

  @Get()
  findAll() {
    return this.courtTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtTypeService.findOne(+id);
  }

  @Get('jurisdiction/:jurisdictionLevel')
  findByJurisdictionLevel(
    @Param('jurisdictionLevel') jurisdictionLevel: string,
  ) {
    return this.courtTypeService.findByJurisdictionLevel(jurisdictionLevel);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourtTypeDto: UpdateCourtTypeDto,
  ) {
    return this.courtTypeService.update(+id, updateCourtTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courtTypeService.remove(+id);
  }
}
