import { useRouter } from 'next/router'
import { Active, Over } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { Sheet } from '../models/Sheet'
import { Task } from '../models/Task'
import { Application } from '../models/Application'
import { User } from '../models/User'

export type Query = {
  userId: string
  applicationId?: string
}

const sheetsState = atom<Sheet[]>({
  key: 'board/sheets',
  default: [],
})

const applicationsState = atom<Application[]>({
  key: 'board/applications',
  default: [],
})

const userState = atom<User>({
  key: 'board/user',
  default: { id: '' } as User,
})

const clonedSheetsState = atom<Sheet[] | null>({
  key: 'board/cloned_sheets',
  default: null,
})

const isDraggingSheetState = atom({
  key: 'board/is_dragging_sheet',
  default: false,
})

type SortItemId = {
  type: string
  id: string
}

export function useBoard() {
  const router = useRouter()
  const [userId, applicationId, taskId] = (router.query.param || []) as string[]
  const [sheets, setSheets] = useRecoilState(sheetsState)
  const [applications, setApplications] = useRecoilState(applicationsState)
  const [user, setUser] = useRecoilState(userState)
  const [clonedSheets, setClonedSheets] = useRecoilState(clonedSheetsState)
  const [isDraggingSheet, setIsDraggingSheet] =
    useRecoilState(isDraggingSheetState)

  const getSortItemId = useCallback((id: string): SortItemId => {
    const parts = id.split(/-/)
    return {
      type: parts[0],
      id: parts[1],
    }
  }, [])

  const getSheet = useCallback(
    (id: string) => sheets.find((sheet) => sheet.id === id),
    [sheets]
  )

  const getTask = useCallback(
    (id: string, searchSheets?: Sheet[]) => {
      for (const sheet of searchSheets || sheets) {
        const task = sheet.tasks.find((task) => task.id === id)
        if (task) {
          return task
        }
      }
    },
    [sheets]
  )

  const addTask = useCallback(
    (sheetId: string, task: Task) => {
      setSheets((sheets) =>
        sheets.map((sheet) =>
          sheet.id === sheetId
            ? {
                ...sheet,
                tasks: [task].concat(sheet.tasks),
              }
            : sheet
        )
      )
    },
    [sheets]
  )

  const updateTask = useCallback(
    (id: string, task: Task) => {
      setSheets((sheets) =>
        sheets.map((sheet) => {
          if (sheet.id != task.sheetId) {
            return sheet
          }
          return {
            ...sheet,
            tasks: sheet.tasks.map((t) => {
              if (t.id !== id) {
                return t
              }
              return task
            }),
          }
        })
      )
    },
    [sheets]
  )

  const getApplication = useCallback(
    (id) => applications.find((application) => application.id === id),
    [applications]
  )

  const convertToMultipleContainersItems = useCallback((sheets: Sheet[]) => {
    const items: { [key: string]: string[] } = {}

    sheets.forEach(
      (sheet) =>
        (items[`sheet-${sheet.id}`] = sheet.tasks.map(
          (task) => `task-${task.id.toString()}`
        ))
    )

    return items
  }, [])

  const cloneSheets = useCallback(() => {
    const cloned = sheets.map((sheet) => {
      const clonedTasks = sheet.tasks.map((task) => {
        return { ...task }
      })
      return { ...sheet, tasks: clonedTasks }
    })
    setClonedSheets(cloned)
  }, [sheets])

  const moveSheet = useCallback(
    (activeId, overId) => {
      if (activeId === overId) {
        return
      }

      const activeItemId = getSortItemId(activeId)
      const overItemId = getSortItemId(overId)
      const sortedSheets = arrayMove(
        sheets,
        sheets.findIndex((sheet) => sheet.id === activeItemId.id),
        sheets.findIndex((sheet) => sheet.id === overItemId.id)
      )
      setSheets(sortedSheets)
      setClonedSheets(null)

      return sortedSheets
    },
    [sheets, clonedSheets]
  )

  function swap(
    sheets: Sheet[],
    container: string,
    activeId: string,
    overId: string
  ): Sheet[] {
    const sheetItemId = getSortItemId(container)
    const activeItemId = getSortItemId(activeId)
    const overItemId = getSortItemId(overId)

    return sheets.map((sheet) => {
      if (sheet.id !== sheetItemId.id) {
        return sheet
      }

      const newTasks = arrayMove(
        sheet.tasks,
        sheet.tasks.findIndex((t) => t.id === activeItemId.id),
        sheet.tasks.findIndex((t) => t.id === overItemId.id)
      )
      return { ...sheet, tasks: newTasks }
    })
  }

  function moveOverTaskToEmptySheet(
    sheets: Sheet[],
    overSheetItemId: SortItemId,
    taskItemId: SortItemId
  ): Sheet[] {
    const task = getTask(taskItemId.id, sheets)
    return sheets.map((sheet) => {
      if (sheet.id === task.sheetId) {
        return { ...sheet, tasks: sheet.tasks.filter((t) => t.id !== task.id) }
      } else if (sheet.id === overSheetItemId.id) {
        return { ...sheet, tasks: [{ ...task, sheetId: overSheetItemId.id }] }
      } else {
        return sheet
      }
    })
  }

  function moveOverTask(
    sheets: Sheet[],
    activeContainer: string,
    overContainer: string,
    active: Active,
    over: Over
  ): Sheet[] | undefined {
    const activeSheetItemId = getSortItemId(activeContainer)
    const overSheetItemId = getSortItemId(overContainer)
    const taskItemId = getSortItemId(active.id)
    const overItemId = getSortItemId(over.id)

    if (overItemId.type === 'sheet') {
      if (taskItemId.type === 'sheet') {
        // ??????????????????????????????????????????
        return
      }
      // ????????????????????????????????????
      return moveOverTaskToEmptySheet(sheets, overSheetItemId, taskItemId)
    }

    const overSheet = sheets.find((sheet) => sheet.id === overSheetItemId.id)
    const overIndex = overSheet.tasks.findIndex(
      (task) => task.id === overItemId.id
    )
    const isBelowLastItem =
      over &&
      overIndex === overSheet.tasks.length - 1 &&
      active.rect.current.translated &&
      active.rect.current.translated.offsetTop >
        over.rect.offsetTop + over.rect.height
    const modified = isBelowLastItem ? 1 : 0
    const newIndex =
      overIndex >= 0 ? overIndex + modified : overSheet.tasks.length + 1

    return sheets.map((sheet) => {
      if (sheet.id === activeSheetItemId.id) {
        return {
          ...sheet,
          tasks: sheet.tasks.filter((task) => task.id !== taskItemId.id),
        }
      } else if (sheet.id === overSheetItemId.id) {
        return {
          ...sheet,
          tasks: [
            ...overSheet.tasks.slice(0, newIndex),
            { ...getTask(taskItemId.id, sheets), sheetId: sheet.id },
            ...overSheet.tasks.slice(newIndex),
          ],
        }
      } else {
        return sheet
      }
    })
  }

  function moveEndOverTask(
    overContainer: string,
    activeId: string,
    overId: string
  ): Sheet[] | undefined {
    if (activeId === overId) {
      return clonedSheets
    }
    return swap(clonedSheets, overContainer, activeId, overId)
  }

  const deleteTask = useCallback(
    (deleteTaskId: string) => {
      setSheets((sheets) =>
        sheets.map((sheet) => ({
          ...sheet,
          tasks: sheet.tasks.filter((task) => task.id !== deleteTaskId),
        }))
      )
    },
    [sheets]
  )

  return {
    addTask,
    applicationId,
    applications,
    clonedSheets,
    cloneSheets,
    convertToMultipleContainersItems,
    deleteTask,
    getApplication,
    getSheet,
    getSortItemId,
    getTask,
    isDraggingSheet,
    moveEndOverTask,
    moveOverTask,
    moveSheet,
    setApplications,
    setClonedSheets,
    setIsDraggingSheet,
    setSheets,
    setUser,
    sheets,
    swap,
    taskId,
    updateTask,
    user,
    userId,
  }
}
