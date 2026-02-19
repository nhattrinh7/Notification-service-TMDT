import { Module } from '@nestjs/common'
import { ResendModule } from '~/providers/resend/resend.module'
import { ShopController } from './shop.controller'

@Module({
  imports: [ResendModule],
  controllers: [ShopController],
  providers: [],
  exports: [],
})
export class ShopModule {}