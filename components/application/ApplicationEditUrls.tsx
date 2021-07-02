import { Box, Button, FormLabel } from '@chakra-ui/react'
import React from 'react'
import { useApplicationForm } from '../../hooks/application/application_form'
import ApplicationEditUrl from './ApplicationEditUrl'

export default function ApplicationEditUrls() {
  const {
    application,
    deleteApplicationUrl,
    deleteNewApplicationUrl,
    setApplicationUrl,
    newApplicationUrls,
    addNewApplicationUrl,
    setNewApplicationUrl,
  } = useApplicationForm()

  return (
    <Box>
      <FormLabel>URL</FormLabel>

      {application.applicationUrls.map((applicationUrl, index) => (
        <Box key={applicationUrl.id} my={4}>
          <ApplicationEditUrl
            applicationUrl={applicationUrl}
            onChanged={(applicationUrl) =>
              setApplicationUrl(index, applicationUrl)
            }
            onDelete={() => deleteApplicationUrl(applicationUrl.id)}
          />
        </Box>
      ))}

      {newApplicationUrls.map((applicationUrl, index) => (
        <Box key={index} my={4}>
          <ApplicationEditUrl
            applicationUrl={applicationUrl}
            onChanged={(applicationUrl) =>
              setNewApplicationUrl(index, applicationUrl)
            }
            onDelete={() => deleteNewApplicationUrl(index)}
          />
        </Box>
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
