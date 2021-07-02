import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ApplicationForm from '../../../components/application/ApplicationForm'
import Layout from '../../../components/layout/Layout'
import { useApplicationForm } from '../../../hooks/application/application_form'
import { useAuthentication } from '../../../hooks/authentication'
import { Application } from '../../../models/Application'

type Query = {
  id: string
}

type GetApplicationResponseData = {
  application: Application
}

export default function ApplicationEditPage() {
  const router = useRouter()
  const { currentUser } = useAuthentication()
  const { id } = router.query as Query
  const {
    initialize: initializeForm,
    application,
    newApplicationUrls,
    iconImage,
    deletingApplicationUrlIds,
  } = useApplicationForm()
  const [loading, setLoading] = useState(true)
  const { url: iconImageUrl, file: iconFile } = iconImage

  const initialize = useCallback(async () => {
    if (!id) {
      return
    }
    const response = await axios.get<GetApplicationResponseData>(
      `/api/applications/${id}/get-for-owner`
    )
    initializeForm({ application: response.data.application })
    setLoading(false)
  }, [id])

  useEffect(() => {
    initialize()
  }, [id])

  const save = useCallback(async () => {
    const form = new FormData()
    form.append('name', application.name)
    form.append('description', application.description)
    form.append('icon', iconFile)
    application.applicationUrls.forEach((applicationUrl, index) => {
      form.append(`applicationUrls[${index}][id]`, applicationUrl.id)
      form.append(`applicationUrls[${index}][name]`, applicationUrl.name)
      form.append(`applicationUrls[${index}][url]`, applicationUrl.url)
    })
    newApplicationUrls.forEach((applicationUrl, index) => {
      if (applicationUrl.url.trim() === '') {
        return
      }

      form.append(`newApplicationUrls[${index}][name]`, applicationUrl.name)
      form.append(`newApplicationUrls[${index}][url]`, applicationUrl.url)
    })
    deletingApplicationUrlIds.forEach((deletingApplicationUrlId, index) => {
      form.append(`deleteApplicationUrlIds[${index}]`, deletingApplicationUrlId)
    })
    await axios.patch(`/api/applications/${id}/update`, form, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    toast.success('更新しました。')
    router.push(`/board/${currentUser.uniqueId}/${id}`)
  }, [application, iconImageUrl, iconFile, newApplicationUrls])

  return (
    <Layout>
      <ApplicationForm loading={loading} onSave={save} buttonLabel="更新する" />
    </Layout>
  )
}
