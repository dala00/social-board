import { Storage } from '@google-cloud/storage'
import uniqid from 'uniqid'

export async function upload(bucketName: string, path: string, buffer: Buffer) {
  const storage = new Storage()
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(path)
  return await file.save(buffer).catch((error) => error)
}

export function generateUniqueFileName(originalFileName: string) {
  const parts = originalFileName.split(/\./)
  const extension = parts[parts.length - 1]
  return `${uniqid()}.${extension}`
}
