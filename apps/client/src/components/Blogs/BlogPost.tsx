"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useRouterHook from "@/app/hooks/useRouterHook";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import { SectionTitleMinimal } from "../Shared/SectionTitle";
import type { BlogRecord } from "@/types/client";
import { getAllBlogs } from "@/services/blog.service";
import { Clock } from "lucide-react";

function getReadingTime(text?: string | null): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost() {
  const [posts, setPosts] = useState<BlogRecord[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouterHook();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPosts(await getAllBlogs());
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter posts based on selected category and search term
  const filteredPosts = posts.filter((post: BlogRecord) => {
    const matchesSlug = selectedSlug ? post.slug === selectedSlug : true;
    const matchesSearch = (post.title ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSlug && matchesSearch;
  });

  // Get unique slugs for the category buttons
  const relevantSlugs = [
    ...new Set(posts.map((post) => post.slug).filter((slug): slug is string => Boolean(slug))),
  ];

  const handleAddNewBlog = () => {
    router.push("/blogs/new");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <SectionTitleMinimal heading={'Our Blog'} subHeading={"Blog posts to help you learn and grow."}></SectionTitleMinimal>

      <div className="flex justify-center mb-4">
        <button
          onClick={handleAddNewBlog}
          className="bg-primary-color text-white font-semibold py-2 px-4 rounded-lg hover:opacity-45 shadow hover:bg-primary-dark transition duration-300"
        >
          Share your thoughts
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-border bg-card text-foreground rounded-lg focus:outline-none focus:border-primary-color"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={() => setSelectedSlug(null)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedSlug === null
              ? "bg-primary-color text-white"
              : "bg-muted text-foreground"
          }`}
        >
          All
        </button>
        {relevantSlugs.map((slug) => (
          <button
            key={slug}
            onClick={() => setSelectedSlug(slug)}
            className={`md:px-4 md:py-2 py-2 px-2 rounded-lg hover:opacity-45 font-semibold transition ${
              selectedSlug === slug
                ? "bg-primary-color text-white"
                : "bg-muted text-foreground"
            }`}
          >
            {slug.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap lg:flex-nowrap lg:space-x-8 justify-around">
        <div className="w-full lg:w-6/10 grid gap-8 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const readTime = getReadingTime(post.description);
              return (
                <div
                  key={post._id}
                  className="flex flex-col sm:flex-row items-start p-4 border border-border rounded-lg bg-card shadow-md hover:shadow-xl transition duration-300 mb-4"
                >
                  <div className="w-full sm:w-1/3 sm:mr-4 mb-4 sm:mb-0">
                    <Image
                      src={post.photo ?? ""}
                      alt={post.title ?? ""}
                      width={400}
                      height={250}
                      className="w-full h-52 lg:h-75 object-cover rounded-lg transform transition duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="w-full sm:w-2/3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {post.slug && (
                        <span className="bg-primary-color/10 text-primary-color text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {post.slug.replace("-", " ")}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="h-3 w-3" />
                        {readTime} min read
                      </span>
                    </div>
                    <div className="justify-start mb-2">
                      <span className="text-foreground font-medium mr-3">
                        {post.postOwner}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        Released on {post.releaseDate}
                      </span>
                    </div>
                    <h2 className="md:text-2xl text-xl font-semibold mb-1 text-foreground">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-2">
                      {post.summary?.slice(0, 100)}
                    </p>
                    <p className="text-muted-foreground/70 text-sm mb-4">
                      {post.description?.slice(0, 200)}
                    </p>
                    <Link
                      href={`/blogs/${post._id}`}
                      className="inline-block px-4 py-2"
                    >
                      <button className="inline-block hover:opacity-45 px-4 py-2 text-white bg-primary-color hover:bg-primary-dark rounded-lg shadow-sm transition duration-300">
                        Read More
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No blog posts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
