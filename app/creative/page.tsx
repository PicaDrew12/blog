import { getAllCreativeWorksByType, CREATIVE_TYPES } from '@/lib/posts'
import CreativeTabs from '@/app/components/CreativeTabs'

export default async function CreativeWorksPage() {
  // Fetch all works grouped by type, in parallel
  const grouped = await Promise.all(
    CREATIVE_TYPES.map(async (type) => ({
      type,
      works: await getAllCreativeWorksByType(type),
    }))
  )

  // Only show tabs for types that have content
  const tabs = grouped.filter((g) => g.works.length > 0)

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <h1
        className="text-3xl font-bold tracking-tight mb-3"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Creative Works
      </h1>
      <p
        className="text-sm mb-10"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
      >
        Poems, prose, worlds, and constructed languages
      </p>

      {tabs.length > 0 ? (
        <CreativeTabs tabs={tabs} />
      ) : (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Nothing published yet.
        </p>
      )}
    </main>
  )
}
