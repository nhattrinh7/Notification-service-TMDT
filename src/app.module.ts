import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'
import { TemplateModule } from '~/templates/templates.module'
import { UserModule } from '~/users/user.module'
import { ShopModule } from '~/shop/shop.module'
import { RequestLoggingMiddleware } from '~/common/middleware/request-logging.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,      
      isGlobal: true,
      validationSchema: Joi.object({
        RESEND_API_KEY: Joi.string().required(),
        RESEND_SENDER_EMAIL: Joi.string().required(),
      
        SERVICE_NAME: Joi.string().required(),
        SERVICE_HOST: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBITMQ_HOST: Joi.string().required(),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('{*path}')
  }
}
