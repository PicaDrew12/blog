export const CREATIVE_TYPES = ['poem', 'prose', 'worldbuilding', 'language'] as const

export type CreativeType = (typeof CREATIVE_TYPES)[number]

export type PostWithSlug = {
  slug: string
  title: string
  date: string
  description: string
  type: 'blog' | CreativeType
  tags?: string[]
  collection?: string
  order?: number
  coverImage?: string
}

export function tagToSegment(tag: string): string {
  return encodeURIComponent(tag)
}

export function segmentToTag(segment: string): string {
  return decodeURIComponent(segment)
}

export function tagHref(tag: string): string {
  return `/blog/tags/${tagToSegment(tag)}`
}

export function collectionToSegment(collection: string): string {
  return encodeURIComponent(collection)
}

export function segmentToCollection(segment: string): string {
  return decodeURIComponent(segment)
}

export function collectionHref(type: CreativeType, collection: string): string {
  return `/creative/${type}/collection/${collectionToSegment(collection)}`
}

export function isCollectionOrdered(works: PostWithSlug[]): boolean {
  return works.some((w) => w.order !== undefined)
}

export function sortCollectionWorks(works: PostWithSlug[]): PostWithSlug[] {
  const hasOrder = isCollectionOrdered(works)
  if (!hasOrder) {
    return [...works].sort((a, b) => (a.date < b.date ? 1 : -1))
  }
  return [...works].sort((a, b) => {
    const aOrder = a.order ?? Infinity
    const bOrder = b.order ?? Infinity
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.date < b.date ? 1 : -1
  })
}
