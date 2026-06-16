import Link from 'next/link'
import { getCreativeWorkTypes } from '@/lib/posts'

const typeInfo = {
  poem: { singular: 'Poem', plural: 'Poems', description: 'Poetry collections' },
  prose: { singular: 'Prose', plural: 'Prose', description: 'Short stories and prose pieces' },
  worldbuilding: { singular: 'Worldbuilding', plural: 'Worldbuilding', description: 'Worlds and lore' },
  language: { singular: 'Language', plural: 'Languages', description: 'Linguistic works' },
}

export default async function CreativeWorksPage() {
  const types = await getCreativeWorkTypes()

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm hover:underline mb-4 block" style={{ color: 'var(--text-muted)' }}>
        ← Back to home
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Creative Works</h1>
      <p className="mt-4 text-lg text-neutral-600">Explore my creative collections</p>

      <div className="mt-12 grid gap-6">
        {types.map((type) => {
          const info = typeInfo[type as keyof typeof typeInfo]
          return (
            <Link
              key={type}
              href={`/creative/${type}`}
              className="block group border-t border-b py-6 hover:bg-opacity-50"
              style={{ borderColor: 'var(--border)' }}
            >
              <h2 className="text-2xl font-bold group-hover:underline">{info.plural}</h2>
              <p className="mt-2 text-neutral-600">{info.description}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
