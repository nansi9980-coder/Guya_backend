import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    description: string;
    imageUrl?: string;
    category?: string;
    client?: string;
    year?: number;
    featured?: boolean;
  }) {
    return this.prisma.project.create({ data });
  }

  async findAll() {
    return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    client?: string;
    year?: number;
    featured?: boolean;
  }) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Project deleted successfully' };
  }
}