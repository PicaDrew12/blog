import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCreativeSlugs } from '@/lib/posts'

export function generateStaticParams() {
  return getCreativeSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

async function loadCreativeWork(slug: string) {
  try {
    return await import(`@/content/creative/${slug}.mdx`)
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const work = await loadCreativeWork(slug)
  if (!work) return {}
  return { title: work.metadata.title, description: work.metadata.description }
}

export default async function CreativeWorkPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = await loadCreativeWork(slug)
  if (!work) notFound()

  const { default: Content, metadata } = work

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-16">
      <Link href="/creative" className="text-sm hover:underline mb-4 block" style={{ color: 'var(--text-muted)' }}>
        ← Back to creative works
      </Link>
      
      <h1>{metadata.title}</h1>
      <div className="flex flex-col gap-2">
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
