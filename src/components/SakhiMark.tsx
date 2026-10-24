export function SakhiMark({ small = false }: { small?: boolean }) {
  const size = small ? 'h-6 w-6' : 'h-11 w-11'
  return (
    <span className={`sakhi-mark grid ${size} place-items-center rounded-2xl text-white`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={small ? 'h-3.5 w-3.5' : 'h-6 w-6'} fill="currentColor">
        <path d="M12 20s-6.2-3.8-8.4-7.4C2.2 10.2 3.1 7 6.2 6.4 8 6 9.5 6.9 12 9.2c2.5-2.3 4-3.2 5.8-2.8 3.1.6 4 3.8 2.6 6.2C18.2 16.2 12 20 12 20z" />
      </svg>
    </span>
  )
}
