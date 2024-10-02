import Image from 'next/image';
import React from 'react';

const ServicesPage = () => {
  return (
    <div className="">
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-8 mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
            Our Team
          </h2>

          <div className="grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Team Member 1 */}
            <div className="w-full max-w-xs text-center">
              <Image
                className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                src="https://i.ibb.co.com/4jQKHbZ/myself-1.png" // Replace with a correct URL or path
                alt="Nahid"
                width={300}
                height={300}
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Nahid</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Team Leader</span>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="w-full max-w-xs text-center">
              <Image
                className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                src="https://i.ibb.co.com/g95Gd68/photo-2024-07-06-13-14-23.jpg" // Replace with a correct URL or path
                alt="Musa Akram Saleh"
                width={300}
                height={300}
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Musa Akram Saleh</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Team Member</span>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="w-full max-w-xs text-center">
              <Image
                className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                src="https://i.ibb.co.com/0Bfm4Wh/rzb4.jpg" // Replace with a correct URL or path
                alt="Rafiul"
                width={300}
                height={300}
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Rafiul Habib Razib</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Team Member</span>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="w-full max-w-xs text-center">
              <Image
                className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                src="https://i.ibb.co.com/1RSt7QY/Sa-Rana02.jpg" // Replace with a correct URL or path
                alt="Sayed Rana"
                width={300}
                height={300}
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Sayed Rana</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Team Member</span>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="w-full max-w-xs text-center">
              <Image
                className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                src="https://i.ibb.co.com/4JJjNS4/profile.png" // Replace with a correct URL or path
                alt="Tanvir"
                width={300}
                height={300}
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Tanvir Rahman Saim</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Team Member</span>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="w-full max-w-xs text-center">
              <Image
                className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                src="https://i.ibb.co.com/5RtZVqP/ashim.jpg" // Replace with a correct URL or path
                alt="Ashim"
                width={300}
                height={300}
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Ashim Kumar Sarker</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Team Member</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
