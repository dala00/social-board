import { Application } from '../../models/Application'
import { Sheet } from '../../models/Sheet'

export type UsersSheetsResponseData = {
  sheets: Sheet[]
  applications: Application[]
}
