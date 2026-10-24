import type { OriginId } from '../types'
import type { RankedHospital } from '../services/rank'
import { origins } from '../data/hospitals'

function x(value: number) {
  return 70 + (value / 100) * 860
}
function y(value: number) {
  return 46 + (value / 100) * 520
}

export function HospitalMap({ originId, ranked, activeId, onPick }: { originId: OriginId; ranked: RankedHospital[]; activeId: string; onPick: (id: string) => void }) {
  const origin = origins.find((item) => item.id === originId) ?? origins[0]!
  return (
    <div className="map-wrap glass">
      <svg viewBox="0 0 1000 640" role="img" aria-label="Schematic map of fictional hospitals">
        <rect width="1000" height="640" fill="#0b1528" />
        <path d="M40 520 C 220 480, 380 560, 620 470 S 900 390, 980 430" fill="none" stroke="rgba(125,211,252,0.35)" strokeWidth="18" />
        <text x="48" y="36" fill="#c5d0e4" fontSize="16">Schematic demo map. Not a live road map.</text>
        {ranked.map((row) => {
          const hx = x(row.hospital.map.x)
          const hy = y(row.hospital.map.y)
          const ox = x(origin.map.x)
          const oy = y(origin.map.y)
          const bend = row.chosenRoute.id.length * 18
          return (
            <path
              key={row.hospital.id}
              d={`M ${ox} ${oy} Q ${(ox + hx) / 2} ${(oy + hy) / 2 - bend} ${hx} ${hy}`}
              fill="none"
              stroke={row.hospital.id === activeId ? '#5eead4' : 'rgba(216,180,254,0.35)'}
              strokeWidth={row.hospital.id === activeId ? 4 : 2}
              strokeDasharray={row.routes.length > 1 ? '0' : '7 6'}
            />
          )
        })}
        <g>
          <circle cx={x(origin.map.x)} cy={y(origin.map.y)} r="11" fill="#f4f7fb" />
          <text x={x(origin.map.x) + 16} y={y(origin.map.y) + 4} fill="#f4f7fb" fontSize="14">You · sample</text>
        </g>
        {ranked.map((row, index) => {
          const active = row.hospital.id === activeId
          return (
            <g
              key={`${row.hospital.id}-pin`}
              role="button"
              tabIndex={0}
              aria-label={row.hospital.name}
              onClick={() => onPick(row.hospital.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onPick(row.hospital.id)
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={x(row.hospital.map.x)} cy={y(row.hospital.map.y)} r={active ? 16 : 12} fill={active ? '#5eead4' : '#10192d'} stroke="#d8b4fe" strokeWidth="2" />
              <text x={x(row.hospital.map.x)} y={y(row.hospital.map.y) + 4} textAnchor="middle" fontSize="12" fill={active ? '#041018' : '#f4f7fb'}>{index + 1}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
