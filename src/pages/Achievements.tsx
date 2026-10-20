import { badgeArt } from '../data/art'
import { BadgeArt } from '../components/Visuals'
import { Picture } from '../components/Picture'
import { Card, Meter, useTitle } from '../components/ui'
import { useApp } from '../context/AppContext'

export function Achievements() {
  const { view } = useApp()
  useTitle('Achievements')
  const earned = view.achievements.filter((item) => item.earnedAt)

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Achievements</p>
        <h1 className="mt-2 text-4xl font-semibold">Earned only when the record says so.</h1>
        <p className="mt-2 max-w-2xl text-muted">{earned.length} of {view.achievements.length} badges are unlocked. Points follow the same saved work.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {view.achievements.map((item) => {
          const art = badgeArt[item.id]
          return (
            <li key={item.id} className={item.earnedAt ? '' : 'opacity-70'}>
              <Card>
                <div className="flex items-center gap-4">
                  {art ? (
                    <Picture src={art.src} alt={art.alt} className="h-20 w-20" fallback={<BadgeArt id={item.id} />} />
                  ) : <BadgeArt id={item.id} />}
                  <div>
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted">{item.earnedAt ? 'Unlocked' : 'Locked'}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                <Meter value={(item.progress / item.target) * 100} />
                <p className="mt-2 text-sm text-muted">{item.progress} / {item.target}{item.earnedAt ? ` · ${new Date(item.earnedAt).toLocaleDateString()}` : ''}</p>
              </Card>
            </li>
          )
        })}
      </ul>
      <Card>
        <h2 className="text-xl font-semibold">{view.points} points</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted">
          {view.pointNotes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </Card>
    </div>
  )
}
