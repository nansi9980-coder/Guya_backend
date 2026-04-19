import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY non configurée - les emails ne seront pas envoyés');
    }
    this.resend = new Resend(apiKey || 're_placeholder');
  }

  private getFromEmail(): string {
    return this.configService.get<string>('MAIL_FROM') || 'contact@guyafibre.com';
  }

  private getAdminEmail(): string {
    return this.configService.get<string>('ADMIN_EMAIL') || 'admin@guyafibre.com';
  }

  async sendContactConfirmation(contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to: contact.email,
        subject: 'Confirmation de votre message - GUYA FIBRE',
        html: '<p>Bonjour <strong>' + contact.name + '</strong>,</p><p>Nous avons bien reçu votre message.</p><p>Notre équipe vous répondra sous 24h ouvrées.</p>',
      });
      this.logger.log('Email de confirmation envoyé à ' + contact.email);
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi du mail: ' + error.message);
    }
  }

  async sendDevisConfirmation(devis: {
    clientName: string;
    clientEmail: string;
    reference: string;
  }) {
    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to: devis.clientEmail,
        subject: 'Confirmation de votre demande de devis - ' + devis.reference,
        html: '<p>Bonjour <strong>' + devis.clientName + '</strong>,</p><p>Votre demande de devis (' + devis.reference + ') a été reçue.</p><p>Notre équipe vous contactera sous 24-48h.</p>',
      });
      this.logger.log('Email de confirmation devis envoyé à ' + devis.clientEmail);
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi du mail: ' + error.message);
    }
  }

  async notifyAdminNewContact(contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
  }) {
    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to: this.getAdminEmail(),
        subject: 'Nouveau message de ' + contact.name,
        html: '<h3>Nouveau message</h3><p><strong>Nom:</strong> ' + contact.name + '</p><p><strong>Email:</strong> ' + contact.email + '</p><p><strong>Sujet:</strong> ' + contact.subject + '</p>',
      });
    } catch (error) {
      this.logger.error('Erreur notification admin: ' + error.message);
    }
  }

  async notifyAdminNewDevis(devis: {
    clientName: string;
    clientEmail: string;
    reference: string;
    location: string;
    services: string[];
  }) {
    try {
      await this.resend.emails.send({
        from: this.getFromEmail(),
        to: this.getAdminEmail(),
        subject: 'Nouveau devis - ' + devis.reference,
        html: '<h3>Nouveau devis</h3><p><strong>Client:</strong> ' + devis.clientName + '</p><p><strong>Email:</strong> ' + devis.clientEmail + '</p><p><strong>Référence:</strong> ' + devis.reference + '</p>',
      });
    } catch (error) {
      this.logger.error('Erreur notification admin: ' + error.message);
    }
  }
}
