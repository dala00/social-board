import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Image,
  Input,
  Spinner,
  Textarea,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ApplicationEditUrls from '../../../components/application/ApplicationEditUrls'
import FormImagePreview from '../../../components/form/FormImagePreview'
import Layout from '../../../components/layout/Layout'
import { useApplicationForm } from '../../../hooks/application/application_form'
import { useAuthentication } from '../../../hooks/authentication'
import { useFormImage } from '../../../hooks/form/image'
import { Application, getIconUrl } from '../../../models/Application'

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
  const { application, setApplication, newApplicationUrls } =
    useApplicationForm()
  const [loading, setLoading] = useState(true)
  const {
    url: iconImageUrl,
    file: iconFile,
    onChange: onIconImageChanged,
  } = useFormImage()

  const initialize = useCallback(async () => {
    if (!id) {
      return
    }
    const response = await axios.get<GetApplicationResponseData>(
      `/api/applications/${id}/get-for-owner`
    )
    setApplication(response.data.application)
    setLoading(false)
  }, [id])

  useEffect(() => {
    initialize()
  }, [id])

  const save = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
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
      await axios.patch(`/api/applications/${id}/update`, form, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      toast.success('更新しました。')
      router.push(`/board/${currentUser.uniqueId}/${id}`)
    },
    [application, iconImageUrl, iconFile, newApplicationUrls]
  )

  return (
    <Layout>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <form onSubmit={save}>
          <FormControl id="name">
            <FormLabel>アプリケーション名</FormLabel>
            <Input
              type="name"
              value={application.name}
              onChange={(e) =>
                setApplication({ ...application, name: e.target.value })
              }
              required
            />
          </FormControl>
          <FormControl id="description" mt={4}>
            <FormLabel>説明</FormLabel>
            <Textarea
              width="100%"
              rows={10}
              value={application.description}
              onChange={(e) =>
                setApplication({ ...application, description: e.target.value })
              }
              required
            />
          </FormControl>
          <FormControl id="image">
            <FormLabel>アイコンファイル</FormLabel>
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={onIconImageChanged}
              />
            </Box>
            <FormImagePreview
              imageUrl={iconImageUrl}
              currentImageUrl={
                application.iconFileName === ''
                  ? undefined
                  : getIconUrl(application)
              }
              width={24}
              height={24}
              mt={2}
            />
          </FormControl>
          <Box mt={4}>
            <ApplicationEditUrls />
          </Box>
          <Box mt={4} textAlign="center">
            <Button colorScheme="blue" type="submit" mt={2}>
              更新する
            </Button>
          </Box>
        </form>
      )}
    </Layout>
  )
}
