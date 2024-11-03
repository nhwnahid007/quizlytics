"use client"; // Ensure it's treated as a Client Component

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useRouterHook from '@/app/hooks/useRouterHook';
import LoadingSpinner from '@/components/Spinner/LoadingSpinner';

export default function Post({ params }) {
  const { slug: id } = params;
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouterHook();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://quizlytics.jonomukti.org/blog/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    const fetchOtherPosts = async () => {
      try {
        const response = await axios.get('https://quizlytics.jonomukti.org/allBlogs');
        // Filter out the current post by ID and limit to 3 posts
        const otherPosts = response.data.filter((post) => post._id !== id).slice(0, 3);
        setOtherPosts(otherPosts);
      } catch (err) {
        console.error('Failed to load other posts:', err);
      }
    };

    fetchPost();
    fetchOtherPosts();
  }, [id]);

  const handleClick = () => {
    router.push("/quizByLink");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="flex flex-col lg:flex-row justify-around items-start mt-10 container mx-auto gap-10 px-4">
      <div className="container mx-auto mt-10 px-4 py-8 bg-white rounded-lg shadow-lg max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-primary-color">{post.title}</h1>
          <p className="text-lg text-gray-500 mt-2">{post.summary}</p>
        </div>

        <Image 
          src={post.photo} 
          alt={post.title} 
          width={800} 
          height={600} 
          className="w-full h-96 object-cover rounded-lg shadow-md mb-6" 
        />

        <div className="flex items-center mb-8">
          <Image 
            src={post.postOwnerPic} 
            alt={post.postOwner} 
            width={45} 
            height={45} 
            className="rounded-full w-11 h-11 mr-3" 
          />
          <div>
            <p className="text-gray-700 font-medium">{post.postOwner}</p>
            <span className="text-gray-400 text-sm">{post.releaseDate}</span>
          </div>
        </div>

        <div className="text-gray-800 text-lg leading-relaxed space-y-4">
          <p>{post.description}</p>
        </div>

        <div className="mt-10">
          <Link href="/blogs" className="text-primary-color hover:underline">← Back to Blog</Link>
        </div>

        <div className="mt-10 w-full">
          <h2 className="text-2xl font-bold text-primary-color mb-6">Other Posts:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((otherPost) => (
              <div key={otherPost._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center md:items-start">
                <Image 
                  src={otherPost.photo} 
                  alt={otherPost.title} 
                  width={400} 
                  height={300} 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
                <h3 className="text-lg font-semibold text-primary-color text-center md:text-left">{otherPost.title}</h3>
                <p className="text-sm text-gray-500 text-center md:text-left">{otherPost.summary.slice(0,50)}</p>
                <Link href={`/blogs/${otherPost._id}`} className="text-primary-color hover:underline mt-2 inline-block">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
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
