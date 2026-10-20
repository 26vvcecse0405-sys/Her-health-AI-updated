import { useState, type ReactNode } from 'react'
import { cx } from './ui'

export function Picture({
  src,
  alt,
  className,
  eager = false,
  fallback,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
  fallback?: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return fallback ?? (
      <span className={cx('glass grid min-h-40 place-items-center p-4 text-center text-sm text-muted', className)} role="img" aria-label={alt}>
        {alt}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
