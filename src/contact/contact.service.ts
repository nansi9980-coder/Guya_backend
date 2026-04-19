import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
    const contact = await this.prisma.contact.create({ data });
    
    // Envoyer email de confirmation au client
    await this.mailService.sendContactConfirmation({
      name: data.name,
      email: data.email,
      subject: data.subject || 'Message',
      message: data.message,
    });

    //Notifier l'admin
    await this.mailService.notifyAdminNewContact({
      name: data.name,
      email: data.email,
      subject: data.subject || 'Message',
      message: data.message,
      phone: data.phone,
    });

    return contact;
  }

  async findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  async markAsRead(id: string) {
    return this.prisma.contact.update({
      where: { id },
      data: { read: true },
    });
  }

  async delete(id: string) {
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Contact deleted successfully' };
  }

  async getStats() {
    const total = await this.prisma.contact.count();
    const unread = await this.prisma.contact.count({ where: { read: false } });
    return { total, unread };
  }
}