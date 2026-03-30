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
  async handleUserCreated(
    @Payload() data: any, 
    @Ctx() context: RmqContext
  ) {
    console.log(data)
    await this.handleWithRetry(context, async () => {
      this.logger.log(`Event user.created received ${data}`)
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

  @EventPattern('send_passcode_reset_otp')
  async handlePasscodeResetOtp(
    @Payload() data: { email: string; otp: string; expiryMinutes: string },
    @Ctx() context: RmqContext
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`Event send_passcode_reset_otp received`)
      const html = this.templateService.render('passcode-reset-otp', {
        otp: data.otp,
        expiryMinutes: data.expiryMinutes,
      })

      await this.resendService.sendEmail({
        to: data.email,
        subject: 'Mã OTP đặt lại Passcode - SZONE',
        html: html,
      })
    })
  }

  @EventPattern('send_password_reset_otp')
  async handlePasswordResetOtp(
    @Payload() data: { email: string; otp: string; expiryMinutes: string },
    @Ctx() context: RmqContext
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log('Event send_password_reset_otp received')
      const html = this.templateService.render('password-reset-otp', {
        otp: data.otp,
        expiryMinutes: data.expiryMinutes,
      })

      await this.resendService.sendEmail({
        to: data.email,
        subject: 'Mã OTP đặt lại mật khẩu - SZONE',
        html: html,
      })
    })
  }
}
