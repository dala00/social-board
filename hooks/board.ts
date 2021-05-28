import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { Sheet } from '../models/Sheet'
import { Task } from '../models/Task'

const sheetsState = atom<Sheet[]>({
  key: 'board/sheets',
  default: [],
})

const clonedSheetsState = atom<Sheet[] | null>({
  key: 'board/cloned_sheets',
  default: null,
})

type SortItemId = {
  type: string
  id: number
}

export function useBoard() {
  const [sheets, setSheets] = useRecoilState(sheetsState)
  const [clonedSheets, setClonedSheets] = useRecoilState(clonedSheetsState)

  const getSortItemId = useCallback((id: string): SortItemId => {
    const parts = id.split(/-/)
    return {
      type: parts[0],
      id: Number(parts[1]),
    }
  }, [])

  const getTask = useCallback(
    (id: number) => {
      for (const sheet of sheets) {
        const task = sheet.tasks.find((task) => task.id === id)
        if (task) {
          return task
        }
      }
    },
    [sheets]
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

  function swap(container: string, activeId: string, overId: string): Sheet[] {
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

  function moveTask(
    sheets: Sheet[],
    activeContainer: string,
    overContainer: string,
    activeId: string,
    overId: string
  ): Sheet[] | undefined {
    const activeSheetItemId = getSortItemId(activeContainer)
    const overSheetItemId = getSortItemId(overContainer)
    const taskSortItemId = getSortItemId(activeId)
    const overSortItemId = getSortItemId(overId)
    if (overSortItemId.type === 'sheet') {
      return
    }

    const activeSheet = sheets.find(
      (sheet) => sheet.id === activeSheetItemId.id
    )
    const overSheet = sheets.find((sheet) => sheet.id === overSheetItemId.id)
    const task = activeSheet.tasks.find((t) => t.id === taskSortItemId.id)
    const overTask = overSheet.tasks.find((t) => t.id === overSortItemId.id)
    if (!task || !overTask) {
      return
    }

    if (activeContainer === overContainer) {
      const newTasks = arrayMove(
        activeSheet.tasks,
        activeSheet.tasks.findIndex((t) => t.id === task.id),
        activeSheet.tasks.findIndex((t) => t.id === overTask.id)
      )

      return sheets.map((sheet) => {
        if (sheet.id === activeSheet.id) {
          return { ...activeSheet, tasks: newTasks }
        }
        return sheet
      })
    } else {
      const newActiveSheet = {
        ...activeSheet,
        tasks: activeSheet.tasks.filter((t) => t.id !== taskSortItemId.id),
      }
      const newTasks: Task[] = []
      overSheet.tasks.forEach((overSheetTask) => {
        newTasks.push(overSheetTask)
        if (overSheetTask.id === overSortItemId.id) {
          newTasks.push(task)
        }
      })
      const newOverSheet = { ...overSheet, tasks: newTasks }
      return sheets.map((sheet) => {
        if (sheet.id === newActiveSheet.id) {
          return newActiveSheet
        } else if (sheet.id === newOverSheet.id) {
          return newOverSheet
        } else {
          return sheet
        }
      })
    }
  }

  return {
    clonedSheets,
    cloneSheets,
    convertToMultipleContainersItems,
    getSortItemId,
    getTask,
    moveTask,
    setClonedSheets,
    setSheets,
    sheets,
    swap,
  }
}
