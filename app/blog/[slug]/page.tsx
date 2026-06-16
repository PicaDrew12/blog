import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostSlugs } from '@/lib/posts'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

async function loadPost(slug: string) {
  try {
    return await import(`@/content/posts/${slug}.mdx`)
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) return {}
  return { title: post.metadata.title, description: post.metadata.description }
}

export default async function PostPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) notFound()

  const { default: Post, metadata } = post

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-16">
      <h1>{metadata.title}</h1>
      <p className="text-sm text-neutral-500">
        {new Date(metadata.date).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
      </p>
      <Post />
    </article>
  )
}