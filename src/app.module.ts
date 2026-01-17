import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'
import { UserModule } from '~/users/user.module'
import { TemplateModule } from '~/templates/templates.module'

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
    UserModule,
    TemplateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
