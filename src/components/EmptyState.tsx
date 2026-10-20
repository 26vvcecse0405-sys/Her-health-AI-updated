import { scenes } from '../data/art'
import { Picture } from './Picture'

const art = {
  empty: scenes.empty,
  success: scenes.success,
  streak: scenes.streak,
} as const

export function EmptyState({
  kind,
  title,
  text,
}: {
  kind: keyof typeof art
  title: string
  text: string
}) {
  const image = art[kind]
  return (
    <div className="grid justify-items-center gap-3 py-4 text-center">
      <Picture src={image.src} alt={image.alt} className="h-40 w-full max-w-sm object-contain" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-muted">{text}</p>
    </div>
  )
}
