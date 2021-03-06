import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { Application, createEmptyApplication } from '../../models/Application'
import { ApplicationUrl } from '../../models/ApplicationUrl'
import { useFormImage } from '../form/image'

const applicationState = atom<Application>({
  key: 'application/form/application',
  default: createEmptyApplication(),
})

const newApplicationUrlsState = atom<ApplicationUrl[]>({
  key: 'application/form/newApplicationUrls',
  default: [] as ApplicationUrl[],
})

const deletingApplicationUrlIdsState = atom<string[]>({
  key: 'application/form/deletingApplicationUrlIds',
  default: [] as string[],
})

export function useApplicationForm() {
  const [application, setApplication] = useRecoilState(applicationState)
  const [newApplicationUrls, setNewApplicationUrls] = useRecoilState(
    newApplicationUrlsState
  )
  const [deletingApplicationUrlIds, setDeletingApplicationUrlIds] =
    useRecoilState(deletingApplicationUrlIdsState)
  const iconImage = useFormImage()

  const initialize = useCallback(
    ({ application }: { application: Application }) => {
      setApplication(application)
      setNewApplicationUrls([])
    },
    []
  )

  const addNewApplicationUrl = useCallback(() => {
    setNewApplicationUrls([
      ...newApplicationUrls,
      { name: '', url: '' } as ApplicationUrl,
    ])
  }, [newApplicationUrls])

  const setNewApplicationUrl = useCallback(
    (index: number, applicationUrl: ApplicationUrl) => {
      setNewApplicationUrls(
        newApplicationUrls.map((currentApplicationUrl, mapIndex) => {
          if (mapIndex === index) {
            return applicationUrl
          }
          return currentApplicationUrl
        })
      )
    },
    [newApplicationUrls]
  )

  const deleteNewApplicationUrl = useCallback(
    (index: number) => {
      const newNewApplicationUrls: ApplicationUrl[] = []
      newApplicationUrls.forEach((applicationUrl, currentIndex) => {
        if (index !== currentIndex) {
          newNewApplicationUrls.push(applicationUrl)
        }
      })
      setNewApplicationUrls(newNewApplicationUrls)
    },
    [newApplicationUrls]
  )

  const setApplicationUrl = useCallback(
    (index: number, applicationUrl: ApplicationUrl) => {
      setApplication({
        ...application,
        applicationUrls: application.applicationUrls.map(
          (currentApplicationUrl, currentIndex) => {
            if (currentIndex === index) {
              return applicationUrl
            }
            return currentApplicationUrl
          }
        ),
      })
    },
    [application]
  )

  const deleteApplicationUrl = useCallback(
    (id: string) => {
      setDeletingApplicationUrlIds([...deletingApplicationUrlIds, id])
      setApplication({
        ...application,
        applicationUrls: application.applicationUrls.filter(
          (applicationUrl) => applicationUrl.id !== id
        ),
      })
    },
    [application, deletingApplicationUrlIds]
  )

  return {
    addNewApplicationUrl,
    application,
    deleteApplicationUrl,
    deleteNewApplicationUrl,
    deletingApplicationUrlIds,
    iconImage,
    initialize,
    newApplicationUrls,
    setApplication,
    setApplicationUrl,
    setNewApplicationUrl,
  }
}
