'use client'

export default function Tag({ type }: { type: string }) {
  const typeConfig: Record<string, { bg: string; text: string }> = {
    blog: { bg: 'var(--accent-soft)', text: 'var(--accent)' },
    poem: { bg: '#E8D5C4', text: '#6B4423' },
    prose: { bg: '#D4E5D8', text: '#2F5233' },
    worldbuilding: { bg: '#D5D9E8', text: '#2E3A5F' },
    language: { bg: '#E8D4E5', text: '#5F2E52' },
  }

  const config = typeConfig[type] || typeConfig.blog

  return (
    <span
      className="text-xs font-medium px-2 py-1 rounded"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {type}
    </span>
  )
}
