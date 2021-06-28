import { Image } from '@chakra-ui/react'
import { ComponentProps } from 'react'

type Props = {
  currentImageUrl: string
  imageUrl?: string
} & ComponentProps<typeof Image>

export default function FormImagePreview(props: Props) {
  const { imageUrl, currentImageUrl, ...others } = props

  if (props.imageUrl) {
    return <Image src={imageUrl} {...others} />
  }

  if (props.currentImageUrl) {
    return <Image src={currentImageUrl} {...others} />
  }

  return <></>
}
