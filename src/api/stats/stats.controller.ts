import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @ApiBearerAuth()
  @Get()
  public async dashboardStats() {
    return this.statsService.dashboardStats();
  }
}
