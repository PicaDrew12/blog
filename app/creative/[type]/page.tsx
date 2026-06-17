import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CREATIVE_TYPES,
  CREATIVE_TYPE_LABELS,
  collectionHref,
  getAllCreativeWorksByType,
  getCreativeWorksByTypeAndCollection,
  isCreativeType,
} from '@/lib/posts'

export function generateStaticParams() {
  return CREATIVE_TYPES.map((type) => ({ type }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  if (!isCreativeType(type)) return {}
  return { title: CREATIVE_TYPE_LABELS[type] }
}

export default async function CreativeTypeListPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type: typeParam } = await params
  if (!isCreativeType(typeParam)) notFound()

  const type = typeParam
  const allWorks = await getAllCreativeWorksByType(type)
  const collections = await getCreativeWorksByTypeAndCollection(type)
  const label = CREATIVE_TYPE_LABELS[type]

  if (allWorks.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <Link
          href="/creative"
          className="text-sm hover:underline mb-4 block"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Back to creative works
        </Link>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {label}
        </h1>
        <p className="mt-4" style={{ color: 'var(--text-muted)' }}>
          Nothing published yet in this category.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/creative"
        className="text-sm hover:underline mb-4 block"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to creative works
      </Link>
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {label}
      </h1>

      {Array.from(collections.entries()).map(([collectionName, works]) => {
        const isUncategorized = collectionName === 'Uncategorized'
        const collectionLink = !isUncategorized
          ? collectionHref(type, collectionName)
          : null

        return (
          <section key={collectionName} className="mt-12">
            {collectionLink ? (
              <Link
                href={collectionLink}
                className="text-2xl font-bold tracking-tight mb-6 block hover:underline"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {collectionName}
              </Link>
            ) : (
              <h2
                className="text-2xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {collectionName}
              </h2>
            )}
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
                  <h3
                    className="mt-1 text-lg font-semibold group-hover:underline"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {work.title}
                  </h3>
                  {work.description && (
                    <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
                      {work.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
