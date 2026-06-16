import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/posts'
import Tag from '@/app/components/Tag'

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm hover:underline mb-4 block" style={{ color: 'var(--text-muted)' }}>
        ← Back to home
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <div className="mt-10 space-y-10">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <div className="flex items-center gap-2">
              <p className="text-sm text-neutral-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              <Tag type={post.type} />
            </div>
            <h2 className="mt-1 text-xl font-semibold group-hover:underline">
              {post.title}
            </h2>
            <p className="mt-1 text-neutral-600">{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}