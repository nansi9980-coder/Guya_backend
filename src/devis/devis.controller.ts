import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { DevisService } from './devis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Devis')
@Controller('api/devis')
export class DevisController {
  constructor(private devisService: DevisService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Soumettre un devis' })
  create(@Body() body: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    company?: string;
    services?: string[];
    location: string;
    address?: string;
    postalCode?: string;
    city?: string;
    description: string;
    urgency?: string;
  }) {
    return this.devisService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des devis' })
  findAll() {
    return this.devisService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Statistiques des devis' })
  getStats() {
    return this.devisService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir un devis' })
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut du devis' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string; amount?: string }) {
    return this.devisService.updateStatus(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un devis' })
  delete(@Param('id') id: string) {
    return this.devisService.delete(id);
  }
}