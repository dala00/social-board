import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { Application } from '../../models/Application'
import { ApplicationUrl } from '../../models/ApplicationUrl'

const applicationState = atom<Application>({
  key: 'application/form/application',
  default: {} as Application,
})

const newApplicationUrlsState = atom<ApplicationUrl[]>({
  key: 'application/form/newApplicationUrls',
  default: [] as ApplicationUrl[],
})

export function useApplicationForm() {
  const [application, setApplication] = useRecoilState(applicationState)
  const [newApplicationUrls, setNewApplicationUrls] = useRecoilState(
    newApplicationUrlsState
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

  return {
    addNewApplicationUrl,
    application,
    deleteNewApplicationUrl,
    newApplicationUrls,
    setApplication,
    setApplicationUrl,
    setNewApplicationUrl,
  }
}
