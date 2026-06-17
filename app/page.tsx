import Link from 'next/link'
import Image from 'next/image'
import BlogTags from '@/app/components/BlogTags'
import { getAllBlogPosts, getAllCreativeWorks } from '@/lib/posts'

export default async function Home() {
  const blogPosts = await getAllBlogPosts()
  const creativeWorks = await getAllCreativeWorks()
  const latestArticle = blogPosts[0]
  const recentBlog = blogPosts.slice(1, 4)
  const recentCreative = creativeWorks.slice(0, 5)

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      {/* Intro */}
      <div className="mb-16">
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Hello, I'm [Name]
        </h1>
        <p className="mt-3 text-base" style={{ color: 'var(--text-muted)' }}>
          Welcome to my corner of the internet — articles and creative works.
        </p>
      </div>

      {/* Latest Article */}
      {latestArticle && (
        <section className="mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
          >
            Latest article
          </p>

          <Link
            href={`/blog/${latestArticle.slug}`}
            className="block group"
          >
            {latestArticle.coverImage ? (
              <div
                className="relative w-full rounded-lg overflow-hidden mb-5"
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <Image
                  src={latestArticle.coverImage}
                  alt={latestArticle.title}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            ) : (
              <div
                className="w-full rounded-lg mb-5"
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: 'var(--surface)',
                }}
              />
            )}

            <p
              className="text-xs mb-2"
              style={{
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {new Date(latestArticle.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <h2
              className="text-2xl font-bold leading-snug group-hover:underline mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {latestArticle.title}
            </h2>

            {latestArticle.tags && latestArticle.tags.length > 0 && (
              <BlogTags tags={latestArticle.tags} className="mb-3" />
            )}

            {latestArticle.description && (
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {latestArticle.description}
              </p>
            )}
          </Link>
        </section>
      )}

      {/* Recent Writing */}
      {recentBlog.length > 0 && (
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
          >
            Recent Writing
          </h2>
          <Link
            href="/blog"
            className="text-xs transition-colors hover:underline"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-ui)' }}
          >
            All posts →
          </Link>
        </div>

        <div className="space-y-5">
          {recentBlog.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex gap-4 group items-start"
            >
              {/* Thumbnail */}
              {post.coverImage ? (
                <div
                  className="relative flex-shrink-0 w-20 h-[52px] rounded overflow-hidden"
                  style={{ backgroundColor: 'var(--surface)' }}
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-opacity group-hover:opacity-85"
                    sizes="80px"
                  />
                </div>
              ) : (
                <div
                  className="flex-shrink-0 w-20 h-[52px] rounded"
                  style={{ backgroundColor: 'var(--surface)' }}
                />
              )}

              {/* Text */}
              <div className="min-w-0 pt-0.5">
                <p
                  className="text-xs mb-1"
                  style={{
                    color: 'var(--text-faint)',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <h3
                  className="text-base font-semibold leading-snug group-hover:underline"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {post.title}
                </h3>
                {post.tags && post.tags.length > 0 && (
                  <BlogTags tags={post.tags} className="mt-1.5" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Recent Creative Works */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}
          >
            Creative Works
          </h2>
          <Link
            href="/creative"
            className="text-xs transition-colors hover:underline"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-ui)' }}
          >
            All works →
          </Link>
        </div>

        <div>
          {recentCreative.map((work) => (
            <Link
              key={`${work.type}-${work.slug}`}
              href={`/creative/${work.type}/${work.slug}`}
              className="flex items-center justify-between py-3.5 border-b group"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {work.type}
                </span>
                <span
                  className="text-sm font-medium truncate group-hover:underline"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {work.title}
                </span>
              </div>
              <span
                className="text-xs flex-shrink-0 ml-4"
                style={{
                  color: 'var(--text-faint)',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {new Date(work.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
