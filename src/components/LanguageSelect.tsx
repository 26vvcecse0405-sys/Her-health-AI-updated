import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { languageMeta, languages } from '../languages'
import type { Lang } from '../types'

export function LanguageSelect({ lang, label, onChange }: { lang: Lang; label: string; onChange: (lang: Lang) => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(lang)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef(false)
  const activeRef = useRef(lang)
  const typed = useRef('')
  const typedTimer = useRef(0)
  openRef.current = open
  activeRef.current = active
  const labelId = useId()
  const listId = useId()
  const current = languageMeta(lang)

  function optionId(id: Lang) {
    return `${listId}-${id}`
  }

  function close() {
    openRef.current = false
    activeRef.current = lang
    setOpen(false)
    setActive(lang)
    typed.current = ''
  }

  function choose(next: Lang) {
    openRef.current = false
    activeRef.current = next
    onChange(next)
    setOpen(false)
    setActive(next)
    typed.current = ''
    buttonRef.current?.focus()
  }

  function move(index: number) {
    const next = languages[Math.max(0, Math.min(languages.length - 1, index))]
    if (!next) return
    activeRef.current = next.id
    setActive(next.id)
  }

  useEffect(() => {
    if (!open) return
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open, lang])

  useEffect(() => {
    if (!open) return
    document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
  }, [open, active, listId])

  function onKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    const index = languages.findIndex((item) => item.id === activeRef.current)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const next = !openRef.current
        ? index
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? languages.length - 1
            : event.key === 'ArrowDown'
              ? index + 1
              : index - 1
      openRef.current = true
      setOpen(true)
      move(next)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (openRef.current) choose(activeRef.current)
      else {
        activeRef.current = lang
        openRef.current = true
        setActive(lang)
        setOpen(true)
      }
      return
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      if (openRef.current) close()
      return
    }
    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault()
      typed.current = `${typed.current}${event.key}`.toLowerCase()
      window.clearTimeout(typedTimer.current)
      typedTimer.current = window.setTimeout(() => { typed.current = '' }, 700)
      const match = languages.find((item) => item.native.toLowerCase().startsWith(typed.current) || item.english.toLowerCase().startsWith(typed.current))
      if (match) {
        openRef.current = true
        activeRef.current = match.id
        setOpen(true)
        setActive(match.id)
      }
    }
  }

  return (
    <div className="lang-control" ref={rootRef}>
      <span className="lang-control-label" id={labelId}>{label}</span>
      <button
        ref={buttonRef}
        type="button"
        className="lang-select"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${optionId(current.id)}-value`}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => {
          const nextOpen = !openRef.current
          openRef.current = nextOpen
          activeRef.current = lang
          setActive(lang)
          setOpen(nextOpen)
        }}
        onKeyDown={onKeyDown}
      >
        <Globe size={16} aria-hidden="true" />
        <span className="lang-select-value" id={`${optionId(current.id)}-value`} lang={current.id} dir={current.dir}>{current.native}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open ? (
        <ul id={listId} className="lang-menu-list" role="listbox" aria-labelledby={labelId} tabIndex={-1}>
          {languages.map((item) => (
            <li key={item.id} role="presentation">
              <div
                id={optionId(item.id)}
                role="option"
                aria-selected={item.id === lang}
                className={`lang-menu-option${item.id === active ? ' is-active' : ''}`}
                lang={item.id}
                dir={item.dir}
                onMouseEnter={() => setActive(item.id)}
                onClick={() => choose(item.id)}
              >
                <span>{item.native}</span>
                <span className="lang-menu-meta">
                  {item.native === item.english ? null : item.english}
                  {item.id === lang ? <Check size={15} aria-hidden="true" /> : null}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
