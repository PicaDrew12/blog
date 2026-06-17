import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CollectionNav from '@/app/components/CollectionNav'
import {
  CREATIVE_TYPES,
  CREATIVE_TYPE_SINGULAR,
  collectionHref,
  getCollectionNeighbors,
  getCreativeMetadata,
  getCreativeTypeSlug,
  isCreativeType,
} from '@/lib/posts'

export async function generateStaticParams() {
  const params: { type: string; slug: string }[] = []
  for (const type of CREATIVE_TYPES) {
    for (const slug of getCreativeTypeSlug(type)) {
      params.push({ type, slug })
    }
  }
  return params
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>
}): Promise<Metadata> {
  const { type, slug } = await params
  if (!isCreativeType(type)) return {}
  try {
    const work = await getCreativeMetadata(type, slug)
    return { title: work.title, description: work.description }
  } catch {
    return {}
  }
}

export default async function CreativeWorkPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>
}) {
  const { type: typeParam, slug } = await params
  if (!isCreativeType(typeParam)) notFound()

  const type = typeParam
  const isPoem = type === 'poem'

  let content
  try {
    content = await import(`@/content/creative/${type}/${slug}.mdx`)
  } catch {
    notFound()
  }

  const { default: Content, metadata } = content
  const { prev, next } = await getCollectionNeighbors(type, slug)
  const typeLabel = CREATIVE_TYPE_SINGULAR[type]

  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
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
          {typeLabel}
        </Link>
        {metadata.collection && (
          <>
            <span>·</span>
            <Link
              href={collectionHref(type, metadata.collection)}
              className="transition-colors hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {metadata.collection}
            </Link>
          </>
        )}
      </nav>

      {isPoem ? (
        <>
          <header className="mb-12 max-w-md">
            <h1
              className="text-3xl font-bold tracking-tight leading-snug"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {metadata.title}
            </h1>
            <p
              className="mt-2 text-xs"
              style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
            >
              {new Date(metadata.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </header>
          <div className="content-poem max-w-md">
            <Content />
          </div>
        </>
      ) : (
        <>
          <header className="mb-10">
            <p
              className="text-xs mb-3"
              style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
            >
              {new Date(metadata.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1
              className="text-3xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {metadata.title}
            </h1>
            {metadata.description && (
              <p
                className="mt-3 text-base leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {metadata.description}
              </p>
            )}
          </header>
          <div className="content">
            <Content />
          </div>
        </>
      )}

      <CollectionNav type={type} prev={prev} next={next} />
    </article>
  )
}
