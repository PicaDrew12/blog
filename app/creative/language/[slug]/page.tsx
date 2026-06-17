import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCreativeTypeSlug, getCreativeMetadata } from '@/lib/posts'

export function generateStaticParams() {
  return getCreativeTypeSlug('language').map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const work = await getCreativeMetadata('language', slug)
    return { title: work.title, description: work.description }
  } catch {
    return {}
  }
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let content
  try {
    content = await import(`@/content/creative/language/${slug}.mdx`)
  } catch {
    notFound()
  }

  const { default: Content, metadata } = content

  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
      <nav
        className="flex items-center gap-1.5 text-xs mb-10"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
      >
        <Link
          href="/creative"
          className="transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          Creative
        </Link>
        <span>·</span>
        <span>Language</span>
      </nav>

      <header className="mb-10">
        <p
          className="text-xs mb-3"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
        >
          {new Date(metadata.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1
          className="text-3xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {metadata.title}
        </h1>
        {metadata.description && (
          <p
            className="mt-3 text-base leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {metadata.description}
          </p>
        )}
      </header>

      <div className="content">
        <Content />
      </div>
    </article>
  )
}
