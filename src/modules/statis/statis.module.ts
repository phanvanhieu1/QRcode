import { Module } from '@nestjs/common';
import { StatisService } from './statis.service';
import { StatisController } from './statis.controller';

@Module({
  controllers: [StatisController],
  providers: [StatisService],
})
export class StatisModule {}
