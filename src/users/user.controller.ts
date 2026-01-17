import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { ResendService } from '~/providers/resend/resend.service'
import { TemplateService } from '~/templates/templates.service'
import { BaseRetryConsumer } from '~/utils/base-retry.consumer'

@Controller()
export class UserController extends BaseRetryConsumer {
  constructor(
    private readonly resendService: ResendService,
    private readonly templateService: TemplateService,
  ) {
    super()
  }

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Event user.created received:', data)
    await this.handleWithRetry(context, async () => {
      // Giả lập lỗi - comment code gửi email thật
      // throw new Error('Simulated email service error')
      const html = this.templateService.render('verification-email', {
        otp: data.emailVerifyOtp,
        expiresIn: data.emailVerifyOtpExpire,
      })

      await this.resendService.sendEmail({
        to: data.email,
        subject: 'Welcome to Our Website!',
        html: html,
      })
    })
  }
}
