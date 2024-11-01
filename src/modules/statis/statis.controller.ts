import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatisService } from './statis.service';
import { CreateStatiDto } from './dto/create-stati.dto';
import { UpdateStatiDto } from './dto/update-stati.dto';

@Controller('statis')
export class StatisController {
  constructor(private readonly statisService: StatisService) {}

  @Post()
  create(@Body() createStatiDto: CreateStatiDto) {
    return this.statisService.create(createStatiDto);
  }

  @Get()
  findAll() {
    return this.statisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatiDto: UpdateStatiDto) {
    return this.statisService.update(+id, updateStatiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statisService.remove(+id);
  }
}
