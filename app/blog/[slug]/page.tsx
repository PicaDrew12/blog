import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogSlugs } from '@/lib/posts'
import Tag from '@/app/components/Tag'

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
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await loadBlogPost(slug)
  if (!post) return {}
  return { title: post.metadata.title, description: post.metadata.description }
}

export default async function PostPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await loadBlogPost(slug)
  if (!post) notFound()

  const { default: Post, metadata } = post

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-16">
      <Link href="/blog" className="text-sm hover:underline mb-8 block" style={{ color: 'var(--text-muted)' }}>
        ← Back to blog
      </Link>
      <h1 className="text-5xl font-bold tracking-tight">
  {metadata.title}
</h1>
      <div className="mb-6 flex items-center gap-2">
        <p className="text-sm text-neutral-500">
          {new Date(metadata.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
        <Tag type={metadata.type} />
      </div>

      {metadata.coverImage && (
        <div className="not-prose mb-8 w-full" style={{ aspectRatio: '3/2' }}>
          <Image
            src={metadata.coverImage}
            alt="Cover image"
            width={1200}
            height={675}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      )}

      <Post />
    </article>
  )
}