import { Module, Global } from '@nestjs/common'
import { TemplateService } from '~/templates/templates.service'

@Global()
@Module({
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}