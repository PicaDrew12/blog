import Link from 'next/link'
import { getAllCreativeWorks, getCreativeWorkTypes } from '@/lib/posts'

export default async function CreativeWorksPage() {
  const works = await getAllCreativeWorks()
  const types = await getCreativeWorkTypes()

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm hover:underline mb-4 block" style={{ color: 'var(--text-muted)' }}>
        ← Back to home
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Creative Works</h1>

      {types.map((type) => {
        const typeWorks = works.filter((w) => w.type === type)
        // Group by collection
        const collections = new Map<string, typeof typeWorks>()
        typeWorks.forEach((work) => {
          const collectionName = work.collection || 'Uncategorized'
          if (!collections.has(collectionName)) {
            collections.set(collectionName, [])
          }
          collections.get(collectionName)!.push(work)
        })

        return (
          <section key={type} className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight capitalize mb-6">{type}s</h2>
            {Array.from(collections.entries()).map(([collectionName, collectionWorks]) => (
              <div key={collectionName} className="mb-10">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                  {collectionName}
                </h3>
                <div className="space-y-6 pl-4">
                  {collectionWorks.map((work) => (
                    <Link key={work.slug} href={`/creative/${work.slug}`} className="block group">
                      <p className="text-sm text-neutral-500">
                        {new Date(work.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold group-hover:underline">
                        {work.title}
                      </h4>
                      <p className="mt-1 text-neutral-600">{work.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )
      })}
    </main>
  )
}
