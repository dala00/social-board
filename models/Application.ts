import { Application as PrismaApplication } from '@prisma/client'
import { ApplicationUrl } from './ApplicationUrl'

export type Application = PrismaApplication & {
  applicationUrls: ApplicationUrl[]
}
