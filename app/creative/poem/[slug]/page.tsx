import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCreativeTypeSlug, getCreativeMetadata } from '@/lib/posts'

export function generateStaticParams() {
  return getCreativeTypeSlug('poem').map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const work = await getCreativeMetadata('poem', slug)
    return { title: work.title, description: work.description }
  } catch {
    return {}
  }
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let content
  try {
    content = await import(`@/content/creative/poem/${slug}.mdx`)
  } catch {
    notFound()
  }

  const { default: Content, metadata } = content

  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
      {/* Breadcrumb */}
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
        <span>Poem</span>
        {metadata.collection && (
          <>
            <span>·</span>
            <span>{metadata.collection}</span>
          </>
        )}
      </nav>

      {/* Header — narrow, centered feel for poetry */}
      <header className="mb-12 max-w-md">
        <h1
          className="text-3xl font-bold tracking-tight leading-snug"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {metadata.title}
        </h1>
        <p
          className="mt-2 text-xs"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
        >
          {new Date(metadata.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </p>
      </header>

      {/* Poem body — narrow column, preserves line breaks */}
      <div className="content-poem max-w-md">
        <Content />
      </div>
    </article>
  )
}
