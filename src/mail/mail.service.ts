import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendContactConfirmation(contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      await this.mailerService.sendMail({
        from: process.env.MAIL_FROM || 'contact@guyafibre.com',
        to: contact.email,
        subject: 'Confirmation de votre message - GUYA FIBRE',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #00c4b0, #00a896); padding: 30px; text-align: center; color: white; }
              .content { padding: 30px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>GUYA FIBRE</h1>
                <p>Confirmation de votre message</p>
              </div>
              <div class="content">
                <p>Bonjour <strong>${contact.name}</strong>,</p>
                <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>
                <p><strong>Sujet :</strong> ${contact.subject}</p>
                <p><strong>Votre message :</strong></p>
                <p>${contact.message}</p>
                <p>Notre équipe vous répondra dans les plus brefs délais, sous 24h ouvrées.</p>
              </div>
              <div class="footer">
                <p>GUYA FIBRE - Votre partenaire fibre en Guyane</p>
                <p>12 Rue des Palmiers, 97320 Saint-Laurent-du-Maroni</p>
                <p>Tél: +594 6 94 43 54 84 | Email: contact@guyafibre.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      this.logger.log(`Email de confirmation envoyé à ${contact.email}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi du mail: ${error.message}`);
    }
  }

  async sendDevisConfirmation(devis: {
    clientName: string;
    clientEmail: string;
    reference: string;
  }) {
    try {
      await this.mailerService.sendMail({
        from: process.env.MAIL_FROM || 'contact@guyafibre.com',
        to: devis.clientEmail,
        subject: `Confirmation de votre demande de devis - ${devis.reference}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #00c4b0, #00a896); padding: 30px; text-align: center; color: white; }
              .content { padding: 30px; background: #f9f9f9; }
              .reference { background: #00c4b0; color: white; padding: 10px 20px; display: inline-block; border-radius: 5px; font-weight: bold; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>GUYA FIBRE</h1>
                <p>Demande de devis reçue</p>
              </div>
              <div class="content">
                <p>Bonjour <strong>${devis.clientName}</strong>,</p>
                <p>Nous avons bien reçu votre demande de devis.</p>
                <p><strong>Référence de votre demande :</strong></p>
                <p class="reference">${devis.reference}</p>
                <p>Notre équipe technique va étudier votre demande et vous contactera sous 24-48h ouvrées pour discuter des détails et établir un devis personnalisé.</p>
              </div>
              <div class="footer">
                <p>GUYA FIBRE - Votre partenaire fibre en Guyane</p>
                <p>12 Rue des Palmiers, 97320 Saint-Laurent-du-Maroni</p>
                <p>Tél: +594 6 94 43 54 84 | Email: contact@guyafibre.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      this.logger.log(`Email de confirmation devis envoyé à ${devis.clientEmail}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi du mail: ${error.message}`);
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
      await this.mailerService.sendMail({
        from: process.env.MAIL_FROM || 'contact@guyafibre.com',
        to: process.env.ADMIN_EMAIL || 'admin@guyafibre.com',
        subject: `Nouveau message de ${contact.name} - ${contact.subject}`,
        html: `
          <h3>Nouveau message de contact</h3>
          <p><strong>Nom :</strong> ${contact.name}</p>
          <p><strong>Email :</strong> ${contact.email}</p>
          <p><strong>Téléphone :</strong> ${contact.phone || 'Non fourni'}</p>
          <p><strong>Sujet :</strong> ${contact.subject}</p>
          <p><strong>Message :</strong></p>
          <p>${contact.message}</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Erreur notification admin: ${error.message}`);
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
      await this.mailerService.sendMail({
        from: process.env.MAIL_FROM || 'contact@guyafibre.com',
        to: process.env.ADMIN_EMAIL || 'admin@guyafibre.com',
        subject: `Nouveau devis: ${devis.reference} - ${devis.clientName}`,
        html: `
          <h3>Nouvelle demande de devis</h3>
          <p><strong>Référence :</strong> ${devis.reference}</p>
          <p><strong>Client :</strong> ${devis.clientName}</p>
          <p><strong>Email :</strong> ${devis.clientEmail}</p>
          <p><strong>Localisation :</strong> ${devis.location}</p>
          <p><strong>Services demandés :</strong> ${devis.services?.join(', ') || 'Non spécifié'}</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Erreur notification admin: ${error.message}`);
    }
  }
}