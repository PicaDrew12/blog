import fs from 'fs'
import path from 'path'
import {
  CREATIVE_TYPES,
  isCollectionOrdered,
  sortCollectionWorks,
  type CreativeType,
  type PostWithSlug,
} from '@/lib/content-utils'

export type { CreativeType, PostWithSlug }
export {
  CREATIVE_TYPES,
  collectionHref,
  collectionToSegment,
  isCollectionOrdered,
  segmentToCollection,
  segmentToTag,
  sortCollectionWorks,
  tagHref,
  tagToSegment,
} from '@/lib/content-utils'

const BLOG_PATH = path.join(process.cwd(), 'content/blog')
const CREATIVE_BASE_PATH = path.join(process.cwd(), 'content/creative')

export const CREATIVE_TYPE_LABELS: Record<CreativeType, string> = {
  poem: 'Poems',
  prose: 'Prose',
  worldbuilding: 'Worldbuilding',
  language: 'Languages',
}

export const CREATIVE_TYPE_SINGULAR: Record<CreativeType, string> = {
  poem: 'Poem',
  prose: 'Prose',
  worldbuilding: 'Worldbuilding',
  language: 'Language',
}

export type PostMetadata = Omit<PostWithSlug, 'slug'>

export function isCreativeType(value: string): value is CreativeType {
  return (CREATIVE_TYPES as readonly string[]).includes(value)
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

export async function getAllBlogTags(): Promise<string[]> {
  const posts = await getAllBlogPosts()
  const tags = new Set<string>()
  posts.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)))
  return Array.from(tags).sort()
}

export async function getBlogPostsByTag(tag: string) {
  const posts = await getAllBlogPosts()
  return posts.filter((post) => post.tags?.includes(tag))
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
  const allWorks: PostWithSlug[] = []
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

export async function getCreativeWorksByTypeAndCollection(type: CreativeType) {
  const works = await getAllCreativeWorksByType(type)
  const collections = new Map<string, PostWithSlug[]>()
  works.forEach((work) => {
    const collectionName = work.collection || 'Uncategorized'
    if (!collections.has(collectionName)) {
      collections.set(collectionName, [])
    }
    collections.get(collectionName)!.push(work)
  })
  for (const [name, items] of collections) {
    collections.set(name, sortCollectionWorks(items))
  }
  return collections
}

export async function getAllCollectionsForType(
  type: CreativeType
): Promise<string[]> {
  const works = await getAllCreativeWorksByType(type)
  const collections = new Set<string>()
  works.forEach((work) => {
    if (work.collection) collections.add(work.collection)
  })
  return Array.from(collections)
}

export async function getCreativeWorksInCollection(
  type: CreativeType,
  collection: string
) {
  const works = await getAllCreativeWorksByType(type)
  return sortCollectionWorks(works.filter((w) => w.collection === collection))
}

export async function getCollectionNeighbors(
  type: CreativeType,
  slug: string
): Promise<{
  prev: PostWithSlug | null
  next: PostWithSlug | null
  ordered: boolean
}> {
  const work = await getCreativeMetadata(type, slug)
  if (!work.collection) {
    return { prev: null, next: null, ordered: false }
  }

  const collectionWorks = await getCreativeWorksInCollection(
    type,
    work.collection
  )
  if (!isCollectionOrdered(collectionWorks)) {
    return { prev: null, next: null, ordered: false }
  }

  const index = collectionWorks.findIndex((w) => w.slug === slug)
  return {
    prev: index > 0 ? collectionWorks[index - 1] : null,
    next:
      index >= 0 && index < collectionWorks.length - 1
        ? collectionWorks[index + 1]
        : null,
    ordered: true,
  }
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
