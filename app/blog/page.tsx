import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts } from '@/lib/posts'

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <h1
        className="text-3xl font-bold tracking-tight mb-12"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Writing
      </h1>

      <div className="space-y-12">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            {/* Cover image */}
            {post.coverImage ? (
              <div
                className="relative w-full rounded-lg overflow-hidden mb-4"
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            ) : (
              <div
                className="w-full rounded-lg mb-4"
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: 'var(--surface)',
                }}
              />
            )}

            {/* Meta */}
            <p
              className="text-xs mb-2"
              style={{
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            {/* Title */}
            <h2
              className="text-xl font-semibold leading-snug group-hover:underline mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {post.title}
            </h2>

            {/* Description */}
            {post.description && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {post.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
