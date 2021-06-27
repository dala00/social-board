import { useCallback, useState } from 'react'

export function useFormImage() {
  const [file, setFile] = useState<File>()
  const [url, setUrl] = useState('')

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length == 0) {
      return
    }

    const selectedFile = e.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      const fileData = reader.result as ArrayBuffer
      const blob = new Blob([fileData])
      const url = URL.createObjectURL(blob)
      setUrl(url)
      setFile(selectedFile)
    }
    reader.readAsArrayBuffer(selectedFile)
  }, [])

  return {
    file,
    onChange,
    url,
  }
}
