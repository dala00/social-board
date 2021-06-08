import { Sheet as PrismaSheet } from '.prisma/client'
import { Task } from './Task'

export type Sheet = PrismaSheet & {
  tasks: Task[]
}
