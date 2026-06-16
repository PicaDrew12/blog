import Link from 'next/link'
import { getAllCreativeWorksByType, getCreativeWorksByTypeAndCollection } from '@/lib/posts'

export default async function WorldbuildingListPage() {
  const allWorks = await getAllCreativeWorksByType('worldbuilding')
  const collections = await getCreativeWorksByTypeAndCollection('worldbuilding')

  if (allWorks.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/creative" className="text-sm hover:underline mb-4 block" style={{ color: 'var(--text-muted)' }}>
          ← Back to creative works
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Worldbuilding</h1>
        <p className="mt-4 text-neutral-600">No worldbuilding yet in this category.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/creative" className="text-sm hover:underline mb-4 block" style={{ color: 'var(--text-muted)' }}>
        ← Back to creative works
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Worldbuilding</h1>

      {Array.from(collections.entries()).map(([collectionName, works]) => (
        <section key={collectionName} className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{collectionName}</h2>
          <div className="space-y-6">
            {works.map((work) => (
              <Link
                key={work.slug}
                href={`/creative/worldbuilding/${work.slug}`}
                className="block group border-t border-b py-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <p className="text-sm text-neutral-500">
                  {new Date(work.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <h3 className="mt-1 text-lg font-semibold group-hover:underline">{work.title}</h3>
                <p className="mt-1 text-neutral-600">{work.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
