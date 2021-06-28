import { Application as PrismaApplication } from '@prisma/client'
import { createUrl } from '../lib/client/storage'
import { ApplicationUrl } from './ApplicationUrl'

export type Application = PrismaApplication & {
  applicationUrls: ApplicationUrl[]
}

export function getIconUrl(application: Application): string {
  if (application.iconFileName === '') {
    return ''
  }
  return createUrl(
    `/application/${application.id}/icon/${application.iconFileName}`
  )
}
