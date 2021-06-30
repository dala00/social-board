import { Box, Button, FormLabel } from '@chakra-ui/react'
import React from 'react'
import { useApplicationForm } from '../../hooks/application/application_form'
import ApplicationEditUrl from './ApplicationEditUrl'

export default function ApplicationEditUrls() {
  const { newApplicationUrls, addNewApplicationUrl, setNewApplicationUrl } =
    useApplicationForm()

  return (
    <Box>
      <FormLabel>URL</FormLabel>

      {newApplicationUrls.map((applicationUrl, index) => (
        <ApplicationEditUrl
          applicationUrl={applicationUrl}
          onChanged={(applicationUrl) =>
            setNewApplicationUrl(index, applicationUrl)
          }
        />
      ))}

      <Box mt={4} textAlign="center">
        <Button
          colorScheme="blue"
          type="button"
          onClick={() => addNewApplicationUrl()}
        >
          追加する
        </Button>
      </Box>
    </Box>
  )
}
