type Recognize = (
  image: Blob | HTMLCanvasElement,
  langs?: string,
  options?: { logger?: (message: { status: string; progress: number }) => void },
) => Promise<{ data: { text?: string } }>

export async function readImage(image: Blob | HTMLCanvasElement, onProgress: (value: number) => void) {
  const loaded = (await import('tesseract.js')) as { recognize?: Recognize; default?: { recognize?: Recognize } }
  const recognize = loaded.recognize ?? loaded.default?.recognize
  if (!recognize) throw new Error('The OCR library did not load.')
  const result = await recognize(image, 'eng', {
    logger: (message) => {
      if (message.status === 'recognizing text') onProgress(message.progress || 0)
    },
  })
  return (result.data.text ?? '').trim()
}
