import { atom, useRecoilState } from 'recoil'
import { Sheet } from '../models/Sheet'

const sheetsState = atom<Sheet[]>({
  key: 'board/sheets',
  default: [],
})

export function useBoard() {
  const [sheets, setSheets] = useRecoilState(sheetsState)

  return { sheets, setSheets }
}
