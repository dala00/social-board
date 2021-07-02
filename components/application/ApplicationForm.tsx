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
import React, { useCallback } from 'react'
import ApplicationEditUrls from '../application/ApplicationEditUrls'
import FormImagePreview from '../form/FormImagePreview'
import { useApplicationForm } from '../../hooks/application/application_form'
import { getIconUrl } from '../../models/Application'

type Props = {
  loading: boolean
  onSave: () => void
}

export default function ApplicationForm(props: Props) {
  const {
    application,
    setApplication,
    newApplicationUrls,
    iconImage,
    deletingApplicationUrlIds,
  } = useApplicationForm()
  const {
    url: iconImageUrl,
    file: iconFile,
    onChange: onIconImageChanged,
  } = iconImage

  const save = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      props.onSave()
    },
    [
      application,
      iconImageUrl,
      iconFile,
      newApplicationUrls,
      deletingApplicationUrlIds,
    ]
  )

  return (
    <>
      {props.loading ? (
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
    </>
  )
}
