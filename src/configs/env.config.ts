import { ConfigService } from '@nestjs/config'

class EnvConfig {
  constructor(private configService: ConfigService) {}

  get config() {
    return {
      SERVICE_NAME: this.configService.get<string>('SERVICE_NAME')!,
      SERVICE_HOST: this.configService.get<string>('SERVICE_HOST')!,
      PORT: this.configService.get<string>('PORT')!,
    }
  }

  get resend() {
    return {
      RESEND_API_KEY: this.configService.get<string>('RESEND_API_KEY')!,
      RESEND_SENDER_EMAIL: this.configService.get<string>('RESEND_SENDER_EMAIL')!,
    }
  }
}

let envInstance: EnvConfig

export const setConfigService = (configService: ConfigService) => {
  envInstance = new EnvConfig(configService)
}

export const env = new Proxy({} as EnvConfig, {
  get(_, prop) {
    if (!envInstance) {
      throw new Error(
        '❌ EnvConfig not initialized! Call setConfigService() in AppModule constructor or main.ts',
      )
    }
    return envInstance[prop as keyof EnvConfig]
  },
})
