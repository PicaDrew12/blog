import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getAllBlogTags,
  getBlogPostsByTag,
  segmentToTag,
  tagToSegment,
} from '@/lib/posts'
import BlogTags from '@/app/components/BlogTags'

export async function generateStaticParams() {
  const tags = await getAllBlogTags()
  return tags.map((tag) => ({ tag: tagToSegment(tag) }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag: tagSegment } = await params
  const tag = segmentToTag(tagSegment)
  return { title: `#${tag}`, description: `All posts tagged "${tag}"` }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag: tagSegment } = await params
  const tag = segmentToTag(tagSegment)
  const allTags = await getAllBlogTags()

  if (!allTags.includes(tag)) notFound()

  const posts = await getBlogPostsByTag(tag)

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <Link
        href="/blog"
        className="text-sm hover:underline mb-6 block"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
      >
        ← All writing
      </Link>

      <h1
        className="text-3xl font-bold tracking-tight mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {tag}
      </h1>
      <p
        className="text-sm mb-12"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
      >
        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
      </p>

      <div className="space-y-12">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            {post.coverImage ? (
              <div
                className="relative w-full rounded-lg overflow-hidden mb-4"
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            ) : (
              <div
                className="w-full rounded-lg mb-4"
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: 'var(--surface)',
                }}
              />
            )}

            <p
              className="text-xs mb-2"
              style={{
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <h2
              className="text-xl font-semibold leading-snug group-hover:underline mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {post.title}
            </h2>

            {post.tags && post.tags.length > 0 && (
              <BlogTags tags={post.tags} className="mb-2" />
            )}

            {post.description && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {post.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
