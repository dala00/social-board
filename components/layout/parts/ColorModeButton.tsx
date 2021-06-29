import { IconButton, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { FaMoon } from 'react-icons/fa'
import { MdWbSunny } from 'react-icons/md'

export default function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label="Search database"
      icon={colorMode === 'light' ? <FaMoon /> : <MdWbSunny />}
      onClick={toggleColorMode}
    />
  )
}
