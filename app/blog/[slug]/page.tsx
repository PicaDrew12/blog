import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogSlugs } from '@/lib/posts'

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

async function loadBlogPost(slug: string) {
  try {
    return await import(`@/content/blog/${slug}.mdx`)
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await loadBlogPost(slug)
  if (!post) return {}
  return { title: post.metadata.title, description: post.metadata.description }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await loadBlogPost(slug)
  if (!post) notFound()

  const { default: Post, metadata } = post

  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
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
          className="text-4xl font-bold tracking-tight leading-tight sm:text-5xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {metadata.title}
        </h1>

        {metadata.description && (
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {metadata.description}
          </p>
        )}

        {metadata.coverImage && (
          <div
            className="mt-8 relative w-full rounded-lg overflow-hidden"
            style={{ aspectRatio: '16/9' }}
          >
            <Image
              src={metadata.coverImage}
              alt={metadata.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}
      </header>

      {/* Custom content class — no Tailwind typography plugin */}
      <div className="content">
        <Post />
      </div>
    </article>
  )
}
