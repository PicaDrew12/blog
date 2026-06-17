import Link from 'next/link'
import type { CreativeType, PostWithSlug } from '@/lib/content-utils'

type CollectionNavProps = {
  type: CreativeType
  prev: PostWithSlug | null
  next: PostWithSlug | null
}

function NavLink({
  work,
  type,
  direction,
}: {
  work: PostWithSlug
  type: CreativeType
  direction: 'prev' | 'next'
}) {
  const href = `/creative/${type}/${work.slug}`
  const isPrev = direction === 'prev'

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm transition-colors hover:underline min-w-0 ${
        isPrev ? 'justify-start' : 'justify-end text-right'
      }`}
      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
    >
      {isPrev && (
        <span className="flex-shrink-0" aria-hidden="true">
          ←
        </span>
      )}
      <span className="truncate">{work.title}</span>
      {!isPrev && (
        <span className="flex-shrink-0" aria-hidden="true">
          →
        </span>
      )}
    </Link>
  )
}

export default function CollectionNav({ type, prev, next }: CollectionNavProps) {
  if (!prev && !next) return null

  return (
    <nav
      className="mt-16 pt-8 border-t grid grid-cols-2 gap-4"
      style={{ borderColor: 'var(--border)' }}
      aria-label="Collection navigation"
    >
      <div className="min-w-0">
        {prev && <NavLink work={prev} type={type} direction="prev" />}
      </div>
      <div className="min-w-0">
        {next && <NavLink work={next} type={type} direction="next" />}
      </div>
    </nav>
  )
}
