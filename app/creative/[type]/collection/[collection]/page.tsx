import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CREATIVE_TYPES,
  CREATIVE_TYPE_LABELS,
  CREATIVE_TYPE_SINGULAR,
  collectionToSegment,
  getAllCollectionsForType,
  getCreativeWorksInCollection,
  isCreativeType,
  segmentToCollection,
} from '@/lib/posts'

export async function generateStaticParams() {
  const params: { type: string; collection: string }[] = []
  for (const type of CREATIVE_TYPES) {
    const collections = await getAllCollectionsForType(type)
    for (const collection of collections) {
      params.push({ type, collection: collectionToSegment(collection) })
    }
  }
  return params
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; collection: string }>
}) {
  const { type, collection: collectionSegment } = await params
  if (!isCreativeType(type)) return {}
  const collection = segmentToCollection(collectionSegment)
  return {
    title: `${collection} — ${CREATIVE_TYPE_LABELS[type]}`,
    description: `All ${CREATIVE_TYPE_LABELS[type].toLowerCase()} in "${collection}"`,
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ type: string; collection: string }>
}) {
  const { type: typeParam, collection: collectionSegment } = await params
  if (!isCreativeType(typeParam)) notFound()

  const type = typeParam
  const collection = segmentToCollection(collectionSegment)
  const knownCollections = await getAllCollectionsForType(type)

  if (!knownCollections.includes(collection)) notFound()

  const works = await getCreativeWorksInCollection(type, collection)
  const typeLabel = CREATIVE_TYPE_LABELS[type]
  const typeSingular = CREATIVE_TYPE_SINGULAR[type]

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <nav
        className="flex items-center gap-1.5 text-xs mb-10 flex-wrap"
        style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
      >
        <Link
          href="/creative"
          className="transition-colors hover:underline"
          style={{ color: 'var(--text-muted)' }}
        >
          Creative
        </Link>
        <span>·</span>
        <Link
          href={`/creative/${type}`}
          className="transition-colors hover:underline"
          style={{ color: 'var(--text-muted)' }}
        >
          {typeSingular}
        </Link>
        <span>·</span>
        <span>{collection}</span>
      </nav>

      <h1
        className="text-3xl font-bold tracking-tight mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {collection}
      </h1>
      <p
        className="text-sm mb-12"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
      >
        {works.length} {works.length === 1 ? 'piece' : 'pieces'} · {typeLabel}
      </p>

      <div className="space-y-6">
        {works.map((work) => (
          <Link
            key={work.slug}
            href={`/creative/${type}/${work.slug}`}
            className="block group border-t border-b py-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <p
              className="text-sm"
              style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
            >
              {new Date(work.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h2
              className="mt-1 text-lg font-semibold group-hover:underline"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {work.title}
            </h2>
            {work.description && (
              <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
                {work.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
