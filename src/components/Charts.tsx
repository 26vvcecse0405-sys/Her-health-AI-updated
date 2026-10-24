import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SymptomEntry } from '../types'

function points(entries: SymptomEntry[], key: 'severity' | 'hotFlashes' | 'sleepHours') {
  return [...entries]
    .reverse()
    .filter((entry) => typeof entry[key] === 'number')
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value: entry[key] as number,
    }))
}

export function TrendChart({ entries, metric, label }: { entries: SymptomEntry[]; metric: 'severity' | 'hotFlashes' | 'sleepHours'; label: string }) {
  const data = points(entries, metric)
  if (data.length === 0) return null
  return (
    <div className="h-56" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(197,208,228,0.15)" vertical={false} />
          <XAxis dataKey="date" stroke="#c5d0e4" fontSize={12} tickLine={false} />
          <YAxis stroke="#c5d0e4" fontSize={12} tickLine={false} width={32} domain={metric === 'severity' ? [0, 10] : undefined} />
          <Tooltip contentStyle={{ background: '#10192d', border: '1px solid #31415f', borderRadius: 12 }} />
          <Line type="monotone" dataKey="value" name={label} stroke="#5eead4" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
