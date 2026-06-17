'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  collectionHref,
  sortCollectionWorks,
  type CreativeType,
  type PostWithSlug,
} from '@/lib/content-utils'

type TabData = {
  type: CreativeType
  works: PostWithSlug[]
}

const typeLabels: Record<CreativeType, string> = {
  poem: 'Poems',
  prose: 'Prose',
  worldbuilding: 'Worldbuilding',
  language: 'Languages',
}

function groupByCollection(works: PostWithSlug[]): Map<string | null, PostWithSlug[]> {
  const map = new Map<string | null, PostWithSlug[]>()
  for (const work of works) {
    const key = work.collection ?? null
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(work)
  }
  for (const [key, items] of map) {
    map.set(key, sortCollectionWorks(items))
  }
  return map
}

function hasCollections(works: PostWithSlug[]) {
  return works.some((w) => !!w.collection)
}

function WorkRow({ work }: { work: PostWithSlug }) {
  return (
    <Link
      href={`/creative/${work.type}/${work.slug}`}
      className="block group py-4 border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className="text-base font-semibold leading-snug group-hover:underline"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {work.title}
          </h3>
          {work.description && (
            <p
              className="mt-0.5 text-sm leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {work.description}
            </p>
          )}
        </div>
        <span
          className="text-xs flex-shrink-0 mt-0.5"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
        >
          {new Date(work.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
          })}
        </span>
      </div>
    </Link>
  )
}

function GroupedWorks({ works }: { works: PostWithSlug[] }) {
  const grouped = groupByCollection(works)

  const named = Array.from(grouped.entries()).filter(([k]) => k !== null) as [
    string,
    PostWithSlug[],
  ][]
  const uncollected = grouped.get(null) ?? []

  return (
    <div>
      {named.map(([collection, items]) => (
        <div key={collection} className="mb-10">
          <Link
            href={collectionHref(items[0].type as CreativeType, collection)}
            className="text-xs font-semibold uppercase tracking-widest mb-1 block hover:underline"
            style={{
              color: 'var(--text-faint)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {collection}
          </Link>
          <div>
            {items.map((w) => (
              <WorkRow key={w.slug} work={w} />
            ))}
          </div>
        </div>
      ))}

      {uncollected.length > 0 && (
        <div className={named.length > 0 ? 'mt-10' : ''}>
          {named.length > 0 && (
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Uncollected
            </h2>
          )}
          <div>
            {uncollected.map((w) => (
              <WorkRow key={w.slug} work={w} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FlatWorks({ works }: { works: PostWithSlug[] }) {
  return (
    <div>
      {works.map((w) => (
        <WorkRow key={w.slug} work={w} />
      ))}
    </div>
  )
}

export default function CreativeTabs({ tabs }: { tabs: TabData[] }) {
  const [active, setActive] = useState(tabs[0]?.type ?? '')
  const activeWorks = tabs.find((t) => t.type === active)?.works ?? []

  return (
    <div>
      <div
        className="flex gap-0 border-b overflow-x-auto mb-8"
        style={{ borderColor: 'var(--border)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActive(tab.type)}
            className="px-4 pb-3 pt-1 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors"
            style={{
              fontFamily: 'var(--font-ui)',
              color: active === tab.type ? 'var(--text)' : 'var(--text-muted)',
              borderBottomColor:
                active === tab.type ? 'var(--accent)' : 'transparent',
              background: 'none',
            }}
          >
            {typeLabels[tab.type] ?? tab.type}
            <span
              className="ml-2 text-xs"
              style={{ color: 'var(--text-faint)' }}
            >
              {tab.works.length}
            </span>
          </button>
        ))}
      </div>

      {activeWorks.length === 0 ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Nothing here yet.
        </p>
      ) : hasCollections(activeWorks) ? (
        <GroupedWorks works={activeWorks} />
      ) : (
        <FlatWorks works={activeWorks} />
      )}
    </div>
  )
}
