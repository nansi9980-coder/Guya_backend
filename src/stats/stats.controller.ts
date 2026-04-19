import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des statistiques' })
  findAll() {
    return this.statsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une statistique' })
  create(@Body() body: { key: string; value: number; label: string }) {
    return this.statsService.create(body);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une statistique' })
  findOne(@Param('id') id: string) {
    return this.statsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une statistique' })
  update(@Param('id') id: string, @Body() body: { value?: number; label?: string }) {
    return this.statsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('upsert')
  upsert(@Body() body: { key: string; value: number; label: string }) {
    return this.statsService.upsert(body.key, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.statsService.delete(id);
  }
}