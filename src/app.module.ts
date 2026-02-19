import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'
import { TemplateModule } from '~/templates/templates.module'
import { UserModule } from '~/users/user.module'
import { ShopModule } from '~/shop/shop.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RESEND_API_KEY: Joi.string().required(),
        RESEND_SENDER_EMAIL: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    TemplateModule,
    UserModule,
    ShopModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
