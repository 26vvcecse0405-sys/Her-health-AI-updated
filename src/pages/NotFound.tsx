import { scenes } from '../data/art'
import { Picture } from '../components/Picture'
import { Button, useTitle } from '../components/ui'

export function NotFound() {
  useTitle('Not found')
  return (
    <main className="mx-auto grid max-w-xl justify-items-center px-4 py-16 text-center">
      <Picture src={scenes.empty.src} alt={scenes.empty.alt} className="h-48 w-full object-contain" />
      <h1 className="mt-4 text-4xl font-semibold">That page is not on the path.</h1>
      <p className="mt-3 text-muted">The link may be old. The learning journey starts from the home page.</p>
      <Button className="mt-6" to="/">Back home</Button>
    </main>
  )
}
