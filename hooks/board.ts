import { useCallback, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { Sheet } from '../models/Sheet'

const sheetsState = atom<Sheet[]>({
  key: 'board/sheets',
  default: [],
})

export function useBoard() {
  const [sheets, setSheets] = useRecoilState(sheetsState)

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

  const multipleContainersItems = useMemo(() => {
    const items: { [key: string]: string[] } = {}

    sheets.forEach(
      (sheet) =>
        (items[sheet.id] = sheet.tasks.map((task) => task.id.toString()))
    )

    return items
  }, [sheets])

  return { sheets, setSheets, multipleContainersItems, getTask }
}
