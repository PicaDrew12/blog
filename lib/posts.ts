import fs from 'fs'
import path from 'path'

const POSTS_PATH = path.join(process.cwd(), 'content/posts')

export type PostMetadata = {
  title: string
  date: string
  description: string
}

export function getPostSlugs() {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export async function getPostMetadata(slug: string) {
  const { metadata } = (await import(`@/content/posts/${slug}.mdx`)) as {
    metadata: PostMetadata
  }
  return { slug, ...metadata }
}

export async function getAllPosts() {
  const posts = await Promise.all(getPostSlugs().map(getPostMetadata))
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}