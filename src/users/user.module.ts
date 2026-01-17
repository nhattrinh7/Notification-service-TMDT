import { Module } from '@nestjs/common'
import { ResendModule } from '~/providers/resend/resend.module'
import { UserController } from './user.controller'

@Module({
  imports: [ResendModule],
  controllers: [UserController],
  providers: [],
  exports: [],
})
export class UserModule {}