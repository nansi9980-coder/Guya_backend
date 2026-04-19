import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des réalisations' })
  findAll() {
    return this.projectsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une réalisation' })
  create(@Body() body: {
    title: string;
    description: string;
    imageUrl?: string;
    category?: string;
    client?: string;
    year?: number;
    featured?: boolean;
  }) {
    return this.projectsService.create(body);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une réalisation' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une réalisation' })
  update(@Param('id') id: string, @Body() body: {
    title?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    client?: string;
    year?: number;
    featured?: boolean;
  }) {
    return this.projectsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}