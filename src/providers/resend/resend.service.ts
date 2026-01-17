import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { OnModuleInit } from '@nestjs/common'
import { env } from '~/configs/env.config'

@Injectable()
export class ResendService implements OnModuleInit {
  private resend: Resend

  onModuleInit() {
    this.resend = new Resend(env.resend.RESEND_API_KEY)
  }

  async sendEmail({ to, subject, html }) {
    return this.resend.emails.send({
      from: env.resend.RESEND_SENDER_EMAIL,
      to,
      subject,
      html,
    })
  }
}
