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
    <article className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/blog"
        className="mb-8 block text-sm hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to blog
      </Link>

      <header className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <p className="text-sm text-neutral-500">
            {new Date(metadata.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <Tag type={metadata.type} />
        </div>

        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
          {metadata.title}
        </h1>

        {metadata.coverImage && (
  <div className="my-8">
    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <Image
        src={metadata.coverImage}
        alt={metadata.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 672px"
      />
    </div>
  </div>
)}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <Post />
      </div>
    </article>
  )
}