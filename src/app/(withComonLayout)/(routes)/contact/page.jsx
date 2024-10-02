import Image from "next/image";
import React from "react";

const Contact = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-white bg-opacity-50 shadow-md rounded-lg p-8 flex flex-col md:flex-row">
        <div className="md:w-1/2 flex justify-center items-center p-4 order-1 md:order-2">
          <Image
            src="https://i.ibb.co/mN0KhWY/question-mark-5976736-1920.png"
            alt="Contact Illustration"
            width={500} // Specify the width
            height={500} // Specify the height
            className="w-full h-auto"
          />
        </div>
        <div className="md:w-1/2 p-4 order-2 md:order-1">
          <h2 className="text-3xl font-bold mb-6 text-[#ff0000]">Contact us</h2>
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                placeholder="Message"
                rows="4"
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;