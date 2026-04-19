import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description: string; icon?: string; order?: number }) {
    return this.prisma.service.create({ data });
  }

  async findAll() {
    return this.prisma.service.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: string, data: { title?: string; description?: string; icon?: string; order?: number }) {
    return this.prisma.service.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.service.delete({ where: { id } });
    return { message: 'Service deleted successfully' };
  }
}