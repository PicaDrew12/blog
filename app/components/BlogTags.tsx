import Link from 'next/link'
import { tagHref } from '@/lib/content-utils'

type BlogTagsProps = {
  tags: string[]
  clickable?: boolean
  className?: string
}

function TagPill({ tag }: { tag: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded"
      style={{
        backgroundColor: 'var(--accent-soft)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {tag}
    </span>
  )
}

export default function BlogTags({
  tags,
  clickable = false,
  className = '',
}: BlogTagsProps) {
  if (!tags.length) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) =>
        clickable ? (
          <Link
            key={tag}
            href={tagHref(tag)}
            className="transition-opacity hover:opacity-75"
          >
            <TagPill tag={tag} />
          </Link>
        ) : (
          <TagPill key={tag} tag={tag} />
        )
      )}
    </div>
  )
}
