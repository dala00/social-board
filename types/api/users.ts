import { Application } from '../../models/Application'
import { Sheet } from '../../models/Sheet'
import { User } from '../../models/User'

export type UsersSheetsResponseData = {
  user: User
  sheets: Sheet[]
  applications: Application[]
}
