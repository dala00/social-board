import { atom, useRecoilState } from 'recoil'
import { Application } from '../../models/Application'

const applicationState = atom<Application>({
  key: 'application/form',
  default: {} as Application,
})

export function useApplicationForm() {
  const [application, setApplication] = useRecoilState(applicationState)

  return { application, setApplication }
}
