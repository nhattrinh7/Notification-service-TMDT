import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class TemplateService {
  private readonly templatesDir = path.join(__dirname, 'emails')

  render(templateName: string, context: Record<string, any>): string {
    const templatePath = path.join(this.templatesDir, `${templateName}.html`)

    let html = fs.readFileSync(templatePath, 'utf8')

    for (const [key, value] of Object.entries(context)) {
      html = html.replaceAll(`{{${key}}}`, String(value))
    }

    return html
  }
}