import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { ApplicationUrl } from '../../models/ApplicationUrl'

type Props = {
  applicationUrl: ApplicationUrl
  onChanged: (applicationUrl: ApplicationUrl) => void
}

export default function ApplicationEditUrl(props: Props) {
  return (
    <Box>
      <FormControl id="name">
        <FormLabel>名前</FormLabel>
        <Input
          type="name"
          value={props.applicationUrl.name}
          onChange={(e) =>
            props.onChanged({ ...props.applicationUrl, name: e.target.value })
          }
          required
        />
      </FormControl>
      <FormControl id="url">
        <FormLabel>URL</FormLabel>
        <Input
          type="url"
          value={props.applicationUrl.url}
          onChange={(e) =>
            props.onChanged({ ...props.applicationUrl, url: e.target.value })
          }
          required
        />
      </FormControl>
    </Box>
  )
}
