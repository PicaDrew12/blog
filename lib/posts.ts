import fs from 'fs'
import path from 'path'

const BLOG_PATH = path.join(process.cwd(), 'content/blog')
const CREATIVE_BASE_PATH = path.join(process.cwd(), 'content/creative')

const CREATIVE_TYPES = ['poem', 'prose', 'worldbuilding', 'language'] as const

export type CreativeType = (typeof CREATIVE_TYPES)[number]

export { CREATIVE_TYPES }

export type PostMetadata = {
  title: string
  date: string
  description: string
  type: 'blog' | CreativeType
  collection?: string
  coverImage?: string
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

// Creative works - type-based
export function getCreativeTypeSlug(type: CreativeType) {
  const typePath = path.join(CREATIVE_BASE_PATH, type)
  if (!fs.existsSync(typePath)) return []
  return fs
    .readdirSync(typePath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export async function getCreativeMetadata(type: CreativeType, slug: string) {
  const { metadata } = (await import(`@/content/creative/${type}/${slug}.mdx`)) as {
    metadata: PostMetadata
  }
  return { slug, ...metadata }
}

export async function getAllCreativeWorksByType(type: CreativeType) {
  const slugs = getCreativeTypeSlug(type)
  const works = await Promise.all(slugs.map((slug) => getCreativeMetadata(type, slug)))
  return works.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getAllCreativeWorks() {
  const allWorks: (PostMetadata & { slug: string })[] = []
  for (const type of CREATIVE_TYPES) {
    const works = await getAllCreativeWorksByType(type)
    allWorks.push(...works)
  }
  return allWorks.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getCreativeWorkTypes() {
  const works = await getAllCreativeWorks()
  const types = new Set(works.map((w) => w.type as CreativeType))
  return Array.from(types)
}

// Get available creative types (for grouping by collection)
export async function getCreativeWorksByTypeAndCollection(type: CreativeType) {
  const works = await getAllCreativeWorksByType(type)
  const collections = new Map<string, typeof works>()
  works.forEach((work) => {
    const collectionName = work.collection || 'Uncategorized'
    if (!collections.has(collectionName)) {
      collections.set(collectionName, [])
    }
    collections.get(collectionName)!.push(work)
  })
  return collections
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
