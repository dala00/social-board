import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
} from '@chakra-ui/react'
import React from 'react'
import { MdDelete } from 'react-icons/md'
import { ApplicationUrl } from '../../models/ApplicationUrl'
import Card from '../common/Card'

type Props = {
  applicationUrl: ApplicationUrl
  onChanged: (applicationUrl: ApplicationUrl) => void
  onDelete: () => void
}

export default function ApplicationEditUrl(props: Props) {
  return (
    <Card position="relative">
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

      <IconButton
        aria-label="Edit"
        icon={<MdDelete />}
        backgroundColor="red.500"
        color="gray.50"
        isRound={true}
        type="button"
        position="absolute"
        top={0}
        right={0}
        onClick={props.onDelete}
      />
    </Card>
  )
}
