import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService
  ) {}

  async sendMailRecovery(email: string, resetToken: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"Equipo de soporte" <support@team.com>',
        subject: 'Recuperación de contraseña',
        html: `<h1>Hey ${email},</h1>
                <h2>Usa el siguiente codigo para reestrablecer tu contrasena</h2>
                <p>
                    ${resetToken}
                </p>
                <i>Si tu no pediste este codigo, puedes ignorarlo.</i>`,
        context: {
          names: email,
          code: resetToken,
        },
      });
      console.log('Sendin email to', email, '...');
      return { message: 'Email sent', success: true };
    } catch (e) {
      return { message: 'Error sending email', success: false };
    }
  }
}
