import { Active, Over } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useMemo } from 'react'
import { GrTasks } from 'react-icons/gr'
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

const isDraggingSheetState = atom({
  key: 'board/is_dragging_sheet',
  default: false,
})

type SortItemId = {
  type: string
  id: number
}

export function useBoard() {
  const [sheets, setSheets] = useRecoilState(sheetsState)
  const [clonedSheets, setClonedSheets] = useRecoilState(clonedSheetsState)
  const [isDraggingSheet, setIsDraggingSheet] =
    useRecoilState(isDraggingSheetState)

  const getSortItemId = useCallback((id: string): SortItemId => {
    const parts = id.split(/-/)
    return {
      type: parts[0],
      id: Number(parts[1]),
    }
  }, [])

  const getTask = useCallback(
    (id: number, searchSheets?: Sheet[]) => {
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
    (sheetId: number, task: Task) => {
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
      setSheets((sheets) =>
        arrayMove(
          sheets,
          sheets.findIndex((sheet) => sheet.id === activeItemId.id),
          sheets.findIndex((sheet) => sheet.id === overItemId.id)
        )
      )
      setClonedSheets(null)
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
      return
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

  return {
    addTask,
    clonedSheets,
    cloneSheets,
    convertToMultipleContainersItems,
    getSortItemId,
    getTask,
    isDraggingSheet,
    moveEndOverTask,
    moveOverTask,
    moveSheet,
    setClonedSheets,
    setIsDraggingSheet,
    setSheets,
    sheets,
    swap,
  }
}
