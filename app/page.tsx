import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default async function Home() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 5)

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Hello everyone</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Welcome to my blog. Here you'll find my latest thoughts and posts.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-10">Recent posts</h2>
        <div className="space-y-10">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <p className="text-sm text-neutral-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              <h3 className="mt-1 text-xl font-semibold group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-1 text-neutral-600">{post.description}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="mt-12 inline-block font-semibold text-neutral-950 dark:text-neutral-50 hover:underline"
        >
          View all posts →
        </Link>
      </div>
    </main>
  )
}
