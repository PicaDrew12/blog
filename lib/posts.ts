import fs from 'fs'
import path from 'path'

const BLOG_PATH = path.join(process.cwd(), 'content/blog')
const CREATIVE_PATH = path.join(process.cwd(), 'content/creative')

export type PostMetadata = {
  title: string
  date: string
  description: string
  type: 'blog' | 'poem' | 'prose' | 'worldbuilding' | 'language'
  collection?: string
}

// Blog posts
export function getBlogSlugs() {
  return fs
    .readdirSync(BLOG_PATH)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export async function getBlogMetadata(slug: string) {
  const { metadata } = (await import(`@/content/blog/${slug}.mdx`)) as {
    metadata: PostMetadata
  }
  return { slug, ...metadata }
}

export async function getAllBlogPosts() {
  const posts = await Promise.all(getBlogSlugs().map(getBlogMetadata))
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

// Creative works
export function getCreativeSlugs() {
  return fs
    .readdirSync(CREATIVE_PATH)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export async function getCreativeMetadata(slug: string) {
  const { metadata } = (await import(`@/content/creative/${slug}.mdx`)) as {
    metadata: PostMetadata
  }
  return { slug, ...metadata }
}

export async function getAllCreativeWorks() {
  const works = await Promise.all(getCreativeSlugs().map(getCreativeMetadata))
  return works.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getCreativeWorksByType(type: string) {
  const works = await getAllCreativeWorks()
  return works.filter((work) => work.type === type)
}

export async function getCreativeWorkTypes() {
  const works = await getAllCreativeWorks()
  const types = new Set(works.map((w) => w.type))
  return Array.from(types)
}

// Legacy support - returns blog posts
export function getPostSlugs() {
  return getBlogSlugs()
}

export async function getPostMetadata(slug: string) {
  return getBlogMetadata(slug)
}

export async function getAllPosts() {
  return getAllBlogPosts()
}