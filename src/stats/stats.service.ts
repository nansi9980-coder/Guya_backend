import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { key: string; value: number; label: string }) {
    return this.prisma.stats.create({ data });
  }

  async findAll() {
    return this.prisma.stats.findMany({ orderBy: { key: 'asc' } });
  }

  async findOne(id: string) {
    const stat = await this.prisma.stats.findUnique({ where: { id } });
    if (!stat) {
      throw new NotFoundException('Stat not found');
    }
    return stat;
  }

  async update(id: string, data: { value?: number; label?: string }) {
    return this.prisma.stats.update({ where: { id }, data });
  }

  async upsert(key: string, data: { value: number; label: string }) {
    return this.prisma.stats.upsert({
      where: { key },
      update: { value: data.value, label: data.label },
      create: { key, value: data.value, label: data.label },
    });
  }

  async delete(id: string) {
    await this.prisma.stats.delete({ where: { id } });
    return { message: 'Stat deleted successfully' };
  }
}