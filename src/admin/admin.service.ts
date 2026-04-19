import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [usersCount, devisCount, contactCount, projectsCount, servicesCount, statsCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.devis.count(),
      this.prisma.contact.count(),
      this.prisma.project.count(),
      this.prisma.service.count(),
      this.prisma.stats.count(),
    ]);

    const devisStats = await this.prisma.devis.groupBy({
      by: ['status'],
      _count: true,
    });

    const contactStats = await this.prisma.contact.groupBy({
      by: ['read'],
      _count: true,
    });

    return {
      users: usersCount,
      devis: {
        total: devisCount,
        pending: devisStats.find((s) => s.status === 'PENDING')?._count || 0,
        validated: devisStats.find((s) => s.status === 'VALIDATED')?._count || 0,
        rejected: devisStats.find((s) => s.status === 'REJECTED')?._count || 0,
      },
      contact: {
        total: contactCount,
        unread: contactStats.find((s) => s.read === false)?._count || 0,
      },
      projects: projectsCount,
      services: servicesCount,
      stats: statsCount,
    };
  }
}