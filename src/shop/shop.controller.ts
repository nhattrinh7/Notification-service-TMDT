import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { ResendService } from '~/providers/resend/resend.service'
import { TemplateService } from '~/templates/templates.service'
import { BaseRetryConsumer } from '~/utils/base-retry.consumer'

@Controller()
export class ShopController extends BaseRetryConsumer {
  constructor(
    private readonly resendService: ResendService,
    private readonly templateService: TemplateService,
  ) {
    super()
  }

  @EventPattern('shop.approved')
  async handleShopApproved(
    @Payload() data: any, 
    @Ctx() context: RmqContext
  ) {
    console.log('Event shop.approved received:', data)
    await this.handleWithRetry(context, async () => {
      const html = this.templateService.render('shop-approved', {
        shopName: data.shopName,
      })

      await this.resendService.sendEmail({
        to: data.email,
        subject: 'Chúc mừng! Shop của bạn đã được phê duyệt',
        html: html,
      })
    })
  }

  @EventPattern('shop.rejected')
  async handleShopRejected(
    @Payload() data: any, 
    @Ctx() context: RmqContext
  ) {
    console.log('Event shop.rejected received:', data)
    await this.handleWithRetry(context, async () => {
      const html = this.templateService.render('shop-rejected', {
        shopName: data.shopName,
        rejectReason: data.rejectReason,
      })

      await this.resendService.sendEmail({
        to: data.email,
        subject: 'Rất tiếc! Shop của bạn đã bị từ chối',
        html: html,
      })
    })
  }
}
