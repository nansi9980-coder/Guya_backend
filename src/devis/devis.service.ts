import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DEV-${timestamp}-${random}`;
}

@Injectable()
export class DevisService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(data: {
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
    const reference = generateReference();
    const devis = await this.prisma.devis.create({
      data: {
        ...data,
        reference,
      },
    });

    // Envoyer email de confirmation au client
    await this.mailService.sendDevisConfirmation({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      reference,
    });

    //Notifier l'admin
    await this.mailService.notifyAdminNewDevis({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      reference,
      location: data.location,
      services: data.services || [],
    });

    return devis;
  }

  async findAll() {
    return this.prisma.devis.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const devis = await this.prisma.devis.findUnique({ where: { id } });
    if (!devis) {
      throw new NotFoundException('Devis not found');
    }
    return devis;
  }

  async updateStatus(id: string, data: { status: string; amount?: string }) {
    return this.prisma.devis.update({
      where: { id },
      data: { status: data.status, amount: data.amount },
    });
  }

  async delete(id: string) {
    await this.prisma.devis.delete({ where: { id } });
    return { message: 'Devis deleted successfully' };
  }

  async getStats() {
    const total = await this.prisma.devis.count();
    const pending = await this.prisma.devis.count({ where: { status: 'NEW' } });
    const inProgress = await this.prisma.devis.count({ where: { status: 'IN_PROGRESS' } });
    const validated = await this.prisma.devis.count({ where: { status: 'ACCEPTED' } });
    const rejected = await this.prisma.devis.count({ where: { status: 'REJECTED' } });
    return { total, pending, inProgress, validated, rejected };
  }
}