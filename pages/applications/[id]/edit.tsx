import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
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
  const { application, setApplication } = useApplicationForm()
  const [loading, setLoading] = useState(true)

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
      await axios.patch(`/api/applications/${id}/update`, application)
      router.push(`/board/${currentUser.uniqueId}/${id}`)
    },
    [application]
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
          <Box mt={4} textAlign="center">
            <Button colorScheme="blue" type="submit" ml={2}>
              更新する
            </Button>
          </Box>
        </form>
      )}
    </Layout>
  )
}
