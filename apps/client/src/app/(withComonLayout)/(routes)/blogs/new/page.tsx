'use client'
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { SectionTitleMinimal } from '@/components/Shared/SectionTitle';
import type { ChangeEvent, FormEvent } from 'react';
import type { InsertBlog } from '@quizlytics/types';
const img_hosting_key = process.env.NEXT_PUBLIC_IMG_HOSTING_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

interface ImgBBResponse {
  data: {
    url: string;
  };
}

const BlogFormPage = () => {
  const { data: session } = useSession();
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    slug: '', // default category
    summary: '',
    description: '',
    photo: '',
    releaseDate: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD format
  });
 
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      const response = await axios.post<ImgBBResponse>(img_hosting_api, imageFormData);
      setFormData({ ...formData, photo: response.data.data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData: InsertBlog = {
      ...formData,
      postOwner: session?.user?.name || 'Anonymous',
      postOwnerPic: session?.user?.image || '',
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blog`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Blog posted successfully:', response.data);
      alert('Blog posted successfully!');
      router.push("/blogs");
    } catch (error) {
      console.error('Error posting blog:', error);
      alert('Failed to post the blog. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-20">
      <div className="p-6">
        <SectionTitleMinimal heading={'What is on your Mind?'}></SectionTitleMinimal>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Blog Title */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Blog Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-4 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out bg-gray-100 hover:bg-gray-50"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-4 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out bg-gray-100 hover:bg-gray-50"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className="w-full p-4 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out bg-gray-100 hover:bg-gray-50 resize-none"
            ></textarea>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out bg-gray-100 hover:bg-gray-50 resize-none"
              rows={4}
            ></textarea>
          </div>

{/* Photo Upload */}
<div className="mb-4 w-full md:w-1/2 p-3 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Blog Photo
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="cursor-pointer w-full text-gray-600 text-sm
                        file:mr-4 file:py-2 file:px-4 file:rounded-full
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 transition"
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="default"
            type="submit"
            className="w-full bg-primary-color text-white mt-5 px-4 rounded-md shadow-md hover:bg-gray-400 transition duration-200"
          >
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BlogFormPage;
