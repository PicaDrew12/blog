import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCreativeTypeSlug, getCreativeMetadata } from '@/lib/posts'

export function generateStaticParams() {
  const slugs = getCreativeTypeSlug('worldbuilding')
  return slugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const work = await getCreativeMetadata('worldbuilding', slug)
    return { title: work.title, description: work.description }
  } catch {
    return {}
  }
}

export default async function WorldbuildingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let content
  try {
    content = await import(`@/content/creative/worldbuilding/${slug}.mdx`)
  } catch {
    notFound()
  }

  const { default: Content, metadata } = content

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/creative/worldbuilding"
        className="text-sm hover:underline mb-8 block"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to worldbuilding
      </Link>

      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm text-neutral-500">
          {new Date(metadata.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {metadata.collection && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Collection: <span className="font-medium">{metadata.collection}</span>
          </p>
        )}
      </div>
      <Content />
    </article>
  )
}
