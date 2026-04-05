import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { setConfigService } from '~/configs/env.config'
import { env } from '~/configs/env.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  const configService = app.get(ConfigService)
  setConfigService(configService)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://admin:admin123@${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
      exchange: 'events_exchange',
      exchangeType: 'topic',
      wildcards: true,
      queue: 'notification_queue',
      consumerTag: 'notification_consumer',
      queueOptions: {
        durable: true, // queue được persist để ko mất khi restart
        exclusive: false, // nhiều consumer có thể consume queue này
        autoDelete: false, // queue không bị xóa khi không có consumer
      },
      noAck: false,
      prefetchCount: 1,
    },
  })

  // Start tất cả microservices đã được kết nối với ứng dụng NestJS thông qua connectMicroservice()
  // trong trường hợp này là duy nhất thằng microservice RabbitMQ thôi
  await app.startAllMicroservices()

  await app.listen(env.config.PORT ?? 3010)

  // Register với Consul
  // await registerWithConsul('user-service', 3001)
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error)
