import Link from 'next/link'
import { getAllBlogPosts, getAllCreativeWorks } from '@/lib/posts'
import Tag from '@/app/components/Tag'

export default async function Home() {
  const blogPosts = await getAllBlogPosts()
  const creativeWorks = await getAllCreativeWorks()
  const recentBlog = blogPosts.slice(0, 3)
  const recentCreative = creativeWorks.slice(0, 3)

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Hello everyone</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Welcome to my blog. Here you'll find my latest thoughts and creative works.
        </p>
      </div>

      {/* Recent Blog Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-10">Recent blog posts</h2>
        <div className="space-y-10">
          {recentBlog.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <div className="flex items-center gap-2">
                <p className="text-sm text-neutral-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <Tag type={post.type} />
              </div>
              <h3 className="mt-1 text-xl font-semibold group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-1 text-neutral-600">{post.description}</p>
            </Link>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-8 inline-block font-semibold text-neutral-950 dark:text-neutral-50 hover:underline"
        >
          View all blog posts →
        </Link>
      </div>

      {/* Recent Creative Works */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-10">Recent creative works</h2>
        <div className="space-y-10">
          {recentCreative.map((work) => (
            <Link key={work.slug} href={`/creative/${work.slug}`} className="block group">
              <div className="flex items-center gap-2">
                <p className="text-sm text-neutral-500">
                  {new Date(work.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <Tag type={work.type} />
              </div>
              <h3 className="mt-1 text-xl font-semibold group-hover:underline">
                {work.title}
              </h3>
              <p className="mt-1 text-neutral-600">{work.description}</p>
            </Link>
          ))}
        </div>
        <Link
          href="/creative"
          className="mt-8 inline-block font-semibold text-neutral-950 dark:text-neutral-50 hover:underline"
        >
          View all creative works →
        </Link>
      </div>
    </main>
  )
}
