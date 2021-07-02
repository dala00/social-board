import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ApplicationForm from '../../components/application/ApplicationForm'
import Layout from '../../components/layout/Layout'
import { useApplicationForm } from '../../hooks/application/application_form'
import { useAuthentication } from '../../hooks/authentication'
import {
  Application,
  createEmptyApplication,
  getIconUrl,
} from '../../models/Application'

type GetApplicationResponseData = {
  application: Application
}

export default function ApplicationCreatePage() {
  const router = useRouter()
  const { currentUser } = useAuthentication()
  const {
    initialize: initializeForm,
    application,
    newApplicationUrls,
    iconImage,
    deletingApplicationUrlIds,
  } = useApplicationForm()
  const [loading, setLoading] = useState(false)
  const { url: iconImageUrl, file: iconFile } = iconImage

  const initialize = useCallback(async () => {
    initializeForm({ application: createEmptyApplication() })
  }, [])

  useEffect(() => {
    initialize()
  }, [])

  const save = useCallback(async () => {
    const form = new FormData()
    form.append('name', application.name)
    form.append('description', application.description)
    form.append('icon', iconFile)
    newApplicationUrls.forEach((applicationUrl, index) => {
      if (applicationUrl.url.trim() === '') {
        return
      }

      form.append(`newApplicationUrls[${index}][name]`, applicationUrl.name)
      form.append(`newApplicationUrls[${index}][url]`, applicationUrl.url)
    })
    await axios.post(`/api/applications/store`, form, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    toast.success('登録しました。')
    router.push(`/board/${currentUser.uniqueId}`)
  }, [application, iconImageUrl, iconFile, newApplicationUrls])

  return (
    <Layout>
      <ApplicationForm loading={loading} onSave={save} buttonLabel="登録する" />
    </Layout>
  )
}
