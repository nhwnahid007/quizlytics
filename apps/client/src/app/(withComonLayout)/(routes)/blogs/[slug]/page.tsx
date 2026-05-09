"use client";

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import useRouterHook from '@/app/hooks/useRouterHook';
import LoadingSpinner from '@/components/Spinner/LoadingSpinner';
import type { BlogRecord } from '@/types/client';
import { getAllBlogs, getBlog } from '@/services/blog.service';
import { Clock } from 'lucide-react';

function getReadingTime(text?: string | null): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: id } = use(params);
  const [post, setPost] = useState<BlogRecord | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouterHook();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPost(await getBlog(id));
      } catch {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!post) return;
    const fetchRelated = async () => {
      try {
        const all = await getAllBlogs();
        // Filter by same slug (category), exclude current post
        const sameCat = all.filter(
          (p: BlogRecord) => p._id !== id && p.slug === post.slug
        );
        // If not enough same-category posts, fill with others
        const others = all.filter(
          (p: BlogRecord) => p._id !== id && p.slug !== post.slug
        );
        const combined = [...sameCat, ...others].slice(0, 3);
        setRelatedPosts(combined);
      } catch {
        setRelatedPosts([]);
      }
    };
    fetchRelated();
  }, [id, post]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-destructive py-12">{error}</p>;
  if (!post) return <p className="text-center text-muted-foreground py-12">Post not found.</p>;

  const readTime = getReadingTime(post.description);

  return (
    <div className="flex flex-col lg:flex-row justify-around items-start mt-10 container mx-auto gap-10 px-4">
      <div className="container mx-auto mt-10 px-4 py-8 bg-card rounded-lg shadow-lg max-w-4xl border border-border">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {post.slug && (
              <span className="bg-primary-color/10 text-primary-color text-xs font-semibold px-3 py-1 rounded-full">
                {post.slug.replace("-", " ")}
              </span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="h-3.5 w-3.5" />
              {readTime} min read
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-primary-color">{post.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{post.summary}</p>
        </div>

        <Image 
          src={post.photo ?? ""} 
          alt={post.title ?? ""} 
          width={800} 
          height={600} 
          className="w-full h-96 object-cover rounded-lg shadow-md mb-6" 
        />

        <div className="flex items-center mb-8">
          <Image 
            src={post.postOwnerPic ?? ""} 
            alt={post.postOwner ?? ""} 
            width={45} 
            height={45} 
            className="rounded-full w-11 h-11 mr-3" 
          />
          <div>
            <p className="text-foreground font-medium">{post.postOwner}</p>
            <span className="text-muted-foreground text-sm">{post.releaseDate}</span>
          </div>
        </div>

        <div className="text-foreground text-lg leading-relaxed space-y-4">
          <p>{post.description}</p>
        </div>

        <div className="mt-10">
          <Link href="/blogs" className="text-primary-color hover:underline">← Back to Blog</Link>
        </div>

        {/* Related Posts */}
        <div className="mt-10 w-full">
          <h2 className="text-2xl font-bold text-primary-color mb-6">Related Posts</h2>
          {relatedPosts.length === 0 ? (
            <p className="text-muted-foreground">No related posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((otherPost) => (
                <div key={otherPost._id} className="bg-card p-4 rounded-lg shadow-lg border border-border flex flex-col items-center md:items-start">
                  <Image 
                    src={otherPost.photo ?? ""} 
                    alt={otherPost.title ?? ""} 
                    width={400} 
                    height={300} 
                    className="w-full h-48 object-cover rounded-md mb-4" 
                  />
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {otherPost.slug && (
                      <span className="bg-primary-color/10 text-primary-color text-xs font-semibold px-2 py-0.5 rounded-full">
                        {otherPost.slug.replace("-", " ")}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="h-3 w-3" />
                      {getReadingTime(otherPost.description)} min
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-color text-center md:text-left">{otherPost.title}</h3>
                  <p className="text-sm text-muted-foreground text-center md:text-left">{otherPost.summary?.slice(0,50)}</p>
                  <Link href={`/blogs/${otherPost._id}`} className="text-primary-color hover:underline mt-2 inline-block">
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/blogs">
              <button className="px-4 py-2 bg-primary-color text-white font-medium rounded-lg hover:bg-primary-dark transition duration-300">
                See More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
