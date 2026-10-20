import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useApp } from '../context/AppContext'

function useTip() {
  const { theme } = useApp()
  return theme === 'light'
    ? { background: '#ffffff', border: '1px solid #d5deee', borderRadius: 12, color: '#0f172a' }
    : { background: '#12182c', border: '1px solid #2a3658', borderRadius: 12, color: '#e8eefc' }
}

export function MinutesChart({ data }: { data: { day: string; minutes: number }[] }) {
  const tip = useTip()
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(34,211,238,0.08)' }} />
          <Bar dataKey="minutes" name="Minutes" fill="#22d3ee" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SkillCompareChart({ data }: { data: { skill: string; you: number; target: number }[] }) {
  const tip = useTip()
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
          <XAxis dataKey="skill" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip contentStyle={tip} />
          <Bar dataKey="you" name="Demonstrated" fill="#22d3ee" radius={[8, 8, 0, 0]} />
          <Bar dataKey="target" name="Target" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ScoreLine({ data }: { data: { label: string; score: number }[] }) {
  const tip = useTip()
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip contentStyle={tip} />
          <Line type="monotone" dataKey="score" name="Score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
